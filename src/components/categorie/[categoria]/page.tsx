import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getLuoghiByCategoria } from '@/lib/getLuoghi';
import { capitalizeWords } from '@/lib/utils';
import LuogoCard from '@/components/luoghi/LuogoCard';
import CategoriaGrid from '@/components/categorie/CategoriaGrid';

interface CategoriaPageProps {
  params: {
    categoria: string;
  };
}

// Genera metadata dinamici per SEO
export async function generateMetadata({ params }: CategoriaPageProps): Promise<Metadata> {
  const categoriaDecoded = decodeURIComponent(params.categoria);
  const categoriaTitle = capitalizeWords(categoriaDecoded.replace(/-/g, ' '));
  
  const luoghi = await getLuoghiByCategoria(categoriaDecoded);
  
  if (!luoghi.length) {
    return {
      title: 'Categoria non trovata',
      description: 'La categoria richiesta non è stata trovata.'
    };
  }

  return {
    title: `${categoriaTitle} | I Miei Viaggi`,
    description: `Scopri tutti i ${luoghi.length} ${categoriaTitle.toLowerCase()} che ho visitato. Foto, commenti e informazioni dettagliate su ogni luogo.`,
    keywords: [categoriaTitle.toLowerCase(), 'viaggi', 'turismo', 'luoghi visitati', 'italia'],
    openGraph: {
      title: `${categoriaTitle} | I Miei Viaggi`,
      description: `${luoghi.length} ${categoriaTitle.toLowerCase()} visitati`,
      type: 'website',
    },
  };
}

export default async function CategoriaPage({ params }: CategoriaPageProps) {
  const categoriaDecoded = decodeURIComponent(params.categoria);
  const luoghi = await getLuoghiByCategoria(categoriaDecoded);
  
  // Se non ci sono luoghi per questa categoria, mostra 404
  if (!luoghi.length) {
    notFound();
  }

  const categoriaTitle = capitalizeWords(categoriaDecoded.replace(/-/g, ' '));
  
  // Ordina i luoghi per data di visita (più recenti prima)
  const luoghiOrdinati = luoghi.sort((a, b) => 
    new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime()
  );

  return (
    <div className="categoria-page">
      <div className="container">
        {/* Header della categoria */}
        <section className="categoria-header">
          <div className="categoria-header__content">
            <h1 className="categoria-header__title">{categoriaTitle}</h1>
            <p className="categoria-header__subtitle">
              {luoghi.length} {luoghi.length === 1 ? 'luogo visitato' : 'luoghi visitati'}
            </p>
          </div>
          <div className="categoria-header__stats">
            <div className="stat-card">
              <span className="stat-card__number">{luoghi.length}</span>
              <span className="stat-card__label">Luoghi</span>
            </div>
            <div className="stat-card">
              <span className="stat-card__number">
                {new Set(luoghi.flatMap(l => l.tags)).size}
              </span>
              <span className="stat-card__label">Tag</span>
            </div>
          </div>
        </section>

        {/* Griglia dei luoghi */}
        <section className="categoria-content">
          <CategoriaGrid luoghi={luoghiOrdinati} />
        </section>
      </div>

      <style jsx>{`
        .categoria-page {
          min-height: 100vh;
          padding: 2rem 0;
        }

        .categoria-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 3rem;
          padding: 2rem 0;
          border-bottom: 1px solid #e2e8f0;
        }

        .categoria-header__content {
          flex: 1;
        }

        .categoria-header__title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 0.5rem 0;
          line-height: 1.2;
        }

        .categoria-header__subtitle {
          font-size: 1.25rem;
          color: #718096;
          margin: 0;
        }

        .categoria-header__stats {
          display: flex;
          gap: 1.5rem;
        }

        .stat-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          min-width: 100px;
        }

        .stat-card__number {
          font-size: 2rem;
          font-weight: 700;
          color: #667eea;
          line-height: 1;
        }

        .stat-card__label {
          font-size: 0.9rem;
          color: #718096;
          margin-top: 0.5rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
        }

        .categoria-content {
          margin-bottom: 2rem;
        }

        @media (max-width: 768px) {
          .categoria-page {
            padding: 1rem 0;
          }

          .categoria-header {
            flex-direction: column;
            align-items: stretch;
            gap: 1.5rem;
            text-align: center;
          }

          .categoria-header__title {
            font-size: 2rem;
          }

          .categoria-header__subtitle {
            font-size: 1.1rem;
          }

          .categoria-header__stats {
            justify-content: center;
            gap: 1rem;
          }

          .stat-card {
            padding: 1rem;
            min-width: 80px;
          }

          .stat-card__number {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 480px) {
          .categoria-header__stats {
            flex-direction: column;
            align-items: center;
          }

          .stat-card {
            width: 100%;
            max-width: 200px;
            flex-direction: row;
            justify-content: space-between;
          }

          .stat-card__number {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
}