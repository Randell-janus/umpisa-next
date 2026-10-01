from datetime import timedelta

import jwt
from django.conf import settings
from django.utils import timezone
from graphql import GraphQLError

from .models import User

TOKEN_LIFETIME = timedelta(hours=8)


def create_token(user):
    now = timezone.now()
    payload = {"user_id": user.id, "iat": now, "exp": now + TOKEN_LIFETIME}
    return jwt.encode(payload, settings.SECRET_KEY, algorithm="HS256")


def get_user_from_token(token):
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        return None
    return User.objects.filter(pk=payload.get("user_id"), is_active=True).first()


def require_user(info):
    user = info.context.user
    if not user.is_authenticated:
        raise GraphQLError("You must be logged in.")
    return user


def require_manager(info):
    user = require_user(info)
    if not user.is_manager:
        raise GraphQLError("Only managers can do this.")
    return user
