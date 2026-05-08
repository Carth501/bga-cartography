import { useEffect, useMemo, useState } from "react";

import { MapSidebar } from "../../components/MapSidebar";
import { TopBar } from "../../components/TopBar";
import {
  fetchMapPins,
  fetchMaps,
  fetchMapTimeline,
  getDiscordWidget,
} from "../../services/api";
import type { MapPin, TimelineEvent } from "../../types/models";
import { LoginModal } from "../auth/LoginModal";
import { TimelinePanel } from "../timeline/TimelinePanel";
import { OpenLayersMap } from "./OpenLayersMap";
import { events, maps, pins } from "./sampleData";

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
  const [eventItems, setEventItems] = useState<TimelineEvent[]>(
    getTimelineEvents(maps[0].id),
  );
  const [dataSource, setDataSource] = useState<"loading" | "api" | "fallback">(
    "loading",
  );
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const activeMap = useMemo(
    () => mapItems.find((map) => map.id === activeMapId) ?? mapItems[0],
    [activeMapId, mapItems],
  );
  const activePins = useMemo(() => pinItems, [pinItems]);
  const activeEvents = useMemo(() => eventItems, [eventItems]);

  useEffect(() => {
    let cancelled = false;

    void getDiscordWidget()
      .then((widget) => {
        if (!cancelled) {
          console.log(widget);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.warn("Discord widget fetch failed", error);
        }
      });

    async function loadMaps() {
      try {
        const nextMaps = await fetchMaps();
        if (cancelled || nextMaps.length === 0) {
          return;
        }

        setMapItems(nextMaps);
        setActiveMapId((current) =>
          nextMaps.some((map) => map.id === current) ? current : nextMaps[0].id,
        );
        setDataSource("api");
      } catch {
        if (cancelled) {
          return;
        }

        setMapItems(maps);
        setActiveMapId(maps[0].id);
        setDataSource("fallback");
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

      if (dataSource !== "api") {
        setPinItems(fallbackPins);
        setEventItems(fallbackEvents);
        setFocusedPinId((current) =>
          fallbackPins.some((pin) => pin.id === current)
            ? current
            : (fallbackPins[0]?.id ?? null),
        );
        return;
      }

      try {
        const [nextPins, nextEvents] = await Promise.all([
          fetchMapPins(activeMapId),
          fetchMapTimeline(activeMapId),
        ]);
        if (cancelled) {
          return;
        }

        setPinItems(nextPins);
        setEventItems(nextEvents);
        setFocusedPinId((current) =>
          nextPins.some((pin) => pin.id === current)
            ? current
            : (nextPins[0]?.id ?? null),
        );
      } catch {
        if (cancelled) {
          return;
        }

        setPinItems(fallbackPins);
        setEventItems(fallbackEvents);
        setFocusedPinId((current) =>
          fallbackPins.some((pin) => pin.id === current)
            ? current
            : (fallbackPins[0]?.id ?? null),
        );
        setDataSource("fallback");
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
        <MapSidebar
          maps={mapItems}
          activeMapId={activeMap.id}
          onSelectMap={handleSelectMap}
        />
        <TopBar
          currentMapTitle={activeMap.title}
          dataSource={dataSource}
          onLoginRequest={() => setLoginModalOpen(true)}
        />
        <OpenLayersMap
          mapSummary={activeMap}
          pins={activePins}
          focusedPinId={focusedPinId}
          onSelectPin={setFocusedPinId}
        />
        <TimelinePanel
          events={activeEvents}
          focusedPinId={focusedPinId}
          onSelectEvent={handleSelectEvent}
        />
      </div>
      <LoginModal
        open={loginModalOpen}
        onClose={() => setLoginModalOpen(false)}
      />
    </>
  );
}
