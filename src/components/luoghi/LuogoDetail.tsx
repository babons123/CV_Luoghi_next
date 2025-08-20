// src/components/luoghi/LuogoDetail.tsx
'use client'; // Necessario per dynamic import

import { Luogo } from '@/types/luogo';
import { formatDataItaliana, capitalizeWords, generateSlug } from '@/lib/utils';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Tag from '@/components/ui/Tag';

// Carichiamo la mappa dinamicamente e solo sul client-side
const MapLeaflet = dynamic(
  () => import('@/components/luoghi/MapLeaflet'),
  { 
    ssr: false, // Disabilita il Server-Side Rendering per questo componente
    loading: () => <div className="h-[400px] w-full bg-gray-200 rounded-lg animate-pulse"></div>
  }
);

interface LuogoDetailProps {
    luogo: Luogo;
}

export default function LuogoDetail({ luogo }: LuogoDetailProps) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Navigazione Breadcrumb */}
        <div className="mb-8">
          <Link 
            href={`/categorie/${generateSlug(luogo.categoria)}`}
            className="text-indigo-600 hover:underline mb-2 inline-block font-medium"
          >
            ← Torna a {capitalizeWords(luogo.categoria)}
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">{luogo.nome}</h1>
          <p className="text-lg text-gray-500 mt-2">{luogo.indirizzo}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {/* Colonna principale con dettagli e mappa */}
          <div className="md:col-span-2">
            <article className="prose prose-lg max-w-none">
              <h2>Descrizione</h2>
              <p>{luogo.descrizione}</p>
              
              <h2>Commento Personale</h2>
              <p>{luogo.commento}</p>
            </article>
            
            <div className="mt-12">
              <h3 className="text-2xl font-bold mb-4 text-gray-900">Posizione sulla mappa</h3>
              <div className="rounded-xl overflow-hidden shadow-lg">
                <MapLeaflet luogo={luogo} />
              </div>
            </div>
          </div>

          {/* Sidebar con informazioni rapide */}
          <aside className="md:col-span-1">
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-24">
              <h3 className="text-xl font-bold mb-4 border-b pb-3 text-gray-900">Dettagli</h3>
              <ul>
                <li className="mb-4">
                  <strong className="block text-sm font-medium text-gray-500">Data Visita</strong>
                  <span className="text-lg font-semibold text-gray-800">{formatDataItaliana(luogo.data_visita)}</span>
                </li>
                <li className="mb-4">
                  <strong className="block text-sm font-medium text-gray-500">Categoria</strong>
                  <span className="text-lg font-semibold text-gray-800">{capitalizeWords(luogo.categoria)}</span>
                </li>
                {luogo.tags.length > 0 && (
                  <li>
                    <strong className="block text-sm font-medium text-gray-500">Tags</strong>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {luogo.tags.map(tag => (
                        <Tag key={tag}>{tag}</Tag>
                      ))}
                    </div>
                  </li>
                )}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}