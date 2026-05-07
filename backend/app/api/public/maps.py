from fastapi import APIRouter

from app.data.store import get_map, list_events, list_maps, list_pins
from app.schemas.maps import MapSummary, Pin, TimelineEvent

router = APIRouter(prefix="/api/maps", tags=["maps"])


@router.get("", response_model=list[MapSummary])
def get_maps() -> list[MapSummary]:
    return list_maps()


@router.get("/{map_id}", response_model=MapSummary)
def get_map_by_id(map_id: str) -> MapSummary:
    return get_map(map_id)


@router.get("/{map_id}/pins", response_model=list[Pin])
def get_map_pins(map_id: str) -> list[Pin]:
    return list_pins(map_id)


@router.get("/{map_id}/timeline", response_model=list[TimelineEvent])
def get_map_timeline(map_id: str) -> list[TimelineEvent]:
    return list_events(map_id)
