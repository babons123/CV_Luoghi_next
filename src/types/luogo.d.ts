export interface Coordinate {
  lat: number;
  lng: number;
}

export interface Luogo {
  id: number;
  categoria: string;
  nome: string;
  data_visita: string; // YYYY-MM-DD format
  descrizione: string;
  indirizzo: string;
  commento: string;
  tags: string[];
  coordinate: Coordinate;
}

export interface CategoriaInfo {
  nome: string;
  descrizione: string;
  icona?: string;
  colore?: string;
}

export type FilterOptions = {
  categoria?: string;
  tags?: string[];
  dataInizio?: string;
  dataFine?: string;
};