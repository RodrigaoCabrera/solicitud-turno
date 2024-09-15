import {InfoWindow, useMap} from '@vis.gl/react-google-maps';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {type Marker, MarkerClusterer} from '@googlemaps/markerclusterer';
import {Location} from './location.ts';
import {LocationMarker} from './LocationMarker.tsx';

export type ClusteredLocationMarkersProps = {
  locations: Location[];
};

/**
 * The ClusteredlocationMarkers component is responsible for integrating the
 * markers with the markerclusterer.
 */
export const ClusteredlocationMarkers = ({locations}: ClusteredLocationMarkersProps) => {
  const [markers, setMarkers] = useState<{[key: string]: Marker}>({});
  const [selectedLocationKey, setSelectedLocationKey] = useState<string | null>(null);

  const selectedlocation = useMemo(
    () =>
      locations && selectedLocationKey
        ? locations.find((t: Location) => t.key === selectedLocationKey)!
        : null,
    [locations, selectedLocationKey]
  );

  // create the markerClusterer once the map is available and update it when
  // the markers are changed
  const map = useMap();
  const clusterer = useMemo(() => {
    if (!map) return null;

    return new MarkerClusterer({map});
  }, [map]);

  useEffect(() => {
    if (!clusterer) return;

    clusterer.clearMarkers();
    clusterer.addMarkers(Object.values(markers));
  }, [clusterer, markers]);

  // this callback will effectively get passsed as ref to the markers to keep
  // tracks of markers currently on the map
  const setMarkerRef = useCallback((marker: Marker | null, key: string) => {
    setMarkers(markers => {
      if ((marker && markers[key]) || (!marker && !markers[key]))
        return markers;

      if (marker) {
        return {...markers, [key]: marker};
      } else {
        const {[key]: _, ...newMarkers} = markers;

        return newMarkers;
      }
    });
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocationKey(null);
  }, []);

  const handleMarkerClick = useCallback((location: Location) => {
    setSelectedLocationKey(location.key);
  }, []);

  return (
    <>
      {locations.map((location: Location) => (
        <LocationMarker
          key={location.key}
          location={location}
          onClick={handleMarkerClick}
          setMarkerRef={setMarkerRef}
        />
      ))}

      {selectedLocationKey && (
        <InfoWindow
          anchor={markers[selectedLocationKey]}
          onCloseClick={handleInfoWindowClose}>
          {selectedlocation?.name}
        </InfoWindow>
      )}
    </>
  );
};