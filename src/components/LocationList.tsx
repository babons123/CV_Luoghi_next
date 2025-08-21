import React, { useState, useMemo } from 'react';
import { LayoutGrid, List, Map, TrendingUp, Calendar } from 'lucide-react';
import dynamic from 'next/dynamic';
import LocationCard from './LocationCard';
import { Location, Tag, FilterState } from '@/types/luogo'; // <-- MODIFICA: Import tipi centralizzati

// --- MODIFICA: Inizio Blocco Mappa Dinamica ---
// Caricamento dinamico del componente Mappa.
// 'ssr: false' è essenziale perché Leaflet si basa su oggetti del browser (es. 'window')
// che non sono disponibili durante il Server-Side Rendering (SSR).
const LocationMap = dynamic(() => import('./DynamicLocationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-100 rounded-lg">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      <p className="ml-4 text-gray-600">Caricamento mappa...</p>
    </div>
  ),
});
// --- MODIFICA: Fine Blocco Mappa Dinamica ---


// --- MODIFICA: Le interfacce locali sono state rimosse perché importate dall'alto ---

type ViewMode = 'grid' | 'list' | 'map' | 'timeline';
type SortOption = 'date' | 'name' | 'rating' | 'region';

interface LocationListProps {
  locations: Location[];
  tags: Record<string, Tag>;
  filters: FilterState;
  onLocationClick?: (location: Location) => void;
}

const LocationList: React.FC<LocationListProps> = ({
  locations,
  tags,
  filters,
  onLocationClick
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortOption>('date');

  // Filtra e ordina le location
  const filteredAndSortedLocations = useMemo(() => {
    let filtered = locations.filter(location => {
      // Filtro ricerca testuale
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!location.name.toLowerCase().includes(searchLower) && 
            !location.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Filtro categorie
      if (filters.categories.length > 0) {
        if (!filters.categories.includes(location.category)) {
          return false;
        }
      }

      // Filtro regioni
      if (filters.regions.length > 0) {
        if (!filters.regions.includes(location.region)) {
          return false;
        }
      }

      // Filtro province
      if (filters.provinces.length > 0) {
        if (!filters.provinces.includes(location.province)) {
          return false;
        }
      }

      // Filtro tags
      if (filters.tags.length > 0) {
        if (!location.tags || !filters.tags.some(tagId => location.tags!.includes(tagId))) {
          return false;
        }
      }

      // Filtro rating
      if (filters.rating > 0) {
        if (!location.rating || location.rating < filters.rating) {
          return false;
        }
      }

      // Filtro date
      if (filters.dateFrom || filters.dateTo) {
        const visitDate = new Date(location.visitDate);
        if (filters.dateFrom && visitDate < new Date(filters.dateFrom)) {
          return false;
        }
        if (filters.dateTo && visitDate > new Date(filters.dateTo)) {
          return false;
        }
      }

      return true;
    });

    // Ordinamento
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'region':
          return a.region.localeCompare(b.region) || a.province.localeCompare(b.province);
        case 'date':
        default:
          return new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime();
      }
    });

    return filtered;
  }, [locations, filters, sortBy]);

  // Raggruppa per timeline se necessario
  const groupedByMonth = useMemo(() => {
    if (viewMode !== 'timeline') return {};
    
    return filteredAndSortedLocations.reduce((groups, location) => {
      const date = new Date(location.visitDate);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('it-IT', { year: 'numeric', month: 'long' });
      
      if (!groups[monthKey]) {
        groups[monthKey] = { name: monthName, locations: [] };
      }
      groups[monthKey].locations.push(location);
      
      return groups;
    }, {} as Record<string, { name: string; locations: Location[] }>);
  }, [filteredAndSortedLocations, viewMode]);

  const renderViewModeSelector = () => (
    <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
      {[
        { mode: 'grid' as ViewMode, icon: LayoutGrid, label: 'Griglia' },
        { mode: 'list' as ViewMode, icon: List, label: 'Lista' },
        { mode: 'map' as ViewMode, icon: Map, label: 'Mappa' },
        { mode: 'timeline' as ViewMode, icon: Calendar, label: 'Timeline' }
      ].map(({ mode, icon: Icon, label }) => (
        <button
          key={mode}
          onClick={() => setViewMode(mode)}
          className={`flex items-center gap-1 px-3 py-1 rounded text-sm transition-colors ${
            viewMode === mode
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-800'
          }`}
          title={label}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );

  const renderSortSelector = () => (
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as SortOption)}
      className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="date">Data visita (più recenti)</option>
      <option value="name">Nome (A-Z)</option>
      <option value="rating">Rating (migliori)</option>
      <option value="region">Regione e Provincia</option>
    </select>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {filteredAndSortedLocations.map(location => (
        <LocationCard
          key={location.id}
          location={location}
          tags={tags}
          onClick={onLocationClick}
        />
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-4 max-w-4xl mx-auto">
      {filteredAndSortedLocations.map(location => (
        <div key={location.id} className="w-full">
          <LocationCard
            location={location}
            tags={tags}
            onClick={onLocationClick}
          />
        </div>
      ))}
    </div>
  );

  const renderTimelineView = () => (
    <div className="space-y-8">
      {Object.entries(groupedByMonth)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([monthKey, { name, locations }]) => (
          <div key={monthKey} className="relative pl-12">
            {/* Timeline line */}
            <div className="absolute left-4 top-1 bottom-0 w-0.5 bg-gray-200"></div>
            
            {/* Month header */}
            <div className="relative flex items-center gap-4 mb-4">
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white border-2 border-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold text-blue-500 z-10">
                {locations.length}
              </div>
              <h3 className="text-xl font-bold text-gray-800 capitalize">{name}</h3>
            </div>
            
            {/* Locations for this month */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map(location => (
                <LocationCard
                  key={location.id}
                  location={location}
                  tags={tags}
                  onClick={onLocationClick}
                />
              ))}
            </div>
          </div>
        ))}
    </div>
  );

  if (filteredAndSortedLocations.length === 0) {
    return (
      <div className="text-center py-12 bg-gray-50 rounded-lg">
        <TrendingUp className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-xl font-medium text-gray-700 mb-2">
          Nessun luogo trovato
        </h3>
        <p className="text-gray-500">
          Prova a modificare i filtri o aggiungi nuovi luoghi alla collezione.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con controlli */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-gray-800">
            {filteredAndSortedLocations.length} <span className="font-normal text-gray-600">luoghi trovati</span>
          </h2>
          {viewMode !== 'map' && renderSortSelector()}
        </div>
        {renderViewModeSelector()}
      </div>

      {/* Contenuto principale */}
      <div className="min-h-96">
        {viewMode === 'grid' && renderGridView()}
        {viewMode === 'list' && renderListView()}
        {viewMode === 'timeline' && renderTimelineView()}
        {viewMode === 'map' && (
          // --- MODIFICA: Contenitore mappa migliorato ---
          <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg border">
            <LocationMap
              locations={filteredAndSortedLocations}
              onLocationClick={onLocationClick}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationList;