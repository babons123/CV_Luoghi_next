'use client';

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Location, Tag } from '@/types/luogo';

// Fix per l'icona di default di Leaflet con Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// ... (copia qui il resto del tuo codice LocationMap.tsx, ma adattato per react-leaflet)
// PER SEMPLICITÀ, ti fornisco una versione più pulita e moderna usando `react-leaflet`
// che gestisce molti problemi per te.

interface DynamicLocationMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const DynamicLocationMap: React.FC<DynamicLocationMapProps> = ({ locations, onLocationClick }) => {
  const getCategoryIcon = (category: string) => {
    // ... la tua logica per le icone
    const icons: Record<string, string> = { castelli: '🏰', ristoranti: '🍽️', parchi: '🌳', musei: '🏛️', chiese: '⛪', borghi: '🏘️' };
    return icons[category] || '📍';
  };
  
  const customIcons = useMemo(() => {
    const icons: Record<string, L.DivIcon> = {};
    const categories = [...new Set(locations.map(l => l.category))];
    categories.forEach(category => {
      icons[category] = L.divIcon({
        html: `<div class="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-lg border-2 border-white shadow-lg">${getCategoryIcon(category)}</div>`,
        className: 'custom-marker-icon',
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
    });
    return icons;
  }, [locations]);

  if (locations.length === 0) {
    return <div className="h-full w-full flex items-center justify-center bg-gray-100">Nessun luogo da mostrare sulla mappa.</div>;
  }
  
  const bounds = L.latLngBounds(locations.map(l => l.coordinates));

  return (
    <MapContainer
      bounds={bounds}
      style={{ height: '100%', width: '100%' }}
      className="rounded-lg"
      scrollWheelZoom={true}
      boundsOptions={{ padding: [50, 50] }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map(location => (
        <Marker 
          key={location.id} 
          position={location.coordinates}
          icon={customIcons[location.category] || new L.Icon.Default()}
        >
          <Popup>
            <div className="font-bold">{location.name}</div>
            <p>{location.province} ({location.region})</p>
            <button 
              className="text-blue-600 font-semibold mt-2"
              onClick={() => onLocationClick?.(location)}
            >
              Vedi dettagli
            </button>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default DynamicLocationMap;