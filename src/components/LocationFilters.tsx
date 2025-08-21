import React, { useState } from 'react';
import { Filter, Search, X, Calendar, Star, MapPin, Plus } from 'lucide-react';

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
}

interface FilterState {
  search: string;
  categories: string[];
  regions: string[];
  provinces: string[];
  tags: string[];
  rating: number;
  dateFrom: string;
  dateTo: string;
}

interface LocationFiltersProps {
  locations: Location[];
  tags: Record<string, Tag>;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onCreateTag: () => void;
  onCreateLocation: () => void;
}

const LocationFilters: React.FC<LocationFiltersProps> = ({
  locations,
  tags,
  filters,
  onFiltersChange,
  onCreateTag,
  onCreateLocation
}) => {
  const [showFilters, setShowFilters] = useState(false);
  
  // Estrai valori unici per i dropdown
  const categories = [...new Set(locations.map(l => l.category))];
  const regions = [...new Set(locations.map(l => l.region))].sort();
  const provinces = [...new Set(
    locations
      .filter(l => !filters.regions.length || filters.regions.includes(l.region))
      .map(l => l.province)
  )].sort();

  const updateFilters = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    
    // Reset province se cambia regione
    if (key === 'regions') {
      newFilters.provinces = [];
    }
    
    onFiltersChange(newFilters);
  };

  const toggleArrayFilter = (key: 'categories' | 'regions' | 'provinces' | 'tags', value: string) => {
    const currentArray = filters[key] as string[];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateFilters(key, newArray);
  };

  const clearAllFilters = () => {
    onFiltersChange({
      search: '',
      categories: [],
      regions: [],
      provinces: [],
      tags: [],
      rating: 0,
      dateFrom: '',
      dateTo: ''
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.search) count++;
    if (filters.categories.length) count += filters.categories.length;
    if (filters.regions.length) count += filters.regions.length;
    if (filters.provinces.length) count += filters.provinces.length;
    if (filters.tags.length) count += filters.tags.length;
    if (filters.rating > 0) count++;
    if (filters.dateFrom || filters.dateTo) count++;
    return count;
  };

  const renderStars = (rating: number, onRate: (rating: number) => void) => {
    return (
      <div className="flex items-center gap-1">
        <span className="text-sm text-gray-600 mr-2">Minimo:</span>
        {Array.from({ length: 5 }, (_, i) => (
          <button
            key={i}
            onClick={() => onRate(i + 1 === rating ? 0 : i + 1)}
            className="focus:outline-none"
          >
            <Star
              className={`w-5 h-5 transition-colors ${
                i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 hover:text-yellow-200'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      {/* Header con ricerca e bottone filtri */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center mb-4">
        {/* Ricerca */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cerca luoghi per nome o descrizione..."
            value={filters.search}
            onChange={(e) => updateFilters('search', e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Bottoni azioni */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
              showFilters 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtri {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
          </button>
          
          <button
            onClick={onCreateLocation}
            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuovo Luogo
          </button>

          <button
            onClick={onCreateTag}
            className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nuovo Tag
          </button>
        </div>
      </div>

      {/* Filtri avanzati */}
      {showFilters && (
        <div className="border-t pt-4 space-y-4">
          {/* Categoria */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categorie</label>
            <div className="flex flex-wrap gap-2">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => toggleArrayFilter('categories', category)}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                    filters.categories.includes(category)
                      ? 'bg-blue-100 text-blue-800 border-blue-300'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Geografia */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Regioni
              </label>
              <div className="flex flex-wrap gap-2">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => toggleArrayFilter('regions', region)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      filters.regions.includes(region)
                        ? 'bg-green-100 text-green-800 border-green-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Province</label>
              <div className="flex flex-wrap gap-2">
                {provinces.map(province => (
                  <button
                    key={province}
                    onClick={() => toggleArrayFilter('provinces', province)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                      filters.provinces.includes(province)
                        ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {province}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Tags con stemmi */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(tags).map(([tagId, tag]) => (
                <button
                  key={tagId}
                  onClick={() => toggleArrayFilter('tags', tagId)}
                  className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                    filters.tags.includes(tagId)
                      ? 'ring-2 ring-offset-1 transform scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: filters.tags.includes(tagId) ? tag.backgroundColor : tag.backgroundColor + '80',
                    color: tag.color,
                    borderColor: tag.color + '60'
                  }}
                >
                  {tag.officialLogo && (
                    <img 
                      src={tag.officialLogo} 
                      alt={tag.name}
                      className="w-4 h-4 object-contain"
                    />
                  )}
                  <span>{tag.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating e Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              {renderStars(filters.rating, (rating) => updateFilters('rating', rating))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Periodo visite
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => updateFilters('dateFrom', e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="self-center text-gray-500">→</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => updateFilters('dateTo', e.target.value)}
                  className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Clear filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex justify-center pt-4 border-t">
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <X className="w-4 h-4" />
                Pulisci tutti i filtri
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationFilters;