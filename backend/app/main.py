from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.admin.auth import router as admin_auth_router
from app.api.admin.maps import router as admin_maps_router
from app.api.public.maps import router as public_maps_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(public_maps_router)
app.include_router(admin_auth_router)
app.include_router(admin_maps_router)


@app.get("/api/health", tags=["health"])
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "environment": settings.app_env}
