'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationFilters from '@/components/LocationFilters';
import LocationList from '@/components/LocationList';
import { Location, Tag, FilterState } from '@/types/luogo';

interface HomePageClientProps {
  initialLocations: Location[];
  allTags: Record<string, Tag>;
}

const HomePageClient: React.FC<HomePageClientProps> = ({ initialLocations, allTags }) => {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    categories: [],
    regions: [],
    provinces: [],
    tags: [],
    rating: 0,
    dateFrom: '',
    dateTo: '',
  });

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleLocationClick = (location: Location) => {
    console.log('Naviga a:', `/locations/${location.id}`);
    router.push(`/locations/${location.id}`);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <LocationFilters
        locations={initialLocations}
        tags={allTags}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onCreateLocation={() => alert('Funzione "Crea Luogo" non implementata.')}
        onCreateTag={() => alert('Funzione "Crea Tag" non implementata.')}
      />
      
      <LocationList
        locations={initialLocations}
        tags={allTags}
        filters={filters}
        onLocationClick={handleLocationClick}
      />
    </div>
  );
};

export default HomePageClient;