import type { MapPin, MapSummary, TimelineEvent } from '../../types/models';

const atlasPlaceholder =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1100" viewBox="0 0 1600 1100">
      <defs>
        <linearGradient id="night" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#08111f" />
          <stop offset="60%" stop-color="#11253a" />
          <stop offset="100%" stop-color="#1d3953" />
        </linearGradient>
      </defs>
      <rect width="1600" height="1100" fill="url(#night)" />
      <g fill="none" stroke="#5ec2ff" stroke-width="3" opacity="0.75">
        <path d="M180 260 C 350 120, 520 160, 680 290 S 980 520, 1210 420 1470 230, 1520 330" />
        <path d="M120 760 C 280 680, 520 720, 640 630 S 980 440, 1210 590 1400 850, 1500 790" />
        <path d="M510 70 L 460 980" opacity="0.35" />
        <path d="M940 50 L 990 1030" opacity="0.35" />
      </g>
      <g fill="#dce8ff" opacity="0.85" font-family="Georgia, serif">
        <text x="220" y="170" font-size="72">Frontier Basin</text>
        <text x="1080" y="920" font-size="42" opacity="0.7">Prototype atlas surface</text>
      </g>
    </svg>
  `);

export const maps: MapSummary[] = [
  {
    id: 'frontier-basin',
    title: 'Frontier Basin',
    slug: 'frontier-basin',
    description: 'A prototype dark-atlas board with trade routes, settlements, and navigation markers.',
    eraLabel: 'Campaign Atlas',
    asset: {
      id: 'asset-frontier-basin',
      fileName: 'frontier-basin.svg',
      mimeType: 'image/svg+xml',
      width: 1600,
      height: 1100,
      imageUrl: atlasPlaceholder,
    },
  },
  {
    id: 'iron-ridge',
    title: 'Iron Ridge',
    slug: 'iron-ridge',
    description: 'A second map slot to prove the list, selection, and synced content flow.',
    eraLabel: 'Survey Draft',
    asset: {
      id: 'asset-iron-ridge',
      fileName: 'frontier-basin.svg',
      mimeType: 'image/svg+xml',
      width: 1600,
      height: 1100,
      imageUrl: atlasPlaceholder,
    },
  },
];

export const pins: MapPin[] = [
  {
    id: 'pin-harbor',
    mapId: 'frontier-basin',
    title: 'Harbor Lantern',
    details: 'Primary point of entry for merchant fleets and diplomatic envoys.',
    xRatio: 0.28,
    yRatio: 0.58,
  },
  {
    id: 'pin-archives',
    mapId: 'frontier-basin',
    title: 'Archive Spire',
    details: 'Administrative district where campaign records and charters are held.',
    xRatio: 0.63,
    yRatio: 0.33,
  },
  {
    id: 'pin-ridge',
    mapId: 'iron-ridge',
    title: 'Ridge Gate',
    details: 'Northern checkpoint controlling the mineral road through the ridge.',
    xRatio: 0.52,
    yRatio: 0.44,
  },
];

export const events: TimelineEvent[] = [
  {
    id: 'event-harbor-charter',
    mapId: 'frontier-basin',
    pinId: 'pin-harbor',
    label: 'Harbor charter ratified',
    year: '1848',
    summary: 'Trade authority was centralized and the bay became the region\'s primary customs checkpoint.',
  },
  {
    id: 'event-archive-fire',
    mapId: 'frontier-basin',
    pinId: 'pin-archives',
    label: 'Archive reconstruction',
    year: '1853',
    summary: 'A major restoration project reorganized records after the north wing fire.',
  },
  {
    id: 'event-ridge-expansion',
    mapId: 'iron-ridge',
    pinId: 'pin-ridge',
    label: 'Ridge road expanded',
    year: '1861',
    summary: 'The road widening campaign doubled freight capacity through the pass.',
  },
];
