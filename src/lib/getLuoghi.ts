import fs from 'fs/promises';
import path from 'path';
import { Luogo, FilterOptions } from '@/types/luogo';

// Definisce il percorso assoluto della cartella 'data' nella root del progetto.
// Questo funziona in modo affidabile sia in sviluppo che in produzione.
const dataDir = path.join(process.cwd(), 'data');

/**
 * Legge la cartella /data e restituisce un array con i nomi di tutte le categorie 
 * (basandosi sui nomi dei file .json).
 * In questo modo, non è più necessario un array `CATEGORIE_DISPONIBILI` hardcodato.
 */
export async function getCategorieDisponibili(): Promise<string[]> {
  try {
    const filenames = await fs.readdir(dataDir);
    return filenames
      .filter(fn => fn.endsWith('.json'))
      .map(fn => fn.replace('.json', ''));
  } catch (error) {
    console.error("Errore critico: impossibile leggere la cartella 'data'. Assicurati che esista.", error);
    return [];
  }
}

/**
 * Carica tutti i luoghi da tutti i file JSON disponibili nella cartella /data.
 * È scalabile: aggiungi un nuovo file JSON e verrà letto automaticamente.
 */
export async function getAllLuoghi(): Promise<Luogo[]> {
  const categorie = await getCategorieDisponibili();
  let tuttiILuoghi: Luogo[] = [];
  
  for (const categoria of categorie) {
    const luoghi = await getLuoghiByCategoria(categoria);
    tuttiILuoghi.push(...luoghi);
  }
  
  // Ordina tutti i luoghi per data di visita, dalla più recente alla più vecchia.
  return tuttiILuoghi.sort((a, b) => new Date(b.data_visita).getTime() - new Date(a.data_visita).getTime());
}

/**
 * Carica luoghi per una specifica categoria leggendo il file JSON corrispondente
 * dal file system del server. Questo sostituisce `fetch`.
 */
export async function getLuoghiByCategoria(categoria: string): Promise<Luogo[]> {
  const filePath = path.join(dataDir, `${categoria}.json`);
  try {
    // Legge il contenuto del file come testo
    const fileContents = await fs.readFile(filePath, 'utf8');
    // Converte il testo JSON in un array di oggetti
    const data: Luogo[] = JSON.parse(fileContents);
    return data;
  } catch (error) {
    console.warn(`File per la categoria '${categoria}.json' non trovato o illeggibile. Restituisco un array vuoto.`);
    return [];
  }
}

/**
 * Trova un luogo specifico tramite il suo ID.
 * Cerca in tutti i file JSON per trovare una corrispondenza.
 * Non necessita più del parametro 'categoria', rendendolo più semplice da usare.
 */
export async function getLuogoById(id: number): Promise<Luogo | null> {
  const tuttiLuoghi = await getAllLuoghi();
  return tuttiLuoghi.find(luogo => luogo.id === id) || null;
}


// ==============================================================================
// LE TUE FUNZIONI DI FILTRO SONO GIÀ CORRETTE E NON NECESSITANO DI MODIFICHE
// Poiché operano su un array di dati già caricato, rimangono invariate.
// ==============================================================================

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
 * Ottiene tutte le categorie uniche da un array di luoghi già caricato
 */
export function getCategorieUniche(luoghi: Luogo[]): string[] {
  return [...new Set(luoghi.map(luogo => luogo.categoria))];
}

/**
 * Ottiene tutti i tag unici da un array di luoghi già caricato
 */
export function getTagsUnici(luoghi: Luogo[]): string[] {
  const tuttiTags = luoghi.flatMap(luogo => luogo.tags);
  return [...new Set(tuttiTags)].sort();
}