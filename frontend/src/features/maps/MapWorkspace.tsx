import { useEffect, useMemo, useState } from 'react';

import { MapSidebar } from '../../components/MapSidebar';
import { TopBar } from '../../components/TopBar';
import type { MapPin, TimelineEvent } from '../../types/models';
import { LoginModal } from '../auth/LoginModal';
import { fetchMapPins, fetchMaps, fetchMapTimeline } from '../../services/api';
import { OpenLayersMap } from './OpenLayersMap';
import { events, maps, pins } from './sampleData';
import { TimelinePanel } from '../timeline/TimelinePanel';

function getMapPins(activeMapId: string): MapPin[] {
  return pins.filter((pin) => pin.mapId === activeMapId);
}

function getTimelineEvents(activeMapId: string): TimelineEvent[] {
  return events.filter((event) => event.mapId === activeMapId);
}

export function MapWorkspace() {
  const [mapItems, setMapItems] = useState(maps);
  const [activeMapId, setActiveMapId] = useState(maps[0].id);
  const [focusedPinId, setFocusedPinId] = useState<string | null>(pins[0].id);
  const [pinItems, setPinItems] = useState<MapPin[]>(getMapPins(maps[0].id));
  const [eventItems, setEventItems] = useState<TimelineEvent[]>(getTimelineEvents(maps[0].id));
  const [dataSource, setDataSource] = useState<'loading' | 'api' | 'fallback'>('loading');
  const [statusCopy, setStatusCopy] = useState('Attempting to load data from the backend API.');
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const activeMap = useMemo(
    () => mapItems.find((map) => map.id === activeMapId) ?? mapItems[0],
    [activeMapId, mapItems],
  );
  const activePins = useMemo(() => pinItems, [pinItems]);
  const activeEvents = useMemo(() => eventItems, [eventItems]);

  const focusedPin = activePins.find((pin) => pin.id === focusedPinId) ?? null;

  useEffect(() => {
    let cancelled = false;

    async function loadMaps() {
      try {
        const nextMaps = await fetchMaps();
        if (cancelled || nextMaps.length === 0) {
          return;
        }

        setMapItems(nextMaps);
        setActiveMapId((current) => (nextMaps.some((map) => map.id === current) ? current : nextMaps[0].id));
        setDataSource('api');
        setStatusCopy('Connected to the backend API. Map, pin, and timeline data are live.');
      } catch {
        if (cancelled) {
          return;
        }

        setMapItems(maps);
        setActiveMapId(maps[0].id);
        setDataSource('fallback');
        setStatusCopy('Backend unavailable. Using bundled prototype data until the API is running.');
      }
    }

    void loadMaps();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadMapDetails() {
      const fallbackPins = getMapPins(activeMapId);
      const fallbackEvents = getTimelineEvents(activeMapId);

      if (dataSource !== 'api') {
        setPinItems(fallbackPins);
        setEventItems(fallbackEvents);
        setFocusedPinId((current) => (fallbackPins.some((pin) => pin.id === current) ? current : fallbackPins[0]?.id ?? null));
        return;
      }

      try {
        const [nextPins, nextEvents] = await Promise.all([fetchMapPins(activeMapId), fetchMapTimeline(activeMapId)]);
        if (cancelled) {
          return;
        }

        setPinItems(nextPins);
        setEventItems(nextEvents);
        setFocusedPinId((current) => (nextPins.some((pin) => pin.id === current) ? current : nextPins[0]?.id ?? null));
      } catch {
        if (cancelled) {
          return;
        }

        setPinItems(fallbackPins);
        setEventItems(fallbackEvents);
        setFocusedPinId((current) => (fallbackPins.some((pin) => pin.id === current) ? current : fallbackPins[0]?.id ?? null));
        setDataSource('fallback');
        setStatusCopy('API requests failed for the selected map. Reverted to bundled prototype data.');
      }
    }

    void loadMapDetails();

    return () => {
      cancelled = true;
    };
  }, [activeMapId, dataSource]);

  const handleSelectMap = (mapId: string) => {
    setActiveMapId(mapId);
  };

  const handleSelectEvent = (pinId: string) => {
    setFocusedPinId(pinId);
  };

  return (
    <>
      <div className="app-shell">
        <MapSidebar maps={mapItems} activeMapId={activeMap.id} onSelectMap={handleSelectMap} />
        <TopBar currentMapTitle={activeMap.title} dataSource={dataSource} onLoginRequest={() => setLoginModalOpen(true)} />
        <main className="map-panel p-3 p-lg-4">
          <div className="glass-panel h-100 d-flex flex-column gap-3 p-3 p-lg-4">
            <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap">
              <div>
                <p className="eyebrow mb-2 text-uppercase text-secondary">Current map</p>
                <h2 className="h3 mb-2">{activeMap.title}</h2>
                <p className="mb-0 text-body-secondary map-copy">{activeMap.description}</p>
              </div>
              <div className="map-highlight rounded-4 border border-secondary-subtle p-3">
                <p className="small text-uppercase text-secondary mb-1">Focused point</p>
                <h3 className="h6 mb-1">{focusedPin?.title ?? 'No point selected'}</h3>
                <p className="small mb-0 text-body-secondary">{focusedPin?.details ?? 'Select a timeline event or pin to inspect the current location.'}</p>
              </div>
            </div>
            <div className="status-strip rounded-4 border border-secondary-subtle px-3 py-2 text-body-secondary small">
              {statusCopy}
            </div>
            <div className="map-stage flex-grow-1">
              <OpenLayersMap
                mapSummary={activeMap}
                pins={activePins}
                focusedPinId={focusedPinId}
                onSelectPin={setFocusedPinId}
              />
            </div>
          </div>
        </main>
        <TimelinePanel events={activeEvents} focusedPinId={focusedPinId} onSelectEvent={handleSelectEvent} />
      </div>
      <LoginModal open={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
    </>
  );
}
