from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = Field(default="BGA Cartography API", alias="APP_NAME")
    app_env: str = Field(default="development", alias="APP_ENV")
    cors_origins: list[str] = Field(default=["http://localhost:5173"], alias="CORS_ORIGINS")
    admin_username: str = Field(default="admin", alias="ADMIN_USERNAME")
    admin_password: str = Field(default="change-me", alias="ADMIN_PASSWORD")
    public_asset_base_url: str = Field(default="http://localhost:9000/maps", alias="PUBLIC_ASSET_BASE_URL")
    max_upload_bytes: int = Field(default=5 * 1024 * 1024, alias="MAX_UPLOAD_BYTES")


@lru_cache
def get_settings() -> Settings:
    return Settings()
