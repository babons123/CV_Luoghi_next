import React from 'react';
import { MapPin, Calendar, Star, ExternalLink } from 'lucide-react';

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

interface LocationCardProps {
  location: Location;
  tags: Record<string, Tag>;
  onClick?: (location: Location) => void;
}

const LocationCard: React.FC<LocationCardProps> = ({ location, tags, onClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
        }`}
      />
    ));
  };

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

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 cursor-pointer border border-gray-200 hover:border-blue-300"
      onClick={() => onClick?.(location)}
    >
      {/* Header con categoria e rating */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{getCategoryIcon(location.category)}</span>
          <span className="text-sm font-medium text-gray-600 capitalize bg-gray-100 px-2 py-1 rounded">
            {location.category}
          </span>
        </div>
        {location.rating && (
          <div className="flex items-center gap-1">
            {renderStars(location.rating)}
          </div>
        )}
      </div>

      {/* Nome e descrizione */}
      <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-1">
        {location.name}
      </h3>
      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {location.description}
      </p>

      {/* Informazioni geografiche */}
      <div className="flex items-center gap-1 mb-3 text-sm text-gray-500">
        <MapPin className="w-4 h-4" />
        <span>
          {location.municipality && `${location.municipality}, `}
          {location.province} ({location.region})
        </span>
      </div>

      {/* Data visita */}
      <div className="flex items-center gap-1 mb-4 text-sm text-gray-500">
        <Calendar className="w-4 h-4" />
        <span>Visitato il {formatDate(location.visitDate)}</span>
      </div>

      {/* Tags */}
      {location.tags && location.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {location.tags.map((tagId) => {
            const tag = tags[tagId];
            if (!tag) return null;
            
            return (
              <div
                key={tagId}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-transform hover:scale-105"
                style={{
                  backgroundColor: tag.backgroundColor,
                  color: tag.color,
                  borderColor: tag.color + '40'
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
              </div>
            );
          })}
        </div>
      )}

      {/* Footer con link */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="flex gap-2">
          {location.website && (
            <a
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              Sito web
            </a>
          )}
          {location.drivePhotosUrl && (
            <a
              href={location.drivePhotosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-green-600 hover:text-green-800 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" />
              Foto
            </a>
          )}
        </div>
        
        <button 
          className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(location);
          }}
        >
          Dettagli →
        </button>
      </div>
    </div>
  );
};

export default LocationCard;