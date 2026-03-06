// types/dashboard.ts

export interface BTCData {
  price: number;
  marketCap: number;
  volume24h: number;
  change24h: number;
}

export interface GlobalData {
  btcDominance: number;
}

export interface FearGreed {
  value: number;
  classification: string;
}

export interface FredObservation {
  date: string;
  value: number;
}

export interface FredData {
  sofr: FredObservation[];
  iorb: FredObservation[];
  effr: FredObservation[];
  dgs10: FredObservation[];
  dxy: FredObservation[];
}
