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

interface DynamicLocationMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const DynamicLocationMap: React.FC<DynamicLocationMapProps> = ({ locations, onLocationClick }) => {
  
  // Colori per categoria
  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      castelli: '#8B4513',     // Marrone
      ristoranti: '#FF6B6B',   // Rosso
      parchi: '#4ECDC4',       // Turchese
      musei: '#45B7D1',        // Blu
      chiese: '#96CEB4',       // Verde
      borghi: '#FFEAA7',       // Giallo
      montagne: '#6C5CE7',     // Viola
      rifugi: '#FD79A8',       // Rosa
      default: '#74B9FF'       // Blu chiaro
    };
    return colors[category] || colors.default;
  };

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      castelli: '🏰',
      ristoranti: '🍽️',
      parchi: '🌳',
      musei: '🏛️',
      chiese: '⛪',
      borghi: '🏘️',
      montagne: '⛰️',
      rifugi: '🏠'
    };
    return icons[category] || '📍';
  };

  // Metodo 1: DivIcon con CSS inline (più affidabile)
  const createDivIconWithInlineCSS = (category: string) => {
    const color = getCategoryColor(category);
    const icon = getCategoryIcon(category);
    
    return L.divIcon({
      html: `
        <div style="
          background-color: ${color};
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          border: 2px solid white;
          box-shadow: 0 4px 8px rgba(0,0,0,0.3);
          font-family: system-ui, -apple-system, sans-serif;
        ">${icon}</div>
      `,
      className: 'custom-marker-icon',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  // Metodo 2: Creare un Canvas icon (per più controllo)
  const createCanvasIcon = (category: string) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const size = 32;
    
    canvas.width = size;
    canvas.height = size;
    
    if (ctx) {
      // Disegna il cerchio di sfondo
      ctx.fillStyle = getCategoryColor(category);
      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Bordo bianco
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Ombra (semplificata)
      ctx.shadowColor = 'rgba(0,0,0,0.3)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetY = 2;
      
      // Testo emoji (potrebbe non funzionare su tutti i browser)
      ctx.fillStyle = 'white';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      const icon = getCategoryIcon(category);
      ctx.fillText(icon, size / 2, size / 2);
    }
    
    return L.icon({
      iconUrl: canvas.toDataURL(),
      iconSize: [size, size],
      iconAnchor: [size / 2, size / 2],
    });
  };

  // Metodo 3: Usare SVG (più scalabile e pulito)
  const createSVGIcon = (category: string) => {
    const color = getCategoryColor(category);
    const icon = getCategoryIcon(category);
    
    const svgIcon = `
      <svg width="32" height="32" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <circle cx="16" cy="16" r="14" fill="${color}" stroke="white" stroke-width="2" filter="url(#shadow)"/>
        <text x="16" y="20" font-family="Arial, sans-serif" font-size="14" fill="white" text-anchor="middle">${icon}</text>
      </svg>
    `;
    
    const svgBlob = new Blob([svgIcon], { type: 'image/svg+xml' });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    return L.icon({
      iconUrl: svgUrl,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  };

  const customIcons = useMemo(() => {
    const icons: Record<string, L.Icon | L.DivIcon> = {};
    const categories = [...new Set(locations.map(l => l.category))];
    
    categories.forEach(category => {
      // Puoi scegliere quale metodo usare:
      // icons[category] = createDivIconWithInlineCSS(category); // Metodo 1
      icons[category] = createCanvasIcon(category); // Metodo 2
      //icons[category] = createSVGIcon(category); // Metodo 3 (consigliato)
    });
    
    return icons;
  }, [locations]);

  // Pulisci gli URL degli oggetti SVG quando il componente si smonta
  React.useEffect(() => {
    return () => {
      Object.values(customIcons).forEach(icon => {
        if (icon instanceof L.Icon) {
          const iconUrl = icon.options.iconUrl;
          if (iconUrl && iconUrl.startsWith('blob:')) {
            URL.revokeObjectURL(iconUrl);
          }
        }
      });
    };
  }, [customIcons]);

  if (locations.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100">
        Nessun luogo da mostrare sulla mappa.
      </div>
    );
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
            {location.category && (
              <div className="text-sm text-gray-600 capitalize mb-1">
                {getCategoryIcon(location.category)} {location.category}
              </div>
            )}
            {location.altitude && (
              <div className="text-sm text-gray-600">
                🏔️ {location.altitude}m s.l.m.
              </div>
            )}
            <button 
              className="text-blue-600 font-semibold mt-2 hover:text-blue-800"
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