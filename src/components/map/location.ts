// Data source: https://open.toronto.ca/dataset/slocationt-location-data/
import location from './location.json';

export type Location = {
  key: string;
  name: string;
  category: string;
  position: google.maps.LatLngLiteral;
};

export type CategoryData = {
  key: string;
  label: string;
  count: number;
};

for (let i = 0; i < location.length; i++) {
  (location[i] as Location).key = `location-${i}`;
}

/**
 * Simulates async loading of the dataset from an external source.
 * (data is inlined for simplicity in our build process)
 */
export async function loadLocationDataset(): Promise<Location[]> {
  // simulate loading the location from an external source
  return new Promise(resolve => {
    setTimeout(() => resolve(location as Location[]), 500);
  });
}

export function getCategories(location?: Location[]): CategoryData[] {
  if (!location) return [];

  const countByCategory: {[c: string]: number} = {};
  for (const t of location) {
    if (!countByCategory[t.category]) countByCategory[t.category] = 0;
    countByCategory[t.category]++;
  }

  return Object.entries(countByCategory).map(([key, value]) => {
    const label = key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    return {
      key: key,
      label,
      count: value
    };
  });
}

export default location as Location[];