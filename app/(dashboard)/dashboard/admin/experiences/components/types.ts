import { Experience } from "@/app/types/types";


export interface Coordinates {
  lat: number | string;
  lng: number | string;
  city?: string;
  region?: string;
}

export interface ExperienceFormData {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  category: 'tribal' | 'coffee' | 'festivals' | 'food' | 'hiking' | 'birding' | 'photography' | 'wellness';
  duration: string;
  location: string;
  groupSize: string;
  languages: string[];
  highlights: string[];
  included: string[];
  notIncluded?: string[];
  whatToBring?: string[];
  bestTimeToVisit: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  coordinates: Coordinates;
  images: string[];
  featured: boolean;
  status?: 'active' | 'inactive' | 'upcoming';
  meetingPoint?: string;
  ageRange?: string;
  culturalSignificance?: string;
  seasonalAvailability?: string;
  startTimes?: string[];
  rating?: number;
  reviewCount?: number;
}

export interface ApiExperience extends Experience {
  _id: string;
  id: string;
  bookings?: number;
  revenue?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface Filters {
  search: string;
  category: string;
  status: string;
  page: number;
  limit: number;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'create' | 'edit';
  experience: ApiExperience | null;
}

export const CATEGORIES = [
  { value: "tribal", label: "Tribal", icon: "👥" },
  { value: "coffee", label: "Coffee", icon: "☕" },
  { value: "festivals", label: "Festivals", icon: "🎉" },
  { value: "food", label: "Food", icon: "🍽️" },
  { value: "hiking", label: "Hiking", icon: "🥾" },
  { value: "birding", label: "Birding", icon: "🦅" },
  { value: "photography", label: "Photography", icon: "📸" },
  { value: "wellness", label: "Wellness", icon: "🧘" }
];

export const DIFFICULTIES = ["Easy", "Moderate", "Challenging"];

export const STATUSES = [
  { value: "all", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "upcoming", label: "Upcoming" }
];

export const INITIAL_FORM_DATA: ExperienceFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  description: "",
  category: "tribal",
  duration: "",
  location: "",
  groupSize: "",
  languages: [],
  highlights: [],
  included: [],
  notIncluded: [],
  whatToBring: [],
  bestTimeToVisit: "",
  difficulty: "Easy",
  coordinates: {
    lat: "",
    lng: "",
    city: "",
    region: ""
  },
  images: [],
  featured: false,
  status: "active",
  meetingPoint: "",
  ageRange: "",
  culturalSignificance: "",
  seasonalAvailability: "",
  startTimes: [],
  rating: 0,
  reviewCount: 0
};