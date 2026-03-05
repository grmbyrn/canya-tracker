export interface PriceEntry {
  price: number;
  timestamp: string; // ISO
  source?: string;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Bar {
  id: string;
  name: string;
  location?: Location;
  latestPrice?: number;
  prices?: PriceEntry[];
  terrace?: boolean;
}
