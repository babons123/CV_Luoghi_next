'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import LocationFilters from '@/components/LocationFilters';
import LocationList from '@/components/LocationList';
import CreateLocationForm from '@/components/CreateLocationForm';
import CreateTagForm from '@/components/CreateTagForm';
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

  // stati per aprire/chiudere i modali
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [showTagForm, setShowTagForm] = useState(false);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };
  
  const handleLocationClick = (location: Location) => {
    router.push(`/locations/${location.id}`);
  };

  // salvataggi (puoi integrarli con la logica di CreationManager se vuoi)
  const handleLocationSave = (location: Location) => {
    console.log('Nuovo luogo salvato:', location);
    setShowLocationForm(false);
  };

  const handleTagSave = (tag: Tag) => {
    console.log('Nuovo tag salvato:', tag);
    setShowTagForm(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <LocationFilters
        locations={initialLocations}
        tags={allTags}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        onCreateLocation={() => setShowLocationForm(true)}  // usa i bottoni già presenti
        onCreateTag={() => setShowTagForm(true)}
      />
      
      <LocationList
        locations={initialLocations}
        tags={allTags}
        filters={filters}
        onLocationClick={handleLocationClick}
      />

      {/* modali dei form */}
      {showLocationForm && (
        <CreateLocationForm
          onSave={handleLocationSave}
          onCancel={() => setShowLocationForm(false)}
        />
      )}

      {showTagForm && (
        <CreateTagForm
          onSave={handleTagSave}
          onCancel={() => setShowTagForm(false)}
        />
      )}
    </div>
  );
};

export default HomePageClient;