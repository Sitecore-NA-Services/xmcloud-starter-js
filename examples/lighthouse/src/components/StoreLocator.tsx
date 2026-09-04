'use client';

import { JSX, useMemo, useState } from 'react';
import { Field } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'src/lib/component-props';

type Store = {
  id: string;
  name: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
};

type StoreLocatorProps = ComponentProps & {
  fields?: {
    StoreName?: Field<string>;
    City?: Field<string>;
    State?: Field<string>;
    Latitude?: Field<string>;
    Longitude?: Field<string>;
  };
  rendering?: {
    dataSource?: string;
    fields?: Record<string, unknown>;
    children?: Array<{
      id: string;
      fields: {
        StoreName?: Field<string>;
        City?: Field<string>;
        State?: Field<string>;
        Latitude?: Field<string>;
        Longitude?: Field<string>;
      };
    }>;
  };
};

function parseStoresFromSitecore(props: StoreLocatorProps): Store[] | null {
  const children = props.rendering?.children;
  if (!children || children.length === 0) return null;
  return children.map((child, i) => ({
    id: child.id || String(i),
    name: child.fields?.StoreName?.value || '',
    city: child.fields?.City?.value || '',
    state: child.fields?.State?.value || '',
    lat: parseFloat(child.fields?.Latitude?.value || '0'),
    lng: parseFloat(child.fields?.Longitude?.value || '0'),
  })).filter(s => s.name);
}

const FALLBACK_STORES: Store[] = [
  { id: '1', name: 'Lighthouse New York', city: 'New York', state: 'NY', lat: 40.7128, lng: -74.006 },
  { id: '2', name: 'Lighthouse Boston', city: 'Boston', state: 'MA', lat: 42.3601, lng: -71.0589 },
  { id: '3', name: 'Lighthouse Chicago', city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { id: '4', name: 'Lighthouse Atlanta', city: 'Atlanta', state: 'GA', lat: 33.749, lng: -84.388 },
  { id: '5', name: 'Lighthouse Dallas', city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.797 },
  { id: '6', name: 'Lighthouse Denver', city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
  { id: '7', name: 'Lighthouse Seattle', city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { id: '8', name: 'Lighthouse San Francisco', city: 'San Francisco', state: 'CA', lat: 37.7749, lng: -122.4194 },
  { id: '9', name: 'Lighthouse Los Angeles', city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { id: '10', name: 'Lighthouse Miami', city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
];

// Distance bands in kilometres (XP uses km on the Locations page).
const DISTANCE_BANDS = [
  { label: '100 km', color: '#00a3ad' },
  { label: '200 km', color: '#4fb8bf' },
  { label: '500 km', color: '#86cdd2' },
  { label: '1000 km', color: '#b8e1e4' },
];

// Continental-US bounding box used for map projection and OSM iframe bbox.
const BBOX = { west: -130, east: -65, south: 24, north: 49 };

const StoreLocator = (props: StoreLocatorProps): JSX.Element => {
  const stores = parseStoresFromSitecore(props) || FALLBACK_STORES;
  const [query, setQuery] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [legendVisible, setLegendVisible] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const q = query.trim().toLowerCase();
  // XP parity: show "No results" by default until the user searches.
  const results = useMemo(() => {
    if (!submitted || !q) return [];
    return stores.filter(
      (s) =>
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
    );
  }, [q, submitted, stores]);
  const hasResults = results.length > 0;

  // Project lat/lng onto the map bbox — matches the iframe's bbox so pins line up.
  const project = (lat: number, lng: number) => {
    const x = ((lng - BBOX.west) / (BBOX.east - BBOX.west)) * 100;
    const y = ((BBOX.north - lat) / (BBOX.north - BBOX.south)) * 100;
    return { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) };
  };

  const osmSrc =
    `https://www.openstreetmap.org/export/embed.html?bbox=${BBOX.west}%2C${BBOX.south}%2C${BBOX.east}%2C${BBOX.north}&layer=mapnik`;

  return (
    <section className="store-locator w-full bg-white py-12">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <form onSubmit={handleSearch} className="mb-8 flex gap-0">
          <input
            type="text"
            placeholder="Search for locations here..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 border border-gray-300 bg-[#f7f7f7] px-4 py-3 text-sm focus:border-[var(--color-brand-primary)] focus:bg-white focus:outline-none"
            aria-label="Search for locations"
          />
          <button
            type="submit"
            className="bg-[var(--color-brand-primary)] px-10 py-3 text-xs font-semibold uppercase tracking-[2px] text-white hover:bg-[var(--color-brand-dark)]"
          >
            Search Locations
          </button>
        </form>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="results-pane">
            {hasResults ? (
              <ul className="divide-y divide-gray-200">
                {results.slice(0, 6).map((s) => (
                  <li key={s.id} className="py-3">
                    <h3 className="text-sm font-semibold text-gray-900">{s.name}</h3>
                    <p className="text-xs text-gray-500">
                      {s.city}, {s.state}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-sm text-gray-500">No results</p>
            )}
            <div className="mt-6 flex gap-6 text-xs uppercase tracking-[2px] text-gray-500">
              <span className="cursor-default opacity-60">First</span>
              <span className="cursor-default opacity-60">Previous</span>
              <span className="cursor-default opacity-60">Next</span>
              <span className="cursor-default opacity-60">Last</span>
            </div>
          </div>

          <div className="map-pane">
            {/* Aspect matches the bbox (lon-range / lat-range ≈ 2.6) so pins project correctly onto the iframe tiles. */}
            <div className="relative w-full overflow-hidden border border-gray-200" style={{ aspectRatio: '13 / 5' }}>
              {/* OpenStreetMap iframe — real map tiles, no API key required. */}
              <iframe
                src={osmSrc}
                title="Lighthouse store locations map"
                className="absolute inset-0 h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              {/* Pin overlay — positioned over the iframe. Pointer events off so iframe stays interactive. */}
              <div className="pointer-events-none absolute inset-0">
                {stores.map((s) => {
                  const p = project(s.lat, s.lng);
                  return (
                    <div
                      key={s.id}
                      className="absolute -translate-x-1/2 -translate-y-full"
                      style={{ left: `${p.x}%`, top: `${p.y}%` }}
                      aria-label={`${s.name} — ${s.city}, ${s.state}`}
                    >
                      <svg width="20" height="26" viewBox="0 0 20 26" aria-hidden="true">
                        <path
                          d="M10 0 C4.5 0 0 4.5 0 10 C0 17.5 10 26 10 26 C10 26 20 17.5 20 10 C20 4.5 15.5 0 10 0 Z"
                          fill="#111"
                          stroke="#fff"
                          strokeWidth="1.5"
                        />
                        <circle cx="10" cy="10" r="3.5" fill="#fff" />
                      </svg>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {legendVisible && (
          <div className="distance-legend relative mt-8 inline-block pr-10">
            <p className="mb-3 text-base font-semibold text-gray-900">Distance to Store</p>
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
              {DISTANCE_BANDS.map((b) => (
                <div key={b.label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: b.color }}
                    aria-hidden="true"
                  />
                  <span>{b.label}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setLegendVisible(false)}
              aria-label="Dismiss distance legend"
              className="absolute right-0 top-0 text-gray-400 hover:text-gray-600 text-lg leading-none"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default StoreLocator;
