from pydantic import BaseModel, Field


class MapAsset(BaseModel):
    id: str
    file_name: str
    mime_type: str
    width: int
    height: int
    image_url: str


class MapSummary(BaseModel):
    id: str
    title: str
    slug: str
    description: str
    era_label: str
    asset: MapAsset


class Pin(BaseModel):
    id: str
    map_id: str
    title: str
    details: str
    x_ratio: float = Field(ge=0, le=1)
    y_ratio: float = Field(ge=0, le=1)


class TimelineEvent(BaseModel):
    id: str
    map_id: str
    pin_id: str
    label: str
    year: str
    summary: str


class MapCreateRequest(BaseModel):
    title: str
    slug: str
    description: str
    era_label: str


class MapUpdateRequest(BaseModel):
    title: str | None = None
    description: str | None = None
    era_label: str | None = None


class PinCreateRequest(BaseModel):
    title: str
    details: str
    x_ratio: float = Field(ge=0, le=1)
    y_ratio: float = Field(ge=0, le=1)


class TimelineEventCreateRequest(BaseModel):
    pin_id: str
    label: str
    year: str
    summary: str
