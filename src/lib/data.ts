// src/lib/data.ts
import fs from 'fs/promises';
import path from 'path';
import { Location, Tag } from '@/types/luogo';

const dataDirectory = path.join(process.cwd(), 'data');

// --- OTTIMIZZAZIONE: Aggiungiamo una cache ---
// Questa variabile manterrà i dati in memoria dopo la prima lettura.
let allLocationsCache: Location[] | null = null;


export async function getAllLocations(): Promise<Location[]> {
  // Se i dati sono già in cache, restituiscili subito senza leggere i file.
  if (allLocationsCache) {
    return allLocationsCache;
  }

  const locationsDir = path.join(dataDirectory, 'locations');
  const filenames = await fs.readdir(locationsDir);

  let allLocations: Location[] = [];

  for (const filename of filenames) {
    if (filename.endsWith('.json')) {
      const filePath = path.join(locationsDir, filename);
      const fileContents = await fs.readFile(filePath, 'utf8');
      const locationsInCategory: Location[] = JSON.parse(fileContents);
      allLocations = [...allLocations, ...locationsInCategory];
    }
  }

  // Ordina per data di visita decrescente
  const sortedLocations = allLocations.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());

  // Salva il risultato in cache per le prossime volte
  allLocationsCache = sortedLocations;

  return sortedLocations;
}


// --- NUOVA FUNZIONE 1: Ottenere un luogo per ID ---
/**
 * Trova un singolo luogo basato sul suo ID.
 * Richiama getAllLocations() per ottenere i dati e poi cerca l'elemento corrispondente.
 */
export async function getLocationById(id: string): Promise<Location | undefined> {
  const locations = await getAllLocations();
  return locations.find(location => location.id === id);
}


// --- NUOVA FUNZIONE 2: Ottenere tutti gli ID ---
/**
 * Restituisce un array contenente solo gli ID di tutti i luoghi.
 * Utile per generateStaticParams in Next.js per pre-generare le pagine.
 */
export async function getAllLocationIds(): Promise<string[]> {
    const locations = await getAllLocations();
    return locations.map(location => location.id);
}


// --- La tua funzione per i tag (rimane invariata) ---
export async function getAllTags(): Promise<Record<string, Tag>> {
  const tagsPath = path.join(dataDirectory, 'tags.json');
  const fileContents = await fs.readFile(tagsPath, 'utf8');
  return JSON.parse(fileContents);
}