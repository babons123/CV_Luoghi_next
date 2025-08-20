// src/components/luoghi/LuogoCard.tsx
'use client';
import Link from 'next/link';
import { Luogo } from '@/types/luogo';
import { formatDataItaliana, truncateText, capitalize, generateSlug } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Tag from '@/components/ui/Tag';

interface LuogoCardProps {
  luogo: Luogo;
  showCategory?: boolean;
}

export default function LuogoCard({ luogo, showCategory = false }: LuogoCardProps) {
  const categoriaSlug = generateSlug(luogo.categoria);

  return (
    <Link href={`/categorie/${categoriaSlug}/${luogo.id}`} className="block h-full">
      <Card className="h-full flex flex-col">
        <div className="p-6 flex-grow flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-start gap-4 mb-4">
            <h3 className="text-xl font-bold text-gray-900 leading-tight">
              {luogo.nome}
            </h3>
            {showCategory && (
              <span className="bg-gray-100 text-gray-700 text-sm font-medium px-3 py-1 rounded-full whitespace-nowrap">
                {capitalize(luogo.categoria)}
              </span>
            )}
          </div>
          
          {/* Contenuto */}
          <div className="flex-grow">
            <p className="text-sm text-gray-500 mb-3 italic">{luogo.indirizzo}</p>
            <p className="text-gray-700 text-base leading-relaxed">
              {truncateText(luogo.descrizione, 120)}
            </p>
          </div>
          
          {/* Footer */}
          <div className="mt-6">
            <div className="mb-4">
              <p className="text-xs text-gray-500">Visitato il:</p>
              <p className="font-semibold text-gray-800">
                {formatDataItaliana(luogo.data_visita)}
              </p>
            </div>
            
            {luogo.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {luogo.tags.slice(0, 3).map((tag, index) => (
                  <Tag key={index}>{tag}</Tag>
                ))}
                {luogo.tags.length > 3 && (
                  <Tag className="bg-gray-200 text-gray-800">
                    +{luogo.tags.length - 3}
                  </Tag>
                )}
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}