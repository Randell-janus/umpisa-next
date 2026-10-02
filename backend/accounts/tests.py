import jwt
from django.conf import settings
from django.test import TestCase

from accounts.auth import create_token, get_user_from_token
from accounts.models import User


class TokenTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="juan", password="pass")

    def test_valid_token_returns_user(self):
        token = create_token(self.user)

        self.assertEqual(get_user_from_token(token), self.user)

    def test_tampered_token_is_rejected(self):
        token = jwt.encode({"user_id": self.user.id}, "wrong-secret", algorithm="HS256")

        self.assertIsNone(get_user_from_token(token))

    def test_inactive_user_is_rejected(self):
        token = create_token(self.user)
        self.user.is_active = False
        self.user.save()

        self.assertIsNone(get_user_from_token(token))

    def test_token_is_signed_with_secret_key(self):
        payload = jwt.decode(create_token(self.user), settings.SECRET_KEY, algorithms=["HS256"])

        self.assertEqual(payload["user_id"], self.user.id)
