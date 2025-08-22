// src/types/luogo.d.ts

export interface Tag {
  id: string;
  name: string;
  category: 'geographic' | 'certification' | 'thematic' | 'experience' | 'accessibility';
  color: string;
  backgroundColor: string;
  officialLogo?: string;
  logoAlt?: string;
  website?: string;
  prestige?: number;
}
export interface EatenFoodItem {
  name: string;
  // quantity?: string;
  // description?: string;
  subItems?: EatenFoodItem[];
}

export interface MountainFeature {
  name: string;
  altitude?: number; // Altitudine della cima o del passo, in metri
  subFeatures?: MountainFeature[]; // Nidificazione (per esempio, un passo che ha più punti rilevanti)
}

export interface Location {
  id: string;
  name: string;
  description: string;
  category: string;
  coordinates: [number, number]; // [latitude, longitude]
  visitDate: string; // ISO format: "YYYY-MM-DD"
  
  // Campi geografici obbligatori
  country: string;
  region: string;
  province: string;
  
  // Campi opzionali
  address?: string;
  municipality?: string;
  photos?: string[];
  tags?: string[];
  rating?: number;
  notes?: string;
  website?: string;
  ticketPrice?: number;
  duration?: string;
  
  // Campi specifici per categoria (esempio)
  // Castelli
  epoca?: string;
  stato?: 'rovine' | 'restaurato' | 'abitato';
  // Ristoranti
  cucina?: string;
  prezzo?: '€' | '€€' | '€€€';
  eatenFoods?: EatenFoodItem[];

  // NUOVO: Campo altitudine per Montagne, Rifugi, Bivacchi
  altitude?: number; // Altitudine in metri

  // NUOVO: Campo per le caratteristiche specifiche di una montagna (cime secondarie, passi)
  mountainFeatures?: MountainFeature[];

  // Aggiunto per compatibilità con il tuo LocationCard
  drivePhotosUrl?: string;
}

// Stato dei filtri
export interface FilterState {
  search: string;
  categories: string[];
  regions: string[];
  provinces: string[];
  tags: string[];
  rating: number;
  dateFrom: string;
  dateTo: string;
}