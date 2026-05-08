import type { MapPin, MapSummary, TimelineEvent } from "../types/models";

interface ApiMapAsset {
  id: string;
  file_name: string;
  mime_type: string;
  width: number;
  height: number;
  image_url: string;
}

interface ApiMapSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  era_label: string;
  asset: ApiMapAsset;
}

interface ApiPin {
  id: string;
  map_id: string;
  title: string;
  details: string;
  x_ratio: number;
  y_ratio: number;
}

interface ApiTimelineEvent {
  id: string;
  map_id: string;
  pin_id: string;
  label: string;
  year: string;
  summary: string;
}

interface LoginResponse {
  access_token: string;
}

interface DiscordWidgetChannel {
  id: string;
  name: string;
  position: number;
}

interface DiscordWidgetMember {
  id: string;
  username: string;
  discriminator: string;
  avatar: string | null;
  status: string;
  avatar_url?: string;
  channel_id?: string | null;
  mute?: boolean;
  deaf?: boolean;
  suppress?: boolean;
  self_mute?: boolean;
  self_deaf?: boolean;
}

export interface DiscordWidget {
  id: string;
  name: string;
  instant_invite: string | null;
  channels: DiscordWidgetChannel[];
  members: DiscordWidgetMember[];
  presence_count: number;
}

const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    const fallbackMessage = `Request failed with status ${response.status}`;

    try {
      const body = (await response.json()) as { detail?: string };
      throw new Error(body.detail || fallbackMessage);
    } catch {
      throw new Error(fallbackMessage);
    }
  }

  return (await response.json()) as T;
}

function mapSummaryFromApi(payload: ApiMapSummary): MapSummary {
  return {
    id: payload.id,
    title: payload.title,
    slug: payload.slug,
    description: payload.description,
    eraLabel: payload.era_label,
    asset: {
      id: payload.asset.id,
      fileName: payload.asset.file_name,
      mimeType: payload.asset.mime_type,
      width: payload.asset.width,
      height: payload.asset.height,
      imageUrl: payload.asset.image_url,
    },
  };
}

function pinFromApi(payload: ApiPin): MapPin {
  return {
    id: payload.id,
    mapId: payload.map_id,
    title: payload.title,
    details: payload.details,
    xRatio: payload.x_ratio,
    yRatio: payload.y_ratio,
  };
}

function timelineEventFromApi(payload: ApiTimelineEvent): TimelineEvent {
  return {
    id: payload.id,
    mapId: payload.map_id,
    pinId: payload.pin_id,
    label: payload.label,
    year: payload.year,
    summary: payload.summary,
  };
}

export async function fetchMaps(): Promise<MapSummary[]> {
  const payload = await requestJson<ApiMapSummary[]>("/maps");
  return payload.map(mapSummaryFromApi);
}

export async function fetchMapPins(mapId: string): Promise<MapPin[]> {
  const payload = await requestJson<ApiPin[]>(`/maps/${mapId}/pins`);
  return payload.map(pinFromApi);
}

export async function fetchMapTimeline(
  mapId: string,
): Promise<TimelineEvent[]> {
  const payload = await requestJson<ApiTimelineEvent[]>(
    `/maps/${mapId}/timeline`,
  );
  return payload.map(timelineEventFromApi);
}

export async function loginAdmin(
  username: string,
  password: string,
): Promise<string> {
  const payload = await requestJson<LoginResponse>("/admin/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });

  return payload.access_token;
}

export async function getDiscordWidget(): Promise<DiscordWidget> {
  return requestJson<DiscordWidget>("/discord/widget");
}
