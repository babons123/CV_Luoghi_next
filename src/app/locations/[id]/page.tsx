// src/app/locations/[id]/page.tsx (o dove si trova la tua LocationPage)
import { notFound } from 'next/navigation';
import { getLocationById, getAllLocationIds } from '@/lib/data';
import { Location, EatenFoodItem } from '@/types/luogo'; // Assicurati di importare Location ed EatenFoodItem

interface LocationPageProps {
  params: {
    id: string;
  };
}

// Questa funzione pre-genererà una pagina per ogni ID trovato in tutti i file JSON
export async function generateStaticParams() {
  const ids = await getAllLocationIds();
  return ids.map((id) => ({
    id: id,
  }));
}

// --- Componente helper per visualizzare la lista dei cibi mangiati (con supporto nidificato) ---
interface EatenFoodsListProps {
  items: EatenFoodItem[];
  level?: number; // Per gestire l'indentazione
}

const EatenFoodsList: React.FC<EatenFoodsListProps> = ({ items, level = 0 }) => {
  if (!items || items.length === 0) {
    return null;
  }

  // Calcola la classe di padding in base al livello di nidificazione
  const paddingLeftClass = `pl-${level * 4}`; // pl-0, pl-4, pl-8, etc.

  return (
    <ul className={`space-y-1 ${paddingLeftClass}`}>
      {items.map((item, index) => (
        <li key={index} className="flex items-start text-gray-700 text-lg">
          <span className={`mr-2 flex-shrink-0 text-xl ${level > 0 ? 'text-gray-500' : 'text-blue-600'}`}>
            {level === 0 ? '✔️' : '▪️'} {/* Icona diversa per main item e sub-item */}
          </span>
          <div className="flex-grow">
            <span className="font-medium">{item.name}</span>
            {/* Ricorsione per i sotto-elementi */}
            {item.subItems && item.subItems.length > 0 && (
              <EatenFoodsList items={item.subItems} level={level + 1} />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};
// -----------------------------------------------------------------------------------


export default async function LocationPage({ params }: LocationPageProps) {
  const locationId = params.id;
  const location: Location | undefined = await getLocationById(locationId); // Specifica il tipo per location

  if (!location) {
    notFound(); // Mostra la pagina 404 se l'ID non corrisponde a nessun luogo
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto p-6 max-w-4xl">
        {/* Header con titolo principale */}
        <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 text-center">
            {location.name}
          </h1>
          <div className="flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-6 py-2 rounded-full text-lg font-medium shadow-md">
              📍 {location.municipality} ({location.province}), {location.region}
            </div>
          </div>
        </div>

        {/* Descrizione */}
        {location.description && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">📖</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Descrizione</h2>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
              <p className="text-gray-700 leading-relaxed text-lg">
                {location.description || "Nessuna descrizione disponibile."}
              </p>
            </div>
          </div>
        )}

        {/* Grid con i dettagli */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Categoria */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">🏷️</span>
              </div>
              <span className="text-sm font-medium text-gray-500">CATEGORIA</span>
            </div>
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-md">
              {location.category}
            </div>
          </div>

          {/* Data Visita */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">📅</span>
              </div>
              <span className="text-sm font-medium text-gray-500">DATA VISITA</span>
            </div>
            <div className="bg-gradient-to-r from-orange-400 to-red-500 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-md">
              {new Date(location.visitDate).toLocaleDateString('it-IT')}
            </div>
          </div>

          {/* Coordinate */}
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center mb-3">
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">🗺️</span>
              </div>
              <span className="text-sm font-medium text-gray-500">COORDINATE</span>
            </div>
            <div className="bg-gradient-to-r from-teal-400 to-cyan-500 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-md">
              {location.coordinates ? `${location.coordinates[0]}, ${location.coordinates[1]}` : "Non disponibili"}
            </div>
          </div>

          {/* Rating (se disponibile) */}
          {location.rating && (
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center mb-3">
                <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-sm">⭐</span>
                </div>
                <span className="text-sm font-medium text-gray-500">VALUTAZIONE</span>
              </div>
              <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-4 py-3 rounded-xl font-semibold text-center shadow-md">
                {location.rating}/5 stelle
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {location.tags && location.tags.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mb-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">🏷️</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Tags</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              {location.tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gradient-to-r from-indigo-400 to-purple-500 text-white px-6 py-3 rounded-full font-medium shadow-lg hover:shadow-xl transition-shadow duration-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Informazioni aggiuntive (se presenti) */}
        {(location.notes || location.website || location.ticketPrice || location.duration || location.address) && ( // Aggiunto location.address
          <div className="bg-white rounded-3xl shadow-lg p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">ℹ️</span>
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Informazioni Aggiuntive</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {location.notes && (
                <div className="bg-gradient-to-br from-rose-50 to-pink-50 rounded-2xl p-6 border border-rose-100">
                  <h3 className="font-semibold text-rose-800 mb-2">Note</h3>
                  <p className="text-gray-700">{location.notes}</p>
                </div>
              )}

              {location.address && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                  <h3 className="font-semibold text-orange-800 mb-2">Indirizzo</h3>
                  <p className="text-gray-700">{location.address}</p>
                </div>
              )}

              {location.website && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">Sito Web</h3>
                  <a href={location.website} target="_blank" rel="noopener noreferrer"
                     className="text-blue-600 hover:text-blue-800 underline break-all">
                    {location.website}
                  </a>
                </div>
              )}

              {location.ticketPrice && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">Prezzo Biglietto</h3>
                  <p className="text-gray-700">€{location.ticketPrice}</p>
                </div>
              )}

              {location.duration && (
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 border border-amber-100">
                  <h3 className="font-semibold text-amber-800 mb-2">Durata</h3>
                  <p className="text-gray-700">{location.duration}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Sezione Cibi Mangiati (solo per categoria ristorante) */}
        {location.category === "ristorante" && location.eatenFoods && location.eatenFoods.length > 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-8 mt-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white font-bold">🍽️</span> {/* Icona per i cibi */}
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Cibi Mangiati</h2>
            </div>
            <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-2xl p-6 border border-pink-100">
              <EatenFoodsList items={location.eatenFoods} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}