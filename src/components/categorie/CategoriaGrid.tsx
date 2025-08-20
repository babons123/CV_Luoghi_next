'use client';

import { useState, useMemo } from 'react';
import { Luogo } from '@/types/luogo';
import { getTagsUnici } from '@/lib/getLuoghi';
import LuogoCard from '@/components/luoghi/LuogoCard';

interface CategoriaGridProps {
  luoghi: Luogo[];
}

type SortOption = 'date-desc' | 'date-asc' | 'name-asc' | 'name-desc';

export default function CategoriaGrid({ luoghi }: CategoriaGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [searchQuery, setSearchQuery] = useState('');

  // Ottieni tutti i tag disponibili
  const availableTags = useMemo(() => getTagsUnici(luoghi), [luoghi]);

  // Filtra e ordina i luoghi
  const filteredAndSortedLuoghi = useMemo(() => {
    let filtered = luoghi;

    // Filtro per ricerca testuale
    if (searchQuery) {
      filtered = filtered.filter(luogo =>
        luogo.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        luogo.indirizzo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        luogo.descrizione.toLowerCase().includes(searchQuery.toLowerCase()) ||
        luogo.commento.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filtro per tag
    if (selectedTags.length > 0) {
      filtered = filtered.filter(luogo =>
        selectedTags.every(tag =>
          luogo.tags.some(luogoTag =>
            luogoTag.toLowerCase().includes(tag.toLowerCase())
          )
        )
      );
    }

    // Ordinamento
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime();
        case 'date-asc':
          return new Date(a.data_visita).getTime() - new Date(b.data_visita).getTime();
        case 'name-asc':
          return a.nome.localeCompare(b.nome, 'it');
        case 'name-desc':
          return b.nome.localeCompare(a.nome, 'it');
        default:
          return 0;
      }
    });

    return sorted;
  }, [luoghi, selectedTags, sortBy, searchQuery]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedTags([]);
    setSearchQuery('');
  };

  return (
    <div className="categoria-grid">
      {/* Filtri e controlli */}
      <div className="categoria-grid__controls">
        <div className="categoria-grid__search">
          <input
            type="text"
            placeholder="Cerca luoghi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="categoria-grid__sort">
          <label htmlFor="sort-select" className="sort-label">
            Ordina per:
          </label>
          <select
            id="sort-select"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
            className="sort-select"
          >
            <option value="date-desc">Data (più recenti)</option>
            <option value="date-asc">Data (meno recenti)</option>
            <option value="name-asc">Nome (A-Z)</option>
            <option value="name-desc">Nome (Z-A)</option>
          </select>
        </div>
      </div>

      {/* Tag filters */}
      {availableTags.length > 0 && (
        <div className="categoria-grid__tags">
          <h3 className="tags-title">Filtra per tag:</h3>
          <div className="tags-container">
            {availableTags.map((tag) => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`tag-button ${
                  selectedTags.includes(tag) ? 'tag-button--active' : ''
                }`}
                type="button"
              >
                {tag}
              </button>
            ))}
          </div>
          {selectedTags.length > 0 && (
            <button
              onClick={clearFilters}
              className="clear-filters-button"
              type="button"
            >
              Rimuovi filtri ({selectedTags.length})
            </button>
          )}
        </div>
      )}

      {/* Risultati */}
      <div className="categoria-grid__results">
        <p className="results-count">
          {filteredAndSortedLuoghi.length} di {luoghi.length} luoghi
        </p>

        {filteredAndSortedLuoghi.length === 0 ? (
          <div className="no-results">
            <h3>Nessun luogo trovato</h3>
            <p>Prova a modificare i filtri di ricerca o rimuovere alcuni tag.</p>
            {(selectedTags.length > 0 || searchQuery) && (
              <button
                onClick={clearFilters}
                className="btn btn--primary"
                type="button"
              >
                Rimuovi tutti i filtri
              </button>
            )}
          </div>
        ) : (
          <div className="luoghi-grid">
            {filteredAndSortedLuoghi.map((luogo) => (
              <LuogoCard key={luogo.id} luogo={luogo} />
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .categoria-grid {
          width: 100%;
        }

        .categoria-grid__controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 2rem;
          align-items: end;
        }

        .categoria-grid__search {
          flex: 1;
        }

        .search-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }

        .search-input:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .categoria-grid__sort {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          min-width: 200px;
        }

        .sort-label {
          font-size: 0.875rem;
          font-weight: 600;
          color: #4a5568;
        }

        .sort-select {
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          background: white;
          cursor: pointer;
          transition: border-color 0.3s ease;
        }

        .sort-select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        .categoria-grid__tags {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .tags-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0 0 1rem 0;
          color: #1a202c;
        }

        .tags-container {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }

        .tag-button {
          padding: 0.5rem 1rem;
          border: 2px solid #e2e8f0;
          background: white;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #4a5568;
        }

        .tag-button:hover {
          border-color: #667eea;
          color: #667eea;
          transform: translateY(-1px);
        }

        .tag-button--active {
          background: #667eea;
          border-color: #667eea;
          color: white;
        }

        .clear-filters-button {
          padding: 0.5rem 1rem;
          background: #f56565;
          color: white;
          border: none;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .clear-filters-button:hover {
          background: #e53e3e;
        }

        .categoria-grid__results {
          margin-top: 2rem;
        }

        .results-count {
          font-size: 0.95rem;
          color: #718096;
          margin: 0 0 1.5rem 0;
          font-weight: 500;
        }

        .no-results {
          text-align: center;
          padding: 3rem 2rem;
          background: #f8f9fa;
          border-radius: 12px;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin: 0 0 0.5rem 0;
          color: #2d3748;
        }

        .no-results p {
          color: #718096;
          margin: 0 0 1.5rem 0;
        }

        .luoghi-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 2rem;
        }

        @media (max-width: 768px) {
          .categoria-grid__controls {
            flex-direction: column;
            align-items: stretch;
          }

          .categoria-grid__sort {
            min-width: auto;
          }

          .tags-container {
            justify-content: center;
          }

          .luoghi-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .no-results {
            padding: 2rem 1rem;
          }
        }

        @media (max-width: 480px) {
          .categoria-grid__tags {
            padding: 1rem;
          }

          .tags-title {
            font-size: 1rem;
          }

          .tag-button {
            font-size: 0.8rem;
            padding: 0.4rem 0.8rem;
          }
        }
      `}</style>
    </div>
  );
}