import graphene
from django.core.exceptions import PermissionDenied, ValidationError
from django.db.models import Q
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from accounts.auth import require_manager, require_user

from . import services
from .models import LeaveBalance, LeaveRequest, LeaveType

LeaveTypeEnum = graphene.Enum.from_enum(LeaveType)


def run_service(func, *args, **kwargs):
    try:
        return func(*args, **kwargs)
    except ValidationError as error:
        raise GraphQLError(error.messages[0])
    except PermissionDenied as error:
        raise GraphQLError(str(error))


class LeaveBalanceType(DjangoObjectType):
    remaining_days = graphene.Int(required=True)

    class Meta:
        model = LeaveBalance
        fields = ("id", "leave_type", "allocated_days", "used_days")
        convert_choices_to_enum = False


class LeaveRequestType(DjangoObjectType):
    balance = graphene.Field(LeaveBalanceType)

    class Meta:
        model = LeaveRequest
        fields = (
            "id",
            "employee",
            "leave_type",
            "start_date",
            "end_date",
            "days",
            "reason",
            "status",
            "reviewed_by",
            "reviewed_at",
            "manager_note",
            "created_at",
        )
        convert_choices_to_enum = False

    def resolve_balance(self, info):
        return LeaveBalance.objects.filter(employee=self.employee, leave_type=self.leave_type).first()


class Query(graphene.ObjectType):
    my_balances = graphene.List(graphene.NonNull(LeaveBalanceType), required=True)
    my_leave_requests = graphene.List(graphene.NonNull(LeaveRequestType), required=True)
    leave_request = graphene.Field(LeaveRequestType, id=graphene.ID(required=True))
    pending_approvals = graphene.List(graphene.NonNull(LeaveRequestType), required=True)

    def resolve_my_balances(self, info):
        user = require_user(info)
        return user.leave_balances.order_by("leave_type")

    def resolve_my_leave_requests(self, info):
        user = require_user(info)
        return user.leave_requests.all()

    def resolve_leave_request(self, info, id):
        user = require_user(info)
        if not id.isdigit():
            return None
        return (
            LeaveRequest.objects.select_related("employee", "reviewed_by")
            .filter(Q(employee=user) | Q(employee__manager=user), pk=id)
            .first()
        )

    def resolve_pending_approvals(self, info):
        manager = require_manager(info)
        return (
            LeaveRequest.objects.select_related("employee")
            .filter(employee__manager=manager, status=LeaveRequest.Status.PENDING)
            .order_by("start_date")
        )


class FileLeave(graphene.Mutation):
    class Arguments:
        leave_type = LeaveTypeEnum(required=True)
        start_date = graphene.Date(required=True)
        end_date = graphene.Date(required=True)
        reason = graphene.String(required=True)

    leave_request = graphene.Field(LeaveRequestType, required=True)

    def mutate(self, info, leave_type, start_date, end_date, reason):
        user = require_user(info)
        leave_request = run_service(services.file_leave, user, leave_type.value, start_date, end_date, reason)
        return FileLeave(leave_request=leave_request)


class ApproveLeave(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        note = graphene.String()

    leave_request = graphene.Field(LeaveRequestType, required=True)

    def mutate(self, info, id, note=""):
        manager = require_manager(info)
        leave_request = run_service(services.approve_leave, manager, id, note)
        return ApproveLeave(leave_request=leave_request)


class RejectLeave(graphene.Mutation):
    class Arguments:
        id = graphene.ID(required=True)
        note = graphene.String()

    leave_request = graphene.Field(LeaveRequestType, required=True)

    def mutate(self, info, id, note=""):
        manager = require_manager(info)
        leave_request = run_service(services.reject_leave, manager, id, note)
        return RejectLeave(leave_request=leave_request)


class Mutation(graphene.ObjectType):
    file_leave = FileLeave.Field()
    approve_leave = ApproveLeave.Field()
    reject_leave = RejectLeave.Field()
