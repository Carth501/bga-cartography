import secrets
from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.core.config import get_settings

security = HTTPBearer(auto_error=False)
active_tokens: set[str] = set()


def issue_admin_token(username: str, password: str) -> str:
    settings = get_settings()
    credentials_match = secrets.compare_digest(username, settings.admin_username) and secrets.compare_digest(
        password,
        settings.admin_password,
    )

    if not credentials_match:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid administrator credentials")

    token = secrets.token_urlsafe(24)
    active_tokens.add(token)
    return token


def require_admin_token(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(security)],
) -> str:
    if credentials is None or credentials.scheme.lower() != "bearer" or credentials.credentials not in active_tokens:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Administrator token required")

    return credentials.credentials
