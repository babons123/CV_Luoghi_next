'use client';
import { getLuogoById, getAllLuoghi } from '@/lib/getLuoghi';
import LuogoDetail from '@/components/luoghi/LuogoDetail';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type LuogoPageProps = {
  params: {
    id: string;
  };
};

// Genera metadata dinamici per la SEO
export async function generateMetadata({ params }: LuogoPageProps): Promise<Metadata> {
  const luogo = await getLuogoById(parseInt(params.id));
  if (!luogo) {
    return {
      title: 'Luogo non trovato',
    };
  }
  return {
    title: `${luogo.nome} | Portfolio Luoghi`,
    description: luogo.descrizione,
  };
}

// Funzione per generare le pagine statiche in fase di build
export async function generateStaticParams() {
  const luoghi = await getAllLuoghi();
  return luoghi.map((luogo) => ({
    categoria: luogo.categoria,
    id: luogo.id.toString(),
  }));
}

export default async function LuogoPage({ params }: LuogoPageProps) {
  const luogo = await getLuogoById(parseInt(params.id));

  if (!luogo) {
    notFound(); // Mostra una pagina 404
  }

  return (
    <main className="container mx-auto p-4">
      <LuogoDetail luogo={luogo} />
    </main>
  );
}