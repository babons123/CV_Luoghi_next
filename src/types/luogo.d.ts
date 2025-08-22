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
  subItems?: EatenFoodItem[]; // Permette di avere sotto-liste ricorsive
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
  tags?: string[]; // Array di ID di Tag
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
  eatenFoods?: EatenFoodItem[]; // Array di oggetti EatenFoodItem, che supportano la nidificazione

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