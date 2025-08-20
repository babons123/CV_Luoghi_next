// src/app/categorie/[categoria]/page.tsx
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLuoghiByCategoria, getCategorieDisponibili } from '@/lib/getLuoghi';
import { capitalizeWords, generateSlug } from '@/lib/utils';
import CategoriaGrid from '@/components/categorie/CategoriaGrid';

interface CategoriaPageProps {
  params: {
    categoria: string; // Questo è lo slug, es: "castelli-e-fortezze"
  };
}

// NUOVO E FONDAMENTALE: Genera i percorsi statici per le categorie
export async function generateStaticParams() {
  const categorieNomi = await getCategorieDisponibili();
  return categorieNomi.map((nome) => ({
    categoria: generateSlug(nome),
  }));
}

// CORRETTO: Genera metadata dinamici per SEO
export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const categorieDisponibili = await getCategorieDisponibili();
  const nomeCategoria = categorieDisponibili.find(cat => generateSlug(cat) === params.categoria);

  if (!nomeCategoria) {
    return { title: 'Categoria non trovata' };
  }

  const categoriaTitle = capitalizeWords(nomeCategoria);
  return {
    title: `${categoriaTitle} | I Miei Viaggi`,
    description: `Scopri tutti i luoghi nella categoria ${categoriaTitle.toLowerCase()} che ho visitato.`,
  };
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  // CORREZIONE LOGICA: Trova il nome originale della categoria a partire dallo slug
  const categorieDisponibili = await getCategorieDisponibili();
  const nomeCategoria = categorieDisponibili.find(
    cat => generateSlug(cat) === params.categoria
  );

  // Se lo slug non corrisponde a nessuna categoria, mostra 404
  if (!nomeCategoria) {
    notFound();
  }

  // Ora usa il nome corretto (es. "musei") per caricare i dati
  const luoghi = await getLuoghiByCategoria(nomeCategoria);
  
  // Questa condizione ora è una sicurezza aggiuntiva, ma non dovrebbe più essere la causa del 404
  if (luoghi.length === 0) {
    // Potresti mostrare un messaggio "Nessun luogo in questa categoria" invece di un 404
    console.warn(`Nessun luogo trovato per la categoria valida: ${nomeCategoria}`);
  }

  const categoriaTitle = capitalizeWords(nomeCategoria);
  
  const luoghiOrdinati = luoghi.sort((a, b) => 
    new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime()
  );

  // Rimuoviamo lo <style jsx> e usiamo Tailwind per coerenza
  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Header della categoria */}
        <section className="flex flex-col md:flex-row justify-between items-center mb-12 py-8 border-b border-gray-200 gap-6 text-center md:text-left">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
              {categoriaTitle}
            </h1>
            <p className="text-xl text-gray-600">
              {luoghi.length} {luoghi.length === 1 ? 'luogo visitato' : 'luoghi visitati'}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md min-w-[120px]">
              <span className="text-3xl font-bold text-indigo-600">{luoghi.length}</span>
              <span className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Luoghi</span>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-xl shadow-md min-w-[120px]">
              <span className="text-3xl font-bold text-indigo-600">
                {new Set(luoghi.flatMap(l => l.tags)).size}
              </span>
              <span className="text-sm font-semibold text-gray-500 mt-1 uppercase tracking-wider">Tag</span>
            </div>
          </div>
        </section>

        {/* Griglia dei luoghi */}
        <section>
          <CategoriaGrid luoghi={luoghiOrdinati} />
        </section>
      </div>
    </div>
  );
}