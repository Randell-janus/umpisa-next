from datetime import timedelta

from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from accounts.models import User
from leaves.models import LeaveBalance, LeaveRequest, LeaveType
from leaves.services import approve_leave, count_weekdays

PASSWORD = "password123"
VACATION_DAYS = 15
SICK_DAYS = 10


class Command(BaseCommand):
    help = "Create demo users, leave balances and sample leave requests"

    @transaction.atomic
    def handle(self, *args, **options):
        if User.objects.filter(username="manager").exists():
            self.stdout.write("Demo data already exists, skipping.")
            return

        if not User.objects.filter(username="admin").exists():
            User.objects.create_superuser(username="admin", password=PASSWORD, email="admin@example.com")

        manager = User.objects.create_user(
            username="manager",
            password=PASSWORD,
            first_name="Maria",
            last_name="Santos",
            role=User.Role.MANAGER,
        )
        juan = self.create_employee("juan", "Juan", "Dela Cruz", manager)
        ana = self.create_employee("ana", "Ana", "Reyes", manager)

        today = timezone.localdate()
        next_monday = today + timedelta(days=7 - today.weekday())
        last_month_monday = next_monday - timedelta(weeks=5)

        past_leave = self.create_request(
            juan,
            LeaveType.VACATION,
            last_month_monday,
            last_month_monday + timedelta(days=1),
            "Out of town for a family event",
        )
        approve_leave(manager, past_leave.id, note="Approved, enjoy")
        self.create_request(juan, LeaveType.SICK, next_monday, next_monday, "Dental appointment")
        self.create_request(
            ana,
            LeaveType.VACATION,
            next_monday + timedelta(weeks=2),
            next_monday + timedelta(weeks=2, days=2),
            "Beach trip with friends",
        )

        self.stdout.write(self.style.SUCCESS(f"Demo data created. Password for all users: {PASSWORD}"))

    def create_employee(self, username, first_name, last_name, manager):
        employee = User.objects.create_user(
            username=username,
            password=PASSWORD,
            first_name=first_name,
            last_name=last_name,
            manager=manager,
        )
        LeaveBalance.objects.create(employee=employee, leave_type=LeaveType.VACATION, allocated_days=VACATION_DAYS)
        LeaveBalance.objects.create(employee=employee, leave_type=LeaveType.SICK, allocated_days=SICK_DAYS)
        return employee

    def create_request(self, employee, leave_type, start_date, end_date, reason):
        return LeaveRequest.objects.create(
            employee=employee,
            leave_type=leave_type,
            start_date=start_date,
            end_date=end_date,
            days=count_weekdays(start_date, end_date),
            reason=reason,
        )
