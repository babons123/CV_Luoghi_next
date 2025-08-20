// src/app/page.tsx
import Link from 'next/link';
import { getAllLuoghi, getCategorieUniche } from '@/lib/getLuoghi';
import { capitalizeWords, generateSlug } from '@/lib/utils';
import LuogoCard from '@/components/luoghi/LuogoCard';

export default async function HomePage() {
  const tuttiLuoghi = await getAllLuoghi();
  const categorie = getCategorieUniche(tuttiLuoghi);
  
  // Prendi gli ultimi 6 luoghi visitati, ordinandoli per data più recente
  const ultimitLuoghi = tuttiLuoghi
    .sort((a, b) => new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime())
    .slice(0, 6);

  // Conta i luoghi per ogni categoria e genera uno slug per il link
  const conteggioCategorie = categorie.map(categoria => ({
    nome: categoria,
    conteggio: tuttiLuoghi.filter(luogo => luogo.categoria === categoria).length,
    slug: generateSlug(categoria)
  }));

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-16 md:py-20 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            I Miei Viaggi
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Una collezione personale dei luoghi che ho visitato, 
            dalle meraviglie storiche ai tesori naturali.
          </p>
          <div className="flex justify-center gap-8 md:gap-12">
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold">{tuttiLuoghi.length}</span>
              <span className="text-base opacity-80">Luoghi visitati</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold">{categorie.length}</span>
              <span className="text-base opacity-80">Categorie</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categorie */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-semibold text-center mb-12 text-gray-900">
            Esplora per Categoria
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {conteggioCategorie.map((categoria) => (
              <Link 
                key={categoria.nome} 
                href={`/categorie/${categoria.slug}`}
                className="group bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-in-out"
              >
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {capitalizeWords(categoria.nome)}
                </h3>
                <p className="text-gray-500 mb-4">
                  {categoria.conteggio} {categoria.conteggio === 1 ? 'luogo' : 'luoghi'}
                </p>
                <div className="text-indigo-500 text-2xl font-bold transition-transform duration-300 group-hover:translate-x-1">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Ultimi luoghi visitati */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left mb-12">
            <h2 className="text-3xl font-semibold text-gray-900 mb-4 sm:mb-0">
              Ultimi Luoghi Visitati
            </h2>
            <Link href="/categorie" className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors">
              Vedi tutti →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {ultimitLuoghi.map((luogo) => (
              <LuogoCard key={luogo.id} luogo={luogo} showCategory={true} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}