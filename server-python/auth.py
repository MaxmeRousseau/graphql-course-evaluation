import jwt
from functools import wraps
from flask import request

SECRET = "dev-secret-change-me"


def get_user_from_token():
    """
    Extraire l'utilisateur du token JWT dans les headers
    """
    auth_header = request.headers.get("Authorization", "")

    if auth_header.startswith("Bearer "):
        token = auth_header[7:]
        try:
            payload = jwt.decode(token, SECRET, algorithms=["HS256"])
            return payload
        except jwt.InvalidTokenError:
            return None

    return None


def require_auth(f):
    """
    Décorateur pour vérifier l'authentification
    """

    @wraps(f)
    def decorated_function(*args, **kwargs):
        user = get_user_from_token()
        if not user:
            raise Exception("Unauthorized")
        return f(*args, user=user, **kwargs)

    return decorated_function


class AuthMiddleware:
    """
    Middleware pour ajouter l'utilisateur au context
    """

    def resolve(self, next, root, info, **args):
        info.context.user = get_user_from_token()
        return next(root, info, **args)
