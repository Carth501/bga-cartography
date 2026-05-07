from typing import Annotated

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status

from app.core.auth import require_admin_token
from app.core.config import get_settings
from app.data.store import attach_asset, create_event, create_map, create_pin, update_map
from app.schemas.maps import (
    MapCreateRequest,
    MapSummary,
    MapUpdateRequest,
    Pin,
    PinCreateRequest,
    TimelineEvent,
    TimelineEventCreateRequest,
)

router = APIRouter(prefix="/api/admin", tags=["admin-maps"])
AdminToken = Annotated[str, Depends(require_admin_token)]
ALLOWED_MIME_TYPES = {"image/png", "image/jpeg", "image/webp", "image/svg+xml"}


@router.post("/maps", response_model=MapSummary, status_code=status.HTTP_201_CREATED)
def create_map_route(payload: MapCreateRequest, _: AdminToken) -> MapSummary:
    return create_map(payload)


@router.patch("/maps/{map_id}", response_model=MapSummary)
def update_map_route(map_id: str, payload: MapUpdateRequest, _: AdminToken) -> MapSummary:
    return update_map(map_id, payload)


@router.post("/maps/{map_id}/asset", response_model=MapSummary)
async def upload_map_asset(
    map_id: str,
    _: AdminToken,
    file: UploadFile = File(...),
    width: int = Form(...),
    height: int = Form(...),
) -> MapSummary:
    settings = get_settings()
    content_type = file.content_type or "application/octet-stream"
    if content_type not in ALLOWED_MIME_TYPES:
        raise HTTPException(status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE, detail="Unsupported image type")

    content = await file.read()
    if len(content) > settings.max_upload_bytes:
        raise HTTPException(status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE, detail="Upload exceeds configured limit")

    file_name = file.filename or "uploaded-map"
    return attach_asset(map_id, file_name=file_name, mime_type=content_type, width=width, height=height)


@router.post("/maps/{map_id}/pins", response_model=Pin, status_code=status.HTTP_201_CREATED)
def create_pin_route(map_id: str, payload: PinCreateRequest, _: AdminToken) -> Pin:
    return create_pin(map_id, payload)


@router.post("/maps/{map_id}/timeline", response_model=TimelineEvent, status_code=status.HTTP_201_CREATED)
def create_timeline_event_route(map_id: str, payload: TimelineEventCreateRequest, _: AdminToken) -> TimelineEvent:
    return create_event(map_id, payload)
