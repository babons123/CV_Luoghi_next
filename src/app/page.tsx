// src/app/page.tsx
// NESSUNA direttiva 'use client' qui! Questo è un Server Component.

import { getAllLocations, getAllTags } from '@/lib/data'; // <-- Può importare 'fs' perché è sul server
import HomePageClient from './HomePageClient'; // <-- Importa il componente client

export default async function HomePage() {
  // 1. Carica i dati sul server
  const initialLocations = await getAllLocations();
  const allTags = await getAllTags();

  // 2. Passa i dati come props al componente client
  return (
    <main>
      <HomePageClient initialLocations={initialLocations} allTags={allTags} />
    </main>
  );
}