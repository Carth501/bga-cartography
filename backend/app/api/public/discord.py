import json
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.request import urlopen

from fastapi import APIRouter, HTTPException

from app.core.config import get_settings

router = APIRouter(prefix="/api/discord", tags=["discord"])


@router.get("/widget")
def get_discord_widget() -> dict[str, Any]:
    settings = get_settings()
    endpoint = f"https://discord.com/api/guilds/{settings.discord_guild_id}/widget.json"

    try:
        with urlopen(endpoint, timeout=settings.discord_widget_timeout_seconds) as response:
            payload = json.load(response)
    except HTTPError as exc:
        raise HTTPException(
            status_code=502,
            detail=f"Discord widget request failed with status {exc.code}",
        ) from exc
    except (URLError, TimeoutError, json.JSONDecodeError) as exc:
        raise HTTPException(status_code=502, detail="Discord widget request failed") from exc

    if not isinstance(payload, dict):
        raise HTTPException(status_code=502, detail="Discord widget response was invalid")

    return payload