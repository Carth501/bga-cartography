from uuid import uuid4

from fastapi import HTTPException, status

from app.core.config import get_settings
from app.schemas.maps import (
    MapAsset,
    MapCreateRequest,
    MapSummary,
    MapUpdateRequest,
    Pin,
    PinCreateRequest,
    TimelineEvent,
    TimelineEventCreateRequest,
)

placeholder_image = (
    "data:image/svg+xml;utf8,"
    "%3Csvg xmlns='http://www.w3.org/2000/svg' width='1600' height='1100' viewBox='0 0 1600 1100'%3E"
    "%3Crect width='1600' height='1100' fill='%230a1422'/%3E"
    "%3Cpath d='M180 260 C 350 120, 520 160, 680 290 S 980 520, 1210 420 1470 230, 1520 330' fill='none' stroke='%235ec2ff' stroke-width='3'/%3E"
    "%3Ctext x='220' y='170' fill='%23dce8ff' font-size='72' font-family='Georgia, serif'%3EFrontier Basin%3C/text%3E"
    "%3C/svg%3E"
)

maps: dict[str, MapSummary] = {
    "frontier-basin": MapSummary(
        id="frontier-basin",
        title="Frontier Basin",
        slug="frontier-basin",
        description="A prototype dark-atlas board with trade routes, settlements, and navigation markers.",
        era_label="Campaign Atlas",
        asset=MapAsset(
            id="asset-frontier-basin",
            file_name="frontier-basin.svg",
            mime_type="image/svg+xml",
            width=1600,
            height=1100,
            image_url=placeholder_image,
        ),
    ),
    "iron-ridge": MapSummary(
        id="iron-ridge",
        title="Iron Ridge",
        slug="iron-ridge",
        description="A second map slot to prove the list, selection, and synced content flow.",
        era_label="Survey Draft",
        asset=MapAsset(
            id="asset-iron-ridge",
            file_name="iron-ridge.svg",
            mime_type="image/svg+xml",
            width=1600,
            height=1100,
            image_url=placeholder_image,
        ),
    ),
}

pins: dict[str, Pin] = {
    "pin-harbor": Pin(
        id="pin-harbor",
        map_id="frontier-basin",
        title="Harbor Lantern",
        details="Primary point of entry for merchant fleets and diplomatic envoys.",
        x_ratio=0.28,
        y_ratio=0.58,
    ),
    "pin-archives": Pin(
        id="pin-archives",
        map_id="frontier-basin",
        title="Archive Spire",
        details="Administrative district where campaign records and charters are held.",
        x_ratio=0.63,
        y_ratio=0.33,
    ),
    "pin-ridge": Pin(
        id="pin-ridge",
        map_id="iron-ridge",
        title="Ridge Gate",
        details="Northern checkpoint controlling the mineral road through the ridge.",
        x_ratio=0.52,
        y_ratio=0.44,
    ),
}

events: dict[str, TimelineEvent] = {
    "event-harbor-charter": TimelineEvent(
        id="event-harbor-charter",
        map_id="frontier-basin",
        pin_id="pin-harbor",
        label="Harbor charter ratified",
        year="1848",
        summary="Trade authority was centralized and the bay became the region's primary customs checkpoint.",
    ),
    "event-archive-fire": TimelineEvent(
        id="event-archive-fire",
        map_id="frontier-basin",
        pin_id="pin-archives",
        label="Archive reconstruction",
        year="1853",
        summary="A major restoration project reorganized records after the north wing fire.",
    ),
    "event-ridge-expansion": TimelineEvent(
        id="event-ridge-expansion",
        map_id="iron-ridge",
        pin_id="pin-ridge",
        label="Ridge road expanded",
        year="1861",
        summary="The road widening campaign doubled freight capacity through the pass.",
    ),
}


def list_maps() -> list[MapSummary]:
    return list(maps.values())


def get_map(map_id: str) -> MapSummary:
    try:
        return maps[map_id]
    except KeyError as exc:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Map not found") from exc


def list_pins(map_id: str) -> list[Pin]:
    get_map(map_id)
    return [pin for pin in pins.values() if pin.map_id == map_id]


def list_events(map_id: str) -> list[TimelineEvent]:
    get_map(map_id)
    return [event for event in events.values() if event.map_id == map_id]


def create_map(payload: MapCreateRequest) -> MapSummary:
    map_id = payload.slug
    if map_id in maps:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="A map with this slug already exists")

    created = MapSummary(
        id=map_id,
        title=payload.title,
        slug=payload.slug,
        description=payload.description,
        era_label=payload.era_label,
        asset=MapAsset(
            id=f"asset-{map_id}",
            file_name="pending-upload",
            mime_type="application/octet-stream",
            width=1600,
            height=1100,
            image_url=placeholder_image,
        ),
    )
    maps[map_id] = created
    return created


def update_map(map_id: str, payload: MapUpdateRequest) -> MapSummary:
    current = get_map(map_id)
    updated = current.model_copy(
        update={
            "title": payload.title or current.title,
            "description": payload.description or current.description,
            "era_label": payload.era_label or current.era_label,
        }
    )
    maps[map_id] = updated
    return updated


def attach_asset(map_id: str, *, file_name: str, mime_type: str, width: int, height: int) -> MapSummary:
    current = get_map(map_id)
    settings = get_settings()
    safe_name = file_name.replace(" ", "-")
    updated = current.model_copy(
        update={
            "asset": MapAsset(
                id=f"asset-{uuid4().hex[:12]}",
                file_name=file_name,
                mime_type=mime_type,
                width=width,
                height=height,
                image_url=f"{settings.public_asset_base_url}/{map_id}/{safe_name}",
            )
        }
    )
    maps[map_id] = updated
    return updated


def create_pin(map_id: str, payload: PinCreateRequest) -> Pin:
    get_map(map_id)
    created = Pin(
        id=f"pin-{uuid4().hex[:12]}",
        map_id=map_id,
        title=payload.title,
        details=payload.details,
        x_ratio=payload.x_ratio,
        y_ratio=payload.y_ratio,
    )
    pins[created.id] = created
    return created


def create_event(map_id: str, payload: TimelineEventCreateRequest) -> TimelineEvent:
    get_map(map_id)
    pin = pins.get(payload.pin_id)
    if pin is None or pin.map_id != map_id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Timeline events must reference a pin on the same map")

    created = TimelineEvent(
        id=f"event-{uuid4().hex[:12]}",
        map_id=map_id,
        pin_id=payload.pin_id,
        label=payload.label,
        year=payload.year,
        summary=payload.summary,
    )
    events[created.id] = created
    return created
