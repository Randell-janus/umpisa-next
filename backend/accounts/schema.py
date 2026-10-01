import graphene
from django.contrib.auth import authenticate
from graphene_django import DjangoObjectType
from graphql import GraphQLError

from .auth import create_token
from .models import User


class UserType(DjangoObjectType):
    full_name = graphene.String(required=True)

    class Meta:
        model = User
        fields = ("id", "username", "first_name", "last_name", "role", "manager")
        convert_choices_to_enum = False

    def resolve_full_name(self, info):
        return self.get_full_name() or self.username


class Query(graphene.ObjectType):
    me = graphene.Field(UserType)

    def resolve_me(self, info):
        user = info.context.user
        return user if user.is_authenticated else None


class Login(graphene.Mutation):
    class Arguments:
        username = graphene.String(required=True)
        password = graphene.String(required=True)

    token = graphene.String(required=True)
    user = graphene.Field(UserType, required=True)

    def mutate(self, info, username, password):
        user = authenticate(username=username, password=password)
        if user is None:
            raise GraphQLError("Invalid username or password.")
        return Login(token=create_token(user), user=user)


class Mutation(graphene.ObjectType):
    login = Login.Field()
