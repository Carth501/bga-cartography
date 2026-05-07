export interface MapAsset {
  id: string;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  imageUrl: string;
}

export interface MapSummary {
  id: string;
  title: string;
  slug: string;
  description: string;
  eraLabel: string;
  asset: MapAsset;
}

export interface MapPin {
  id: string;
  mapId: string;
  title: string;
  details: string;
  xRatio: number;
  yRatio: number;
}

export interface TimelineEvent {
  id: string;
  mapId: string;
  pinId: string;
  label: string;
  year: string;
  summary: string;
}
