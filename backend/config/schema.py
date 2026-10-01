import graphene

from accounts.schema import Mutation as AccountsMutation
from accounts.schema import Query as AccountsQuery
from leaves.schema import Mutation as LeavesMutation
from leaves.schema import Query as LeavesQuery


class Query(AccountsQuery, LeavesQuery, graphene.ObjectType):
    pass


class Mutation(AccountsMutation, LeavesMutation, graphene.ObjectType):
    pass


schema = graphene.Schema(query=Query, mutation=Mutation)
