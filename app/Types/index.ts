// Types/index.ts or Types.ts

export interface Tour {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  duration: string;
  images: string[];
  coordinates?: {
    lat: number;
    lng: number;
    city: string;
    region: string;
    _id?: string;
  };
  groupSize?: string;
  difficulty: string;
  rating: number;
  reviewCount: number;
  featured: boolean;
  tag?: string;
  highlights: string[];
  category: string;
  bestTime: string[];
  price: number; // ✅ Price field
  status: string;
  departureDates?: string[];
  isUnesco?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ToursResponse {
  success: boolean;
  data: Tour[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasMore: boolean;
    hasPrev: boolean;
  };
  filters: {
    category: string | null;
    difficulty: string | null;
    duration: string | null;
    minRating: string | null;
    destination: string | null;
    search: string | null;
    featured: string | null;
  };
}