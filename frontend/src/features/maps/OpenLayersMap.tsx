import { useEffect, useMemo, useRef } from 'react';

import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import ImageLayer from 'ol/layer/Image';
import VectorLayer from 'ol/layer/Vector';
import Static from 'ol/source/ImageStatic';
import VectorSource from 'ol/source/Vector';
import Projection from 'ol/proj/Projection';
import CircleStyle from 'ol/style/Circle';
import Fill from 'ol/style/Fill';
import Stroke from 'ol/style/Stroke';
import Style from 'ol/style/Style';

import type { MapPin, MapSummary } from '../../types/models';

interface OpenLayersMapProps {
  mapSummary: MapSummary;
  pins: MapPin[];
  focusedPinId: string | null;
  onSelectPin: (pinId: string) => void;
}

function createPinFeature(pin: MapPin, mapSummary: MapSummary) {
  const x = pin.xRatio * mapSummary.asset.width;
  const y = (1 - pin.yRatio) * mapSummary.asset.height;
  const feature = new Feature({
    geometry: new Point([x, y]),
    pinId: pin.id,
  });

  return feature;
}

export function OpenLayersMap({ mapSummary, pins, focusedPinId, onSelectPin }: OpenLayersMapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const olMapRef = useRef<Map | null>(null);
  const vectorSourceRef = useRef<VectorSource>(new VectorSource());

  const imageExtent = useMemo<[number, number, number, number]>(
    () => [0, 0, mapSummary.asset.width, mapSummary.asset.height],
    [mapSummary.asset.height, mapSummary.asset.width],
  );

  const projection = useMemo(
    () =>
      new Projection({
        code: `image-${mapSummary.id}`,
        units: 'pixels',
        extent: imageExtent,
      }),
    [imageExtent, mapSummary.id],
  );

  useEffect(() => {
    if (!mapContainerRef.current) {
      return undefined;
    }

    vectorSourceRef.current = new VectorSource();

    const imageLayer = new ImageLayer({
      source: new Static({
        imageExtent,
        projection,
        url: mapSummary.asset.imageUrl,
      }),
    });

    const vectorLayer = new VectorLayer({
      source: vectorSourceRef.current,
      style: (feature) => {
        const pinId = feature.get('pinId') as string;
        const isFocused = pinId === focusedPinId;

        return new Style({
          image: new CircleStyle({
            radius: isFocused ? 10 : 8,
            fill: new Fill({
              color: isFocused ? 'rgba(255, 214, 102, 0.95)' : 'rgba(61, 196, 255, 0.9)',
            }),
            stroke: new Stroke({
              color: isFocused ? '#fff1c7' : '#061421',
              width: 3,
            }),
          }),
        });
      },
    });

    const map = new Map({
      target: mapContainerRef.current,
      layers: [imageLayer, vectorLayer],
      controls: [],
      view: new View({
        center: [mapSummary.asset.width / 2, mapSummary.asset.height / 2],
        projection,
        zoom: 1,
        maxZoom: 6,
      }),
    });

    map.on('singleclick', (event) => {
      map.forEachFeatureAtPixel(event.pixel, (feature) => {
        onSelectPin(feature.get('pinId') as string);
      });
    });

    olMapRef.current = map;

    return () => {
      map.setTarget(undefined);
      map.dispose();
      olMapRef.current = null;
    };
  }, [focusedPinId, imageExtent, mapSummary, onSelectPin, projection]);

  useEffect(() => {
    vectorSourceRef.current.clear();
    vectorSourceRef.current.addFeatures(pins.map((pin) => createPinFeature(pin, mapSummary)));
  }, [mapSummary, pins]);

  useEffect(() => {
    if (!focusedPinId || !olMapRef.current) {
      return;
    }

    const feature = vectorSourceRef.current
      .getFeatures()
      .find((candidate) => candidate.get('pinId') === focusedPinId);

    const geometry = feature?.getGeometry();
    if (!geometry) {
      return;
    }

    olMapRef.current.getView().animate({
      center: (geometry as Point).getCoordinates(),
      duration: 350,
      zoom: 2.5,
    });
  }, [focusedPinId]);

  return <div ref={mapContainerRef} className="map-surface h-100 w-100 rounded-4 overflow-hidden" />;
}
