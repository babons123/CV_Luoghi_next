/**
 * Formatta una data nel formato italiano
 */
export function formatDataItaliana(dataString: string): string {
  try {
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return dataString;
  }
}

/**
 * Formatta una data nel formato compatto
 */
export function formatDataCompatta(dataString: string): string {
  try {
    const data = new Date(dataString);
    return data.toLocaleDateString('it-IT', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (error) {
    return dataString;
  }
}

/**
 * Genera uno slug da una stringa
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // rimuove accenti
    .replace(/[^a-z0-9\s-]/g, '') // rimuove caratteri speciali
    .trim()
    .replace(/\s+/g, '-') // sostituisce spazi con trattini
    .replace(/-+/g, '-'); // rimuove trattini multipli
}

/**
 * Capitalizza la prima lettera di una stringa
 */
export function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
}

/**
 * Capitalizza ogni parola in una stringa
 */
export function capitalizeWords(text: string): string {
  return text
    .split(' ')
    .map(word => capitalize(word))
    .join(' ');
}

/**
 * Tronca un testo alla lunghezza specificata
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

/**
 * Calcola i giorni trascorsi da una data
 */
export function calcolaGiorniTrascorsi(dataString: string): number {
  try {
    const dataVisita = new Date(dataString);
    const oggi = new Date();
    const differenza = oggi.getTime() - dataVisita.getTime();
    return Math.floor(differenza / (1000 * 3600 * 24));
  } catch (error) {
    return 0;
  }
}

/**
 * Raggruppa elementi per una proprietà specifica
 */
export function groupBy<T, K extends keyof T>(array: T[], key: K): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

/**
 * Controlla se una stringa è un URL valido
 */
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Genera un colore basato su una stringa (per categorie)
 */
export function getColorFromString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 60%)`;
}

/**
 * Converte coordinate in stringa per URL Google Maps
 */
export function getGoogleMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Calcola la distanza tra due punti geografici (formula Haversine)
 */
export function calcolaDistanza(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Raggio della Terra in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(value: number): number {
  return value * Math.PI / 180;
}