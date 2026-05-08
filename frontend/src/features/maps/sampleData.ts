import type { MapPin, MapSummary, TimelineEvent } from "../../types/models";

import bergamoImage from "../../../maps/bergamo.png";

export const maps: MapSummary[] = [
  {
    id: "frontier-basin",
    title: "Frontier Basin",
    slug: "frontier-basin",
    description:
      "A prototype dark-atlas board with trade routes, settlements, and navigation markers.",
    eraLabel: "Campaign Atlas",
    asset: {
      id: "asset-frontier-basin",
      fileName: "bergamo.png",
      mimeType: "image/png",
      width: 1440,
      height: 1435,
      imageUrl: bergamoImage,
    },
  },
  {
    id: "iron-ridge",
    title: "Iron Ridge",
    slug: "iron-ridge",
    description:
      "A second map slot to prove the list, selection, and synced content flow.",
    eraLabel: "Survey Draft",
    asset: {
      id: "asset-iron-ridge",
      fileName: "bergamo.png",
      mimeType: "image/png",
      width: 1440,
      height: 1435,
      imageUrl: bergamoImage,
    },
  },
];

export const pins: MapPin[] = [
  {
    id: "pin-harbor",
    mapId: "frontier-basin",
    title: "Harbor Lantern",
    details:
      "Primary point of entry for merchant fleets and diplomatic envoys.",
    xRatio: 0.28,
    yRatio: 0.58,
  },
  {
    id: "pin-archives",
    mapId: "frontier-basin",
    title: "Archive Spire",
    details:
      "Administrative district where campaign records and charters are held.",
    xRatio: 0.63,
    yRatio: 0.33,
  },
  {
    id: "pin-ridge",
    mapId: "iron-ridge",
    title: "Ridge Gate",
    details:
      "Northern checkpoint controlling the mineral road through the ridge.",
    xRatio: 0.52,
    yRatio: 0.44,
  },
];

export const events: TimelineEvent[] = [
  {
    id: "event-harbor-charter",
    mapId: "frontier-basin",
    pinId: "pin-harbor",
    label: "Harbor charter ratified",
    year: "1848",
    summary:
      "Trade authority was centralized and the bay became the region's primary customs checkpoint.",
  },
  {
    id: "event-archive-fire",
    mapId: "frontier-basin",
    pinId: "pin-archives",
    label: "Archive reconstruction",
    year: "1853",
    summary:
      "A major restoration project reorganized records after the north wing fire.",
  },
  {
    id: "event-ridge-expansion",
    mapId: "iron-ridge",
    pinId: "pin-ridge",
    label: "Ridge road expanded",
    year: "1861",
    summary:
      "The road widening campaign doubled freight capacity through the pass.",
  },
];
