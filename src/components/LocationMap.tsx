'use client';

import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Star, Calendar, ExternalLink } from 'lucide-react';

// Leaflet types - sarà disponibile tramite script CDN
declare global {
  interface Window {
    L: any;
  }
}

interface Tag {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  officialLogo?: string;
  category: 'geographic' | 'certification' | 'thematic' | 'experience';
}

interface Location {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinates: [number, number];
  region: string;
  province: string;
  municipality?: string;
  visitDate: string;
  rating?: number;
  tags?: string[];
  website?: string;
  drivePhotosUrl?: string;
  notes?: string;
}

interface LocationMapProps {
  locations: Location[];
  tags: Record<string, Tag>;
  onLocationClick?: (location: Location) => void;
}

const LocationMap: React.FC<LocationMapProps> = ({ locations, tags, onLocationClick }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Icone per categoria
  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      castelli: '🏰',
      ristoranti: '🍽️',
      parchi: '🌳',
      musei: '🏛️',
      chiese: '⛪',
      borghi: '🏘️'
    };
    return icons[category] || '📍';
  };

  // Colori per categoria
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      castelli: '#8B4513',
      ristoranti: '#FF6347',
      parchi: '#228B22',
      musei: '#4682B4',
      chiese: '#9370DB',
      borghi: '#CD853F'
    };
    return colors[category] || '#666666';
  };

  // Carica Leaflet dinamicamente
  useEffect(() => {
    const loadLeaflet = async () => {
      try {
        // Carica CSS di Leaflet
        if (!document.querySelector('link[href*="leaflet"]')) {
          const leafletCSS = document.createElement('link');
          leafletCSS.rel = 'stylesheet';
          leafletCSS.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          leafletCSS.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
          leafletCSS.crossOrigin = '';
          document.head.appendChild(leafletCSS);
        }

        // Carica JavaScript di Leaflet
        if (!window.L) {
          const leafletJS = document.createElement('script');
          leafletJS.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
          leafletJS.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
          leafletJS.crossOrigin = '';
          
          await new Promise((resolve, reject) => {
            leafletJS.onload = resolve;
            leafletJS.onerror = reject;
            document.head.appendChild(leafletJS);
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Errore nel caricamento di Leaflet:', error);
        setLoadError('Impossibile caricare la mappa');
        setIsLoading(false);
      }
    };

    loadLeaflet();
  }, []);

  // Inizializza la mappa
  useEffect(() => {
    if (isLoading || loadError || !window.L || !mapRef.current) return;

    // Pulisci mappa esistente
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    // Crea nuova mappa
    const map = window.L.map(mapRef.current, {
      center: [44.0, 12.0], // Centro Italia
      zoom: 6,
      zoomControl: true,
      scrollWheelZoom: true,
      doubleClickZoom: true,
      dragging: true
    });

    // Aggiungi layer OpenStreetMap
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLoading, loadError]);

  // Aggiorna marker quando cambiano le location
  useEffect(() => {
    if (!mapInstanceRef.current || !window.L || isLoading || loadError) return;

    // Pulisci marker esistenti
    markersRef.current.forEach(marker => {
      mapInstanceRef.current.removeLayer(marker);
    });
    markersRef.current = [];

    if (locations.length === 0) return;

    const bounds = window.L.latLngBounds();
    const markers: any[] = [];

    locations.forEach(location => {
      const [lat, lng] = location.coordinates;
      
      // Crea icona personalizzata
      const categoryColor = getCategoryColor(location.category);
      const categoryIcon = getCategoryIcon(location.category);
      
      const customIcon = window.L.divIcon({
        html: `
          <div style="
            background-color: ${categoryColor};
            color: white;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 18px;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
          ">
            ${categoryIcon}
          </div>
        `,
        className: 'custom-marker',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      // Crea popup content
      const popupContent = `
        <div class="p-3 min-w-64">
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xl">${categoryIcon}</span>
            <h3 class="font-bold text-lg">${location.name}</h3>
          </div>
          
          <p class="text-gray-600 text-sm mb-2 line-clamp-2">${location.description}</p>
          
          <div class="flex items-center gap-1 mb-2 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
            <span>${location.province} (${location.region})</span>
          </div>
          
          <div class="flex items-center gap-1 mb-3 text-sm text-gray-500">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <span>Visitato il ${new Date(location.visitDate).toLocaleDateString('it-IT')}</span>
          </div>
          
          ${location.rating ? `
            <div class="flex items-center gap-1 mb-3">
              ${'★'.repeat(location.rating)}${'☆'.repeat(5 - location.rating)}
            </div>
          ` : ''}
          
          ${location.tags && location.tags.length > 0 ? `
            <div class="flex flex-wrap gap-1 mb-3">
              ${location.tags.map(tagId => {
                const tag = tags[tagId];
                if (!tag) return '';
                return `
                  <span class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" 
                        style="background-color: ${tag.backgroundColor}; color: ${tag.color};">
                    ${tag.officialLogo ? `<img src="${tag.officialLogo}" alt="${tag.name}" class="w-3 h-3">` : ''}
                    ${tag.name}
                  </span>
                `;
              }).join('')}
            </div>
          ` : ''}
          
          <div class="flex gap-2 pt-2 border-t">
            ${location.website ? `
              <a href="${location.website}" target="_blank" class="flex items-center gap-1 text-blue-600 text-sm hover:underline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
                Sito web
              </a>
            ` : ''}
            
            ${location.drivePhotosUrl ? `
              <a href="${location.drivePhotosUrl}" target="_blank" class="flex items-center gap-1 text-green-600 text-sm hover:underline">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Foto
              </a>
            ` : ''}
            
            <button onclick="window.dispatchEvent(new CustomEvent('locationClick', { detail: '${location.id}' }))" 
                    class="text-blue-600 text-sm hover:underline font-medium">
              Dettagli →
            </button>
          </div>
        </div>
      `;

      // Crea marker
      const marker = window.L.marker([lat, lng], { icon: customIcon })
        .bindPopup(popupContent, {
          maxWidth: 300,
          className: 'custom-popup'
        });

      marker.addTo(mapInstanceRef.current);
      markers.push(marker);
      bounds.extend([lat, lng]);
    });

    markersRef.current = markers;

    // Adatta vista ai marker
    if (bounds.isValid()) {
      mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
    }

    // Event listener per click sui dettagli
    const handleLocationClick = (event: CustomEvent) => {
      const locationId = event.detail;
      const location = locations.find(l => l.id === locationId);
      if (location && onLocationClick) {
        onLocationClick(location);
      }
    };

    window.addEventListener('locationClick', handleLocationClick as EventListener);

    return () => {
      window.removeEventListener('locationClick', handleLocationClick as EventListener);
    };
  }, [locations, tags, onLocationClick, isLoading, loadError]);

  if (loadError) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">Errore nel caricamento della mappa</h3>
          <p className="text-gray-500">{loadError}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="h-full w-full bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento mappa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="h-full w-full rounded-lg" />
      
      {/* Legenda categorie */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-1000">
        <h4 className="font-medium text-sm text-gray-800 mb-2">Categorie</h4>
        <div className="space-y-1">
          {[...new Set(locations.map(l => l.category))].map(category => (
            <div key={category} className="flex items-center gap-2 text-xs">
              <div 
                className="w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center"
                style={{ backgroundColor: getCategoryColor(category) }}
              >
                <span className="text-white text-xs">{getCategoryIcon(category)}</span>
              </div>
              <span className="capitalize">{category}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Counter luoghi */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg px-3 py-2 z-1000">
        <span className="text-sm font-medium text-gray-800">
          {locations.length} luoghi visualizzati
        </span>
      </div>
    </div>
  );
};

export default LocationMap;