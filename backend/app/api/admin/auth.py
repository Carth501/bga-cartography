from fastapi import APIRouter

from app.core.auth import issue_admin_token
from app.schemas.auth import LoginRequest, LoginResponse

router = APIRouter(prefix="/api/admin", tags=["admin-auth"])


@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest) -> LoginResponse:
    token = issue_admin_token(payload.username, payload.password)
    return LoginResponse(access_token=token)
