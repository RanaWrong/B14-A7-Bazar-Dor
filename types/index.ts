export interface PriceChange {
  dir: "up" | "down" | "flat";
  pct: number;
}

export interface MarketItem {
  market: string;
  division: string;
  min: number;
  max: number;
  avg?: number;
}

export interface Product {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: PriceChange;
  markets: MarketItem[];
}

export interface Category {
  id: string;
  slug: string;
  nameBn: string;
  icon: string;
}

export type SortOption = "default" | "price-asc" | "price-desc";

export interface UserSession {
  user: {
    id: string;
    name: string;
    email: string;
    image?: string | null;
  } | null;
}
