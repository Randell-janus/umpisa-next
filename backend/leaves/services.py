from datetime import timedelta

from django.core.exceptions import PermissionDenied, ValidationError
from django.db import transaction
from django.utils import timezone

from .models import LeaveBalance, LeaveRequest


def count_weekdays(start_date, end_date):
    days = 0
    current = start_date
    while current <= end_date:
        if current.weekday() < 5:
            days += 1
        current += timedelta(days=1)
    return days


def file_leave(employee, leave_type, start_date, end_date, reason):
    if employee.manager_id is None:
        raise ValidationError("You don't have a manager assigned to review your leave.")
    if end_date < start_date:
        raise ValidationError("End date cannot be before the start date.")
    if start_date < timezone.localdate():
        raise ValidationError("Start date cannot be in the past.")
    if not reason.strip():
        raise ValidationError("Reason is required.")

    days = count_weekdays(start_date, end_date)
    if days == 0:
        raise ValidationError("Selected dates don't include any weekdays.")

    balance = LeaveBalance.objects.filter(employee=employee, leave_type=leave_type).first()
    remaining = balance.remaining_days if balance else 0
    if days > remaining:
        raise ValidationError(f"Not enough leave credits. You have {remaining} day(s) left.")

    has_overlap = LeaveRequest.objects.filter(
        employee=employee,
        status__in=[LeaveRequest.Status.PENDING, LeaveRequest.Status.APPROVED],
        start_date__lte=end_date,
        end_date__gte=start_date,
    ).exists()
    if has_overlap:
        raise ValidationError("You already have a leave request on these dates.")

    return LeaveRequest.objects.create(
        employee=employee,
        leave_type=leave_type,
        start_date=start_date,
        end_date=end_date,
        days=days,
        reason=reason.strip(),
    )


def _get_request_for_review(manager, request_id):
    leave_request = (
        LeaveRequest.objects.select_for_update(of=("self",))
        .select_related("employee")
        .filter(pk=request_id)
        .first()
    )
    if leave_request is None:
        raise ValidationError("Leave request not found.")
    if leave_request.employee.manager_id != manager.id:
        raise PermissionDenied("You can only review requests from your team.")
    if leave_request.status != LeaveRequest.Status.PENDING:
        raise ValidationError("This request has already been reviewed.")
    return leave_request


def _mark_reviewed(leave_request, manager, status, note):
    leave_request.status = status
    leave_request.reviewed_by = manager
    leave_request.reviewed_at = timezone.now()
    leave_request.manager_note = note.strip()
    leave_request.save(update_fields=["status", "reviewed_by", "reviewed_at", "manager_note"])
    return leave_request


@transaction.atomic
def approve_leave(manager, request_id, note=""):
    leave_request = _get_request_for_review(manager, request_id)

    balance = (
        LeaveBalance.objects.select_for_update()
        .filter(employee=leave_request.employee, leave_type=leave_request.leave_type)
        .first()
    )
    if balance is None or leave_request.days > balance.remaining_days:
        raise ValidationError("Employee doesn't have enough leave credits for this request.")

    balance.used_days += leave_request.days
    balance.save(update_fields=["used_days"])
    return _mark_reviewed(leave_request, manager, LeaveRequest.Status.APPROVED, note)


@transaction.atomic
def reject_leave(manager, request_id, note=""):
    leave_request = _get_request_for_review(manager, request_id)
    return _mark_reviewed(leave_request, manager, LeaveRequest.Status.REJECTED, note)
