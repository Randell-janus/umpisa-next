from .auth import get_user_from_token


class TokenAuthenticationMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        header = request.headers.get("Authorization", "")
        if header.startswith("Bearer "):
            user = get_user_from_token(header.removeprefix("Bearer "))
            if user is not None:
                request.user = user
        return self.get_response(request)
