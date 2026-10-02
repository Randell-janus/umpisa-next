from datetime import date, timedelta

from django.core.exceptions import PermissionDenied, ValidationError
from django.test import TestCase
from django.utils import timezone

from accounts.models import User
from leaves.models import LeaveBalance, LeaveRequest, LeaveType
from leaves.services import approve_leave, count_weekdays, file_leave, reject_leave


def next_monday():
    today = timezone.localdate()
    return today + timedelta(days=7 - today.weekday())


class CountWeekdaysTests(TestCase):
    def test_single_weekday(self):
        self.assertEqual(count_weekdays(date(2026, 10, 5), date(2026, 10, 5)), 1)

    def test_full_week_skips_weekend(self):
        self.assertEqual(count_weekdays(date(2026, 10, 5), date(2026, 10, 11)), 5)

    def test_weekend_only(self):
        self.assertEqual(count_weekdays(date(2026, 10, 10), date(2026, 10, 11)), 0)


class LeaveServiceTestCase(TestCase):
    def setUp(self):
        self.manager = User.objects.create_user(
            username="manager", password="pass", role=User.Role.MANAGER
        )
        self.other_manager = User.objects.create_user(
            username="other", password="pass", role=User.Role.MANAGER
        )
        self.employee = User.objects.create_user(
            username="employee", password="pass", manager=self.manager
        )
        self.balance = LeaveBalance.objects.create(
            employee=self.employee, leave_type=LeaveType.VACATION, allocated_days=5
        )
        self.monday = next_monday()

    def file(self, start, end, reason="Family trip"):
        return file_leave(self.employee, LeaveType.VACATION, start, end, reason)


class FileLeaveTests(LeaveServiceTestCase):
    def test_creates_pending_request_with_weekday_count(self):
        leave_request = self.file(self.monday, self.monday + timedelta(days=6))

        self.assertEqual(leave_request.status, LeaveRequest.Status.PENDING)
        self.assertEqual(leave_request.days, 5)

    def test_end_before_start(self):
        with self.assertRaisesMessage(ValidationError, "End date cannot be before the start date."):
            self.file(self.monday, self.monday - timedelta(days=1))

    def test_start_in_past(self):
        yesterday = timezone.localdate() - timedelta(days=1)
        with self.assertRaisesMessage(ValidationError, "Start date cannot be in the past."):
            self.file(yesterday, yesterday)

    def test_more_days_than_remaining(self):
        with self.assertRaisesMessage(ValidationError, "Not enough leave credits. You have 5 day(s) left."):
            self.file(self.monday, self.monday + timedelta(days=7))

    def test_overlapping_request(self):
        self.file(self.monday, self.monday + timedelta(days=2))
        with self.assertRaisesMessage(ValidationError, "You already have a leave request on these dates."):
            self.file(self.monday + timedelta(days=2), self.monday + timedelta(days=3))

    def test_overlap_with_rejected_request_is_allowed(self):
        rejected = self.file(self.monday, self.monday)
        reject_leave(self.manager, rejected.id)

        leave_request = self.file(self.monday, self.monday)

        self.assertEqual(leave_request.status, LeaveRequest.Status.PENDING)


class ReviewLeaveTests(LeaveServiceTestCase):
    def test_approve_deducts_balance(self):
        leave_request = self.file(self.monday, self.monday + timedelta(days=2))

        approve_leave(self.manager, leave_request.id, note="Enjoy")

        leave_request.refresh_from_db()
        self.balance.refresh_from_db()
        self.assertEqual(leave_request.status, LeaveRequest.Status.APPROVED)
        self.assertEqual(leave_request.reviewed_by, self.manager)
        self.assertEqual(self.balance.remaining_days, 2)

    def test_reject_keeps_balance(self):
        leave_request = self.file(self.monday, self.monday + timedelta(days=2))

        reject_leave(self.manager, leave_request.id, note="Busy week")

        leave_request.refresh_from_db()
        self.balance.refresh_from_db()
        self.assertEqual(leave_request.status, LeaveRequest.Status.REJECTED)
        self.assertEqual(self.balance.used_days, 0)

    def test_only_own_manager_can_review(self):
        leave_request = self.file(self.monday, self.monday)

        with self.assertRaises(PermissionDenied):
            approve_leave(self.other_manager, leave_request.id)

    def test_cannot_review_twice(self):
        leave_request = self.file(self.monday, self.monday)
        approve_leave(self.manager, leave_request.id)

        with self.assertRaisesMessage(ValidationError, "This request has already been reviewed."):
            reject_leave(self.manager, leave_request.id)

    def test_rechecks_balance_on_approval(self):
        leave_request = self.file(self.monday, self.monday + timedelta(days=2))
        self.balance.used_days = 4
        self.balance.save()

        message = "Employee doesn't have enough leave credits for this request."
        with self.assertRaisesMessage(ValidationError, message):
            approve_leave(self.manager, leave_request.id)
