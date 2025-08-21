import { notFound } from 'next/navigation';
// Queste funzioni ora leggono da tutti i tuoi file JSON!
import { getLocationById, getAllLocationIds } from '@/lib/data'; 

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

export default async function LocationPage({ params }: LocationPageProps) {
  const locationId = params.id;
  const location = await getLocationById(locationId);

  if (!location) {
    notFound(); // Mostra la pagina 404 se l'ID non corrisponde a nessun luogo
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-4">{location.name}</h1>
      <p className="text-lg text-gray-600 mb-2">
        {location.municipality} ({location.province}), {location.region}
      </p>
      
      <div className="prose lg:prose-xl mt-8">
        <p>{location.description || "Nessuna descrizione disponibile."}</p>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold">Dettagli</h2>
        <ul className="list-disc list-inside">
          <li><strong>Categoria:</strong> {location.category}</li>
          <li><strong>Data Visita:</strong> {new Date(location.visitDate).toLocaleDateString('it-IT')}</li>
          <li><strong>Coordinate:</strong> {location.coordinates ? `${location.coordinates.lat}, ${location.coordinates.lng}` : "Non disponibili"}</li>
          <li><strong>Tags:</strong> {location.tags && location.tags.length > 0 ? location.tags.join(', ') : "Nessun tag associato"}</li>          
          {/* Aggiungi altri dettagli che vuoi mostrare */}
        </ul>
      </div>
    </div>
  );
}