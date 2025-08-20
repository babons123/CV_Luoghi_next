// src/components/luoghi/MapLeaflet.tsx
'use client';

import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Luogo } from '@/types/luogo';

// Fix per l'icona del marker di default che non viene caricata correttamente con Webpack/Next.js
const icon = L.icon({
  iconUrl: "/file.svg", // Puoi usare una delle tue icone in /public
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapLeafletProps {
  luogo: Luogo;
}

export default function MapLeaflet({ luogo }: MapLeafletProps) {
  const position: [number, number] = [luogo.coordinate.lat, luogo.coordinate.lng];

  return (
    <MapContainer 
      center={position} 
      zoom={14} 
      scrollWheelZoom={false}
      style={{ height: '400px', width: '100%', borderRadius: '12px' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={position} icon={icon}>
        <Popup>{luogo.nome}</Popup>
      </Marker>
    </MapContainer>
  );
}