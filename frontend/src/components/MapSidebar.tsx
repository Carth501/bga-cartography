import type { MapSummary } from '../types/models';

interface MapSidebarProps {
  maps: MapSummary[];
  activeMapId: string;
  onSelectMap: (mapId: string) => void;
}

export function MapSidebar({ maps, activeMapId, onSelectMap }: MapSidebarProps) {
  return (
    <aside className="sidebar border-end border-secondary-subtle p-3">
      <div className="mb-4">
        <p className="eyebrow mb-2 text-uppercase text-secondary">Maps</p>
        <h2 className="h5 mb-0">Archive</h2>
      </div>
      <div className="d-grid gap-2">
        {maps.map((map) => {
          const active = map.id === activeMapId;

          return (
            <button
              key={map.id}
              className={`map-card btn ${active ? 'btn-light text-dark' : 'btn-outline-secondary text-start'}`}
              type="button"
              onClick={() => onSelectMap(map.id)}
            >
              <span className="d-block fw-semibold">{map.title}</span>
              <span className="d-block small text-body-secondary">{map.eraLabel}</span>
              <span className="d-block small mt-2">{map.description}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
