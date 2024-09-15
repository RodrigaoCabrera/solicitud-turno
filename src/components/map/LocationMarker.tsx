import {Location} from './location.ts';
import type {Marker} from '@googlemaps/markerclusterer';
import React, {useCallback} from 'react';
import {AdvancedMarker} from '@vis.gl/react-google-maps';

export type LocationMarkerProps = {
  location: Location;
  onClick: (location: Location) => void;
  setMarkerRef: (marker: Marker | null, key: string) => void;
};

/**
 * Wrapper Component for an AdvancedMarker for a single location.
 */
export const LocationMarker = (props: LocationMarkerProps) => {
  const {location, onClick, setMarkerRef} = props;

  const handleClick = useCallback(() => onClick(location), [onClick, location]);
  const ref = useCallback(
    (marker: google.maps.marker.AdvancedMarkerElement) =>
      setMarkerRef(marker, location.key),
    [setMarkerRef, location.key]
  );

  return (
    <AdvancedMarker position={location.position} ref={ref} onClick={handleClick}>
      <span className="marker-clustering-location">🌳</span>
    </AdvancedMarker>
  );
};