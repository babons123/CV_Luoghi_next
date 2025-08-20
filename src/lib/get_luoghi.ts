import { Luogo, FilterOptions } from '@/types/luogo';

// Mappa delle categorie disponibili
const CATEGORIE_DISPONIBILI = [
  'musei',
  'castelli', 
  'parchi',
  'chiese',
  'monumenti',
  'natura'
];

/**
 * Carica tutti i luoghi da tutti i file JSON
 */
export async function getAllLuoghi(): Promise<Luogo[]> {
  const tuttiILuoghi: Luogo[] = [];
  
  for (const categoria of CATEGORIE_DISPONIBILI) {
    try {
      const luoghi = await getLuoghiByCategoria(categoria);
      tuttiILuoghi.push(...luoghi);
    } catch (error) {
      console.warn(`Categoria ${categoria} non trovata o errore nel caricamento:`, error);
    }
  }
  
  return tuttiILuoghi;
}

/**
 * Carica luoghi per una specifica categoria
 */
export async function getLuoghiByCategoria(categoria: string): Promise<Luogo[]> {
  try {
    const response = await fetch(`/data/${categoria}.json`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: Luogo[] = await response.json();
    return data;
  } catch (error) {
    console.error(`Errore nel caricamento della categoria ${categoria}:`, error);
    return [];
  }
}

/**
 * Trova un luogo specifico per ID e categoria
 */
export async function getLuogoById(categoria: string, id: number): Promise<Luogo | null> {
  try {
    const luoghi = await getLuoghiByCategoria(categoria);
    return luoghi.find(luogo => luogo.id === id) || null;
  } catch (error) {
    console.error(`Errore nel trovare il luogo ${id} nella categoria ${categoria}:`, error);
    return null;
  }
}

/**
 * Filtra i luoghi in base ai criteri specificati
 */
export function filtrareLuoghi(luoghi: Luogo[], filtri: FilterOptions): Luogo[] {
  return luoghi.filter(luogo => {
    // Filtro per categoria
    if (filtri.categoria && luogo.categoria !== filtri.categoria) {
      return false;
    }
    
    // Filtro per tags
    if (filtri.tags && filtri.tags.length > 0) {
      const hasTags = filtri.tags.every(tag => 
        luogo.tags.some(luogoTag => 
          luogoTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasTags) return false;
    }
    
    // Filtro per data (range)
    if (filtri.dataInizio || filtri.dataFine) {
      const dataVisita = new Date(luogo.data_visita);
      
      if (filtri.dataInizio && dataVisita < new Date(filtri.dataInizio)) {
        return false;
      }
      
      if (filtri.dataFine && dataVisita > new Date(filtri.dataFine)) {
        return false;
      }
    }
    
    return true;
  });
}

/**
 * Ottiene tutte le categorie uniche dai luoghi
 */
export function getCategorieUniche(luoghi: Luogo[]): string[] {
  return [...new Set(luoghi.map(luogo => luogo.categoria))];
}

/**
 * Ottiene tutti i tag unici dai luoghi
 */
export function getTagsUnici(luoghi: Luogo[]): string[] {
  const tuttiTags = luoghi.flatMap(luogo => luogo.tags);
  return [...new Set(tuttiTags)].sort();
}