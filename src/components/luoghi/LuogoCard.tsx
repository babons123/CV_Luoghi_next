'use client';
import Link from 'next/link';
import { Luogo } from '@/types/luogo';
import { formatDataItaliana, truncateText, capitalize, generateSlug } from '@/lib/utils';

interface LuogoCardProps {
  luogo: Luogo;
  showCategory?: boolean;
}

export default function LuogoCard({ luogo, showCategory = false }: LuogoCardProps) {
  const categoriaSlug = generateSlug(luogo.categoria);
  
  return (
    <div className="luogo-card">
      <Link href={`/categorie/${categoriaSlug}/${luogo.id}`} className="luogo-card__link">
        <div className="luogo-card__header">
          <h3 className="luogo-card__title">{luogo.nome}</h3>
          {showCategory && (
            <span className="luogo-card__category">{capitalize(luogo.categoria)}</span>
          )}
        </div>
        
        <div className="luogo-card__content">
          <p className="luogo-card__address">{luogo.indirizzo}</p>
          <p className="luogo-card__description">
            {truncateText(luogo.descrizione, 120)}
          </p>
        </div>
        
        <div className="luogo-card__footer">
          <div className="luogo-card__date">
            <span className="luogo-card__date-label">Visitato il:</span>
            <span className="luogo-card__date-value">
              {formatDataItaliana(luogo.data_visita)}
            </span>
          </div>
          
          {luogo.tags.length > 0 && (
            <div className="luogo-card__tags">
              {luogo.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="luogo-card__tag">
                  {tag}
                </span>
              ))}
              {luogo.tags.length > 3 && (
                <span className="luogo-card__tag luogo-card__tag--more">
                  +{luogo.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </Link>
      
      <style jsx>{`
        .luogo-card {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }
        
        .luogo-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
        }
        
        .luogo-card__link {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
          padding: 1.5rem;
        }
        
        .luogo-card__header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .luogo-card__title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a202c;
          margin: 0;
          line-height: 1.3;
        }
        
        .luogo-card__category {
          background: #e2e8f0;
          color: #4a5568;
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
        }
        
        .luogo-card__content {
          flex: 1;
          margin-bottom: 1rem;
        }
        
        .luogo-card__address {
          color: #666;
          font-size: 0.9rem;
          margin: 0 0 0.75rem 0;
          font-style: italic;
        }
        
        .luogo-card__description {
          color: #4a5568;
          line-height: 1.5;
          margin: 0;
        }
        
        .luogo-card__footer {
          margin-top: auto;
        }
        
        .luogo-card__date {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          margin-bottom: 1rem;
        }
        
        .luogo-card__date-label {
          font-size: 0.8rem;
          color: #718096;
          font-weight: 500;
        }
        
        .luogo-card__date-value {
          font-size: 0.9rem;
          color: #2d3748;
          font-weight: 600;
        }
        
        .luogo-card__tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        
        .luogo-card__tag {
          background: #edf2f7;
          color: #4a5568;
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .luogo-card__tag--more {
          background: #cbd5e0;
          color: #2d3748;
        }
        
        @media (max-width: 768px) {
          .luogo-card__link {
            padding: 1rem;
          }
          
          .luogo-card__header {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }
          
          .luogo-card__category {
            align-self: flex-start;
          }
        }
      `}</style>
    </div>
  );
}