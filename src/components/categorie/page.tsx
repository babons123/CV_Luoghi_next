import { getCategorieDisponibili } from '@/lib/getLuoghi';
import { capitalize } from '@/lib/utils';
import Link from 'next/link';

export default async function CategorieIndexPage() {
  const categorie = await getCategorieDisponibili();

  return (
    <main className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8">Tutte le Categorie</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {categorie.map((categoria) => (
          <Link
            key={categoria}
            href={`/categorie/${categoria}`}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-md hover:bg-gray-100 text-center"
          >
            <h2 className="text-xl font-semibold">{capitalize(categoria)}</h2>
          </Link>
        ))}
      </div>
    </main>
  );
}