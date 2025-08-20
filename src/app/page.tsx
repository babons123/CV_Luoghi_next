// src/app/page.tsx - IL CODICE CORRETTO PER LA HOMEPAGE
import Link from 'next/link';
import { getAllLuoghi, getCategorieUniche } from '@/lib/getLuoghi';
import { capitalizeWords, generateSlug } from '@/lib/utils';
import LuogoCard from '@/components/luoghi/LuogoCard';

export default async function HomePage() {
  const tuttiLuoghi = await getAllLuoghi();
  const categorie = getCategorieUniche(tuttiLuoghi);
  
  const ultimiLuoghi = tuttiLuoghi
    .sort((a, b) => new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime())
    .slice(0, 6);

  const conteggioCategorie = categorie.map(categoria => ({
    nome: categoria,
    conteggio: tuttiLuoghi.filter(luogo => luogo.categoria === categoria).length,
    slug: generateSlug(categoria)
  }));

  return (
    // Qui ci va il JSX della tua homepage, che avevi già e che era corretto
    // Ad esempio:
    <div className="bg-white text-gray-800">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white py-20 text-center">
          <div className="container mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">I Miei Viaggi</h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">Una collezione personale dei luoghi che ho visitato.</p>
            <div className="flex justify-center gap-12">
              <div>
                <span className="text-4xl font-bold">{tuttiLuoghi.length}</span>
                <span className="block text-base opacity-80">Luoghi visitati</span>
              </div>
              <div>
                <span className="text-4xl font-bold">{categorie.length}</span>
                <span className="block text-base opacity-80">Categorie</span>
              </div>
            </div>
          </div>
        </section>

        {/* Categorie */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-semibold text-center mb-12">Esplora per Categoria</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {conteggioCategorie.map((categoria) => (
                <Link key={categoria.nome} href={`/categorie/${categoria.slug}`}
                  className="group bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl hover:-translate-y-1 transition-all">
                  <h3 className="text-xl font-semibold mb-2">{capitalizeWords(categoria.nome)}</h3>
                  <p className="text-gray-500">{categoria.conteggio} luoghi</p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Ultimi luoghi visitati */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-semibold">Ultimi Luoghi Visitati</h2>
              <Link href="/categorie" className="font-semibold text-indigo-600 hover:text-indigo-800">Vedi tutti →</Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {ultimiLuoghi.map((luogo) => (
                <LuogoCard key={luogo.id} luogo={luogo} showCategory={true} />
              ))}
            </div>
          </div>
        </section>
    </div>
  );
}