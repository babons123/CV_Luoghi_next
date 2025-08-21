import React, { useState, useMemo } from 'react';
import { LayoutGrid, List, Map, TrendingUp, Calendar, Sparkles, MapPin, Star, Clock, Filter, SortAsc } from 'lucide-react';
import dynamic from 'next/dynamic';
import LocationCard from './LocationCard';
import { Location, Tag, FilterState } from '@/types/luogo';

const LocationMap = dynamic(() => import('./DynamicLocationMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl border border-blue-200/50">
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500/20 border-t-blue-500"></div>
          <MapPin className="absolute inset-0 m-auto w-6 h-6 text-blue-500 animate-pulse" />
        </div>
        <div className="text-center">
          <p className="text-blue-700 font-semibold">Caricamento mappa...</p>
          <p className="text-blue-500 text-sm">Preparando i tuoi luoghi</p>
        </div>
      </div>
    </div>
  ),
});

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
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!location.name.toLowerCase().includes(searchLower) && 
            !location.description.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      if (filters.categories.length > 0) {
        if (!filters.categories.includes(location.category)) {
          return false;
        }
      }

      if (filters.regions.length > 0) {
        if (!filters.regions.includes(location.region)) {
          return false;
        }
      }

      if (filters.provinces.length > 0) {
        if (!filters.provinces.includes(location.province)) {
          return false;
        }
      }

      if (filters.tags.length > 0) {
        if (!location.tags || !filters.tags.some(tagId => location.tags!.includes(tagId))) {
          return false;
        }
      }

      if (filters.rating > 0) {
        if (!location.rating || location.rating < filters.rating) {
          return false;
        }
      }

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
    <div className="relative bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-1.5 shadow-lg shadow-gray-900/5">
      <div className="flex items-center gap-1">
        {[
          { mode: 'grid' as ViewMode, icon: LayoutGrid, label: 'Griglia', color: 'from-purple-500 to-pink-500' },
          { mode: 'list' as ViewMode, icon: List, label: 'Lista', color: 'from-blue-500 to-cyan-500' },
          { mode: 'map' as ViewMode, icon: Map, label: 'Mappa', color: 'from-green-500 to-emerald-500' },
          { mode: 'timeline' as ViewMode, icon: Calendar, label: 'Timeline', color: 'from-orange-500 to-red-500' }
        ].map(({ mode, icon: Icon, label, color }, index) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
              viewMode === mode
                ? `bg-gradient-to-r ${color} text-white shadow-lg transform scale-105`
                : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50/80 hover:scale-102'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <Icon className={`w-4 h-4 transition-transform duration-300 ${
              viewMode === mode ? 'rotate-12' : ''
            }`} />
            <span className="hidden sm:inline">{label}</span>
            {viewMode === mode && (
              <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderSortSelector = () => (
    <div className="relative">
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as SortOption)}
        className="appearance-none bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-xl px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-300 hover:bg-white/90 shadow-lg shadow-gray-900/5"
      >
        <option value="date">📅 Data visita (più recenti)</option>
        <option value="name">🔤 Nome (A-Z)</option>
        <option value="rating">⭐ Rating (migliori)</option>
        <option value="region">🗺️ Regione e Provincia</option>
      </select>
      <SortAsc className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
  );

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-in fade-in duration-500">
      {filteredAndSortedLocations.map((location, index) => (
        <div
          key={location.id}
          className="transform transition-all duration-300 hover:scale-105"
          style={{
            animationDelay: `${index * 0.1}s`
          }}
        >
          <LocationCard
            location={location}
            tags={tags}
            onClick={onLocationClick}
          />
        </div>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-6 max-w-5xl mx-auto animate-in slide-in-from-left duration-500">
      {filteredAndSortedLocations.map((location, index) => (
        <div
          key={location.id}
          className="w-full transform transition-all duration-300 hover:scale-[1.02]"
          style={{
            animationDelay: `${index * 0.05}s`
          }}
        >
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
    <div className="space-y-12 animate-in slide-in-from-bottom duration-700">
      {Object.entries(groupedByMonth)
        .sort(([a], [b]) => b.localeCompare(a))
        .map(([monthKey, { name, locations }], groupIndex) => (
          <div
            key={monthKey}
            className="relative pl-16"
            style={{
              animationDelay: `${groupIndex * 0.2}s`
            }}
          >
            {/* Timeline line */}
            <div className="absolute left-6 top-16 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500 rounded-full opacity-30"></div>
            
            {/* Month header */}
            <div className="relative flex items-center gap-6 mb-8">
              <div className="absolute -left-16 top-1/2 -translate-y-1/2 bg-gradient-to-br from-blue-500 to-purple-600 border-4 border-white rounded-2xl w-12 h-12 flex items-center justify-center text-sm font-bold text-white z-10 shadow-xl shadow-blue-500/25 animate-pulse">
                {locations.length}
              </div>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/50 shadow-lg shadow-blue-900/5">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent capitalize flex items-center gap-3">
                  <Calendar className="w-6 h-6 text-blue-500" />
                  {name}
                </h3>
                <p className="text-blue-600/70 text-sm mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {locations.length} {locations.length === 1 ? 'luogo visitato' : 'luoghi visitati'}
                </p>
              </div>
            </div>
            
            {/* Locations for this month */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ml-4">
              {locations.map((location, index) => (
                <div
                  key={location.id}
                  className="transform transition-all duration-300 hover:scale-105"
                  style={{
                    animationDelay: `${(groupIndex * 0.2) + (index * 0.1)}s`
                  }}
                >
                  <LocationCard
                    location={location}
                    tags={tags}
                    onClick={onLocationClick}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );

  if (filteredAndSortedLocations.length === 0) {
    return (
      <div className="text-center py-20 animate-in zoom-in duration-500">
        <div className="bg-gradient-to-br from-gray-50 to-blue-50/50 rounded-3xl p-12 border border-gray-200/50 shadow-xl shadow-gray-900/5 max-w-md mx-auto">
          <div className="relative mb-6">
            <TrendingUp className="w-20 h-20 text-gray-300 mx-auto" />
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-2xl font-bold text-gray-700 mb-3 bg-gradient-to-r from-gray-700 to-gray-500 bg-clip-text text-transparent">
            Nessun luogo trovato
          </h3>
          <p className="text-gray-500 leading-relaxed mb-6">
            Prova a modificare i filtri o aggiungi nuovi luoghi alla collezione per iniziare la tua avventura.
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-500 text-sm font-medium">
            <Filter className="w-4 h-4" />
            Modifica i filtri per vedere più risultati
          </div>
        </div>
      </div>
    );
  }

  const getResultsText = () => {
    const count = filteredAndSortedLocations.length;
    if (count === 1) return "1 luogo trovato";
    return `${count} luoghi trovati`;
  };

  const getViewModeIcon = () => {
    switch (viewMode) {
      case 'grid': return <LayoutGrid className="w-5 h-5 text-purple-500" />;
      case 'list': return <List className="w-5 h-5 text-blue-500" />;
      case 'map': return <Map className="w-5 h-5 text-green-500" />;
      case 'timeline': return <Calendar className="w-5 h-5 text-orange-500" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header con controlli migliorato */}
      <div className="bg-gradient-to-r from-white/80 via-blue-50/50 to-purple-50/50 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-6 shadow-xl shadow-gray-900/5">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {getViewModeIcon()}
              <div>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {getResultsText()}
                </h2>
                <p className="text-gray-500 text-sm flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Esplora la tua collezione
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            {viewMode !== 'map' && (
              <div className="flex items-center gap-2">
                <SortAsc className="w-4 h-4 text-gray-400" />
                {renderSortSelector()}
              </div>
            )}
            {renderViewModeSelector()}
          </div>
        </div>
      </div>

      {/* Contenuto principale con transizioni */}
      <div className="min-h-96 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-transparent to-purple-50/20 rounded-3xl -z-10"></div>
        
        {viewMode === 'grid' && (
          <div className="p-4">
            {renderGridView()}
          </div>
        )}
        
        {viewMode === 'list' && (
          <div className="p-4">
            {renderListView()}
          </div>
        )}
        
        {viewMode === 'timeline' && (
          <div className="p-6">
            {renderTimelineView()}
          </div>
        )}
        
        {viewMode === 'map' && (
          <div className="h-[700px] w-full rounded-3xl overflow-hidden shadow-2xl shadow-blue-900/10 border border-gray-200/50 bg-gradient-to-br from-blue-50 to-indigo-100">
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