// src/app/categorie/[categoria]/[id]/page.tsx
import { notFound } from 'next/navigation';
import { getLuogoById, getAllLuoghi } from '@/lib/getLuoghi';
import { generateSlug } from '@/lib/utils';
import LuogoDetail from '@/components/luoghi/LuogoDetail';
import { Metadata } from 'next';

// Props della pagina
interface LuogoDetailPageProps {
  params: { id: string };
}

// Funzione per generare Metadata dinamici (ottimo per SEO)
export async function generateMetadata({ params }: LuogoDetailPageProps): Promise<Metadata> {
  const id = parseInt(params.id, 10);
  const luogo = await getLuogoById(id);

  if (!luogo) {
    return {
      title: 'Luogo non trovato',
    };
  }

  return {
    title: `${luogo.nome} | Portfolio Luoghi`,
    description: truncateText(luogo.descrizione, 155), // Funzione da utils.ts
  };
}

// Funzione per generare le pagine statiche in fase di build
export async function generateStaticParams() {
  const luoghi = await getAllLuoghi();
  return luoghi.map((luogo) => ({
    categoria: generateSlug(luogo.categoria),
    id: luogo.id.toString(),
  }));
}

// Il componente Pagina
export default async function LuogoDetailPage({ params }: LuogoDetailPageProps) {
  const id = parseInt(params.id, 10);
  const luogo = await getLuogoById(id);

  if (!luogo) {
    notFound(); // Se il luogo non esiste, mostra una 404
  }

  return <LuogoDetail luogo={luogo} />;
}

// Aggiungi questa funzione a `utils.ts` se non c'è
function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substr(0, text.lastIndexOf(' ', maxLength)) + '...';
}