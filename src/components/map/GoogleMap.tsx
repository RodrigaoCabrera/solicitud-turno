import React, {useEffect, useState, useMemo} from 'react';

import {APIProvider, Map} from '@vis.gl/react-google-maps';

import {loadLocationDataset, Location} from './location';
import {ClusteredlocationMarkers} from './ClusteredLocationMarkers';

import './style.css';
import { getEnv } from '@/utils/getEnv';

const API_KEY = getEnv("PUBLIC_GOOGLE_MAPS_API_KEY") || "";
const App = () => {
  const [locations, setLocations] = useState<Location[]>();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // load data asynchronously
  useEffect(() => {
    loadLocationDataset().then(data => setLocations(data));
  }, []);

  const filteredLocations = useMemo(() => {
    if (!locations) return null;

    return locations.filter(
      t => !selectedCategory || t.category === selectedCategory
    );
  }, [locations, selectedCategory]);

  return (
    <APIProvider apiKey={API_KEY}>
      <Map
        className="h-full"
        mapId={'7620e7e7d60a8266'}
        defaultCenter={{lat: -29.7880522, lng: -58.0548067}}
        defaultZoom={15}
        gestureHandling={'greedy'}
        disableDefaultUI>
        {filteredLocations && <ClusteredlocationMarkers locations={filteredLocations} />}
      </Map>
    </APIProvider>
  );
};
export default App;