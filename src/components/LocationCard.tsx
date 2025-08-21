import React from "react";
import { MapPin, Calendar, Star, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface Tag {
  id: string;
  name: string;
  color: string;
  backgroundColor: string;
  officialLogo?: string;
  category: "geographic" | "certification" | "thematic" | "experience";
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
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("it-IT", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      castelli: "🏰",
      ristoranti: "🍽️",
      parchi: "🌳",
      musei: "🏛️",
      chiese: "⛪",
      borghi: "🏘️",
    };
    return icons[category] || "📍";
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white rounded-2xl shadow-lg hover:shadow-xl 
                 transition-all duration-300 p-6 cursor-pointer 
                 border border-gray-100 hover:border-blue-400 
                 hover:-translate-y-1"
      onClick={() => onClick?.(location)}
    >
      {/* Header con categoria e rating */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 bg-blue-50 text-blue-600 
                           px-3 py-1 rounded-full text-xs font-semibold">
            <span>{getCategoryIcon(location.category)}</span>
            <span className="capitalize">{location.category}</span>
          </span>
        </div>
        {location.rating && (
          <div className="flex items-center gap-1">{renderStars(location.rating)}</div>
        )}
      </div>

      {/* Nome e descrizione */}
      <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
        {location.name}
      </h3>
      <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
        {location.description}
      </p>

      {/* Informazioni geografiche e data */}
      <div className="flex flex-wrap gap-3 mb-4 text-sm">
        <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded">
          <MapPin className="w-4 h-4" />
          <span>
            {location.municipality && `${location.municipality}, `}
            {location.province} ({location.region})
          </span>
        </div>
        <div className="flex items-center gap-1 text-gray-600 bg-gray-50 px-2 py-1 rounded">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(location.visitDate)}</span>
        </div>
      </div>

      {/* Tags */}
      {location.tags && location.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {location.tags.map((tagId) => {
            const tag = tags[tagId];
            if (!tag) return null;

            return (
              <span
                key={tagId}
                className="inline-flex items-center gap-1 px-3 py-1 
                           rounded-full text-xs font-medium border 
                           transition-all hover:scale-105 shadow-sm"
                style={{
                  backgroundColor: tag.backgroundColor,
                  color: tag.color,
                  borderColor: tag.color + "40",
                }}
              >
                {tag.officialLogo && (
                  <img
                    src={tag.officialLogo}
                    alt={tag.name}
                    className="w-4 h-4"
                  />
                )}
                {tag.name}
              </span>
            );
          })}
        </div>
      )}

      {/* Footer con link e CTA */}
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="flex gap-3">
          {location.website && (
            <a
              href={location.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" /> Sito
            </a>
          )}
          {location.drivePhotosUrl && (
            <a
              href={location.drivePhotosUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-green-600 hover:text-green-800 font-medium"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="w-4 h-4" /> Foto
            </a>
          )}
        </div>

        <button
          className="text-sm font-semibold text-blue-600 hover:text-blue-800 
                     transition-colors flex items-center gap-1"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.(location);
          }}
        >
          Dettagli <span className="text-lg">→</span>
        </button>
      </div>
    </motion.div>
  );
};

export default LocationCard;
