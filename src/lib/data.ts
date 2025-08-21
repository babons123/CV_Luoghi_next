// src/lib/data.ts
import fs from 'fs/promises';
import path from 'path';
import { Location, Tag } from '@/types/luogo';

const dataDirectory = path.join(process.cwd(), 'data');

export async function getAllLocations(): Promise<Location[]> {
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

  // Ordina per data di visita decrescente di default
  return allLocations.sort((a, b) => new Date(b.visitDate).getTime() - new Date(a.visitDate).getTime());
}

export async function getAllTags(): Promise<Record<string, Tag>> {
  const tagsPath = path.join(dataDirectory, 'tags.json');
  const fileContents = await fs.readFile(tagsPath, 'utf8');
  return JSON.parse(fileContents);
}