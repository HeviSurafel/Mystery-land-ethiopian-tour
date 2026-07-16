// ==================== CORE BASE INTERFACES ====================

/**
 * Core interfaces that serve as building blocks for more complex types
 */

export interface BaseContent {
  id: string;
  name: string;
  description: string;
  slug: string;
}

export interface Metadata {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export interface ImageSet {
  images: string[];
}

export interface Coordinates {
  lat: number;
  lng: number;
  city?: string;
  region?: string;
}

// ==================== TOUR INTERFACES ====================

/**
 * Tour-related interfaces for itineraries, FAQs, and tour data
 */

export interface DayItinerary {
  day: number;
  title: string;
  description: string;
  activities: string[];
  accommodation: string;
  meals: string[];
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface Tour extends BaseContent, ImageSet {
  _id?: string;
  // Basic Information
  duration: string;
  highlights: string[];
  difficulty: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  groupSize: string;
  tag?: string;

  // Location
  coordinates: Coordinates;

  // Detailed Information
  itinerary: DayItinerary[];
  inclusions: string[];
  exclusions: string[];
  faq?: FAQItem[];

  // Practical Information
  bestTime?: string[];
  season?: string;
  departurePoint?: string;
  languages?: string[];

  // Dashboard Fields
  category?: string;
  status?: 'active' | 'inactive' | 'upcoming';
  bookingsCount?: number;
  type?: 'historical' | 'cultural' | 'nature' | 'adventure';
}

export interface TourCategory extends BaseContent {
  icon: string;
  tours: Tour[];
}

export interface ToursSection extends BaseContent, Metadata {
  categories: TourCategory[];
}

// ==================== FEATURED EXPERIENCES ====================

export interface FeaturedExperience extends BaseContent, ImageSet {
  type: string;
  category: string;
  duration: string;
  highlights: string[];
  rating: number;
  featured: boolean;
  coordinates: Coordinates;
}

export interface FeaturedSection extends BaseContent, Metadata {
  experiences: FeaturedExperience[];
}

// ==================== DESTINATION INTERFACES ====================

export interface Destination extends BaseContent, ImageSet {
  type: string;
  tag: string;
  highlights: string[];
  featured: boolean;
  coordinates: Coordinates;
  itinerary?: DayItinerary[];
  
  // Dashboard Fields
  region?: string;
  country?: string;
  attractions?: string[];
  bestTimeToVisit?: string[];
  averageStay?: string;
  popularTours?: number;
  rating?: number;
  status?: 'active' | 'inactive' | 'upcoming';
  imageCount?: number;
  tourCount?: number;
  _id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Region extends BaseContent {
  destinations: Destination[];
}

export interface DestinationsSection extends BaseContent, Metadata {
  regions: Region[];
}

export interface DestinationFilters {
  search?: string;
  type?: string;
  region?: string;
  status?: string;
  page?: number;
  limit?: number;
  tag?: string;
  featured?: boolean;
  [key: string]: any;
}

export interface DestinationsResponse {
  destinations: Destination[];
  totalPages: number;
  total: number;
  page?: number;
  limit?: number;
}

export interface ApiError {
  message: string;
  status?: number;
}

// ==================== FESTIVAL INTERFACES ====================

export interface Festival extends BaseContent, ImageSet {
  date: string;
  season: string;
  location: string;
  significance: string;
  highlights: string[];
  featured: boolean;
  coordinates: Coordinates;
  bestTimeToVisit?: string;
  culturalTips?: string[];
}

export interface FestivalsSection extends BaseContent, Metadata {
  festivals: Festival[];
}

// ==================== GALLERY INTERFACES ====================

export interface GalleryPhoto {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  tags: string[];
  location?: string;
  likes: number;
  views: number;
  featured: boolean;
  dateTaken?: string;
  tourId?: string;
  destinationId?: string;
  festivalId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryCollection extends BaseContent, ImageSet {
  photos: GalleryPhoto[];
  coverImage: string;
  photoCount: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface GalleryCategory extends BaseContent {
  collections: GalleryCollection[];
  featuredPhotos: GalleryPhoto[];
  icon?: string;
  color?: string;
  photoCount?: number;
  collectionCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface GallerySection extends BaseContent, Metadata {
  categories: GalleryCategory[];
  featuredCollections: GalleryCollection[];
  featuredPhotos: GalleryPhoto[];
  settings?: {
    itemsPerPage: number;
    enableLikes: boolean;
    enableViews: boolean;
    allowDownloads: boolean;
  };
}

export interface GalleryStats {
  totalPhotos: number;
  totalCollections: number;
  totalCategories: number;
  featuredPhotos: number;
  featuredCollections: number;
  totalViews: number;
  totalLikes: number;
  topCategories: Array<{
    id: string;
    name: string;
    slug: string;
    photoCount: number;
  }>;
  recentPhotos: Array<{
    id: string;
    title: string;
    imageUrl: string;
    category: string;
    views: number;
    likes: number;
    createdAt: string;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
}

export interface GalleryFilters {
  search?: string;
  category?: string;
  tag?: string;
  featured?: boolean;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'title' | 'createdAt' | 'views' | 'likes' | 'dateTaken';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface GalleryResponse {
  success: boolean;
  data: GalleryPhoto[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats?: GalleryStats;
  filters?: GalleryFilters;
}

export interface CollectionsResponse {
  success: boolean;
  data: GalleryCollection[];
  total: number;
}

// RENAMED: Was CategoriesResponse - now GalleryCategoriesResponse
export interface GalleryCategoriesResponse {
  success: boolean;
  data: GalleryCategory[];
  total: number;
}

// ==================== BLOG INTERFACES ====================

export interface BlogCategory extends BaseContent {
  featured: boolean;
  icon?: string;
  color?: string;
  parentCategory?: string;
  subCategories?: string[];
  articleCount?: number;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BlogTag {
  id: string;
  name: string;
  slug: string;
  articleCount?: number;
  createdAt?: string;
}

export interface BlogArticle extends BaseContent, ImageSet {
  // Core fields
  title: string;
  category: string | BlogCategory;
  tags: string[] | BlogTag[];
  author: string; // User ID or name
  
  // Content
  content: string;
  excerpt: string;
  readTime: string;
  featured: boolean;
  
  // Media
  coverImage: string;
  thumbnail?: string;
  
  // SEO & Metadata
  metaTitle?: string;
  metaDescription?: string;
  keywords?: string[];
  canonicalUrl?: string;
  
  // Engagement
  views: number;
  likes: number;
  shares: number;
  comments: number;
  
  // Status
  status: 'draft' | 'published' | 'archived' | 'scheduled';
  publishedAt?: string;
  scheduledAt?: string;
  
  // Related content
  relatedArticles?: string[];
  relatedTours?: string[];
  relatedDestinations?: string[];
  relatedFestivals?: string[];
  
  // Settings
  allowComments: boolean;
  isPremium: boolean;
  
  // Dashboard fields
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface BlogComment {
  id: string;
  articleId: string;
  author: {
    id?: string;
    name: string;
    email: string;
    avatar?: string;
  };
  content: string;
  likes: number;
  replies: BlogComment[];
  status: 'pending' | 'approved' | 'spam' | 'deleted';
  createdAt: string;
  updatedAt: string;
  parentId?: string;
}

export interface BlogStats {
  totalArticles: number;
  publishedArticles: number;
  draftArticles: number;
  scheduledArticles: number;
  archivedArticles: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  categoriesCount: number;
  tagsCount: number;
  topCategories: Array<{
    id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  topTags: Array<{
    id: string;
    name: string;
    slug: string;
    count: number;
  }>;
  recentArticles: Array<{
    id: string;
    title: string;
    slug: string;
    status: string;
    publishedAt?: string;
    views: number;
  }>;
  viewsOverTime: Array<{
    date: string;
    views: number;
  }>;
}

export interface BlogFilters {
  search?: string;
  category?: string;
  tag?: string;
  author?: string;
  status?: 'draft' | 'published' | 'archived' | 'scheduled' | 'all';
  featured?: boolean;
  fromDate?: string;
  toDate?: string;
  sortBy?: 'title' | 'createdAt' | 'publishedAt' | 'views' | 'likes' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface BlogResponse {
  success: boolean;
  data: BlogArticle[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  stats?: BlogStats;
  filters?: BlogFilters;
}

// RENAMED: Was CategoriesResponse - now BlogCategoriesResponse
export interface BlogCategoriesResponse {
  success: boolean;
  data: BlogCategory[];
  total: number;
}

export interface TagsResponse {
  success: boolean;
  data: BlogTag[];
  total: number;
}

// ==================== TRAVEL INFO INTERFACES ====================

export interface ContentItem {
  title: string;
  description: string;
}

export interface TravelInfoSection extends BaseContent {
  content: ContentItem[];
}

export interface TravelInfoSectionData extends BaseContent, Metadata {
  sections: TravelInfoSection[];
}

// ==================== CONTACT INTERFACES ====================

export interface ContactInfo {
  phone: string;
  email: string;
  address: string;
  hours: string;
  emergency: string;
}

export interface Department {
  name: string;
  email: string;
  description: string;
}

export interface ContactSection extends BaseContent, Metadata {
  info: ContactInfo;
  departments: Department[];
}

// ==================== DASHBOARD INTERFACES ====================

/**
 * Dashboard, booking, client, and admin panel interfaces
 */

export interface DashboardStats {
  totalBookings: number;
  activeClients: number;
  pendingBookings: number;
  monthlyGrowth?: number;
}

export interface Booking {
  id: string;
  _id: string;
  bookingId: string;
  bookingNumber?: string;
  client: {
    _id?: string;
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  tour: {
    _id?: string;
    id: string;
    name: string;
    type: string;
  };
  destination?: {
    _id: string;
    name: string;
    images?: string[];
  };
  date: string;
  travelDate?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  paymentStatus: 'paid' | 'pending' | 'failed';
  createdAt: string;
  updatedAt: string;
  participants: number;
  numberOfPeople?: number;
  notes?: string;
  specialRequests?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  country?: string;
  bookingsCount: number;
  totalSpent: number;
  lastBooking?: string;
  status: 'active' | 'inactive';
  avatar?: string;
  createdAt: string;
}

export interface RevenueData {
  month: string;
  revenue: number;
  bookings: number;
  averageTicket: number;
}

export interface DashboardProps {
  userType: 'admin' | 'user';
  stats?: DashboardStats;
  recentBookings?: Booking[];
  clients?: Client[];
  tours?: Tour[];
  revenueData?: RevenueData[];
}

// ==================== TOUR STATISTICS INTERFACES ====================

export interface TourStats {
  // Overview counts
  total: number;
  active: number;
  inactive: number;
  upcoming: number;
  featured: number;
  
  // Performance metrics
  avgRating: number;
  totalBookings: number;
  // Distributions
  categoryDistribution: Record<string, number>;
  statusDistribution: Record<string, number>;
  durationDistribution?: Record<string, number>;
  
  // Recent activity
  recentTours?: Array<{
    id: string;
    _id?: string;
    name: string;
    category: string;
    rating: number;
    slug: string;
    createdAt?: string;
    images?: string[];
  }>;
  
  // Trends
  monthlyTrends?: Array<{
    month: string;
    count: number;
    bookings: number;
    revenue?: number;
  }>;
  
  // Metadata
  metadata?: {
    timestamp: string;
    timezone?: string;
    cached?: boolean;
  };
}

// ==================== DESTINATION STATISTICS INTERFACES ====================

export interface DestinationStats {
  total: number;
  active: number;
  featured: number;
  unesco: number;
  totalTours: number;
  totalImages: number;
  avgRating: number;
  regionDistribution: Record<string, number>;
  typeDistribution: Record<string, number>;
}

// ==================== FORM DATA INTERFACES ====================

export interface BookingFormData {
  clientId: string;
  tourId: string;
  date: Date;
  participants: number;
  specialRequests?: string;
  paymentMethod: string;
}

export interface TourFormData {
  // Basic Information
  name: string;
  description: string;
  slug: string;
  images: string[];
  tag?: string;
  
  // Details
  duration: string;
  highlights: string[];
  difficulty: string;
  featured: boolean;
  rating: number;
  reviewCount: number;
  groupSize: string;
  category: string;
  status?: 'active' | 'inactive' | 'upcoming';
  bookingsCount?: number;
  
  // Location
  coordinates: {
    lat: number;
    lng: number;
    city: string;
    region: string;
  };
  departurePoint: string;
  
  // Itinerary
  itinerary: DayItinerary[];
  
  // Inclusions/Exclusions
  inclusions: string[];
  exclusions: string[];
  
  // FAQ
  faq: FAQItem[];
  
  // Practical Information
  bestTime: string[];
  season: string;
  languages: string[];
}

export interface DestinationFormData {
  id?: string;
  name: string;
  description: string;
  slug: string;
  images: string[];
  type: string;
  tag: string;
  highlights: string[];
  featured: boolean;
  coordinates: {
    lat: number;
    lng: number;
    city?: string;
    region?: string;
  };
  itinerary?: DayItinerary[];
  region?: string;
  country?: string;
  attractions?: string[];
  bestTimeToVisit?: string[];
  averageStay?: string;
  popularTours?: number;
  rating?: number;
  status?: 'active' | 'inactive' | 'upcoming';
  imageCount?: number;
  tourCount?: number;
}

// ==================== FILTER INTERFACES ====================

export interface FilterOptions {
  dateRange?: {
    start: Date;
    end: Date;
  };
  status?: string[];
  category?: string[];
  search?: string;
}

export interface TourFilters {
  category?: string;
  difficulty?: string[];
  duration?: string;
  bestTime?: string;
}

// ==================== OFFER INTERFACES ====================

export interface Offer {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  discount: string;
  validFrom: string;
  validUntil: string;
  terms: string[];
  featured: boolean;
  category: 'early-bird' | 'group' | 'seasonal' | 'last-minute' | 'family';
  tourIds?: string[];
  destinationIds?: string[];
  minParticipants?: number;
  maxParticipants?: number;
  bookingDeadline?: string;
  highlights?: string[];
  inclusions?: string[];
  code?: string;
  discountType?: 'percentage' | 'fixed' | 'bogo' | 'special';
  discountValue?: number;
  maxUsage?: number;
  usageCount?: number;
  status?: 'active' | 'inactive' | 'expired';
  createdAt?: string;
  updatedAt?: string;
}

// ==================== EXPERIENCE INTERFACES ====================

export interface Experience {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: string[];
  duration: string;
  location: string;
  highlights: string[];
  included: string[];
  notIncluded?: string[];
  bestTimeToVisit: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  category: 'tribal' | 'coffee' | 'festivals' | 'food' | 'hiking' | 'birding' | 'photography' | 'wellness';
  featured: boolean;
  rating: number;
  reviewCount: number;
  coordinates: {
    lat: number;
    lng: number;
    city?: string;
    region?: string;
  };
  languages?: string[];
  groupSize?: string;
  ageRange?: string;
  whatToBring?: string[];
  meetingPoint?: string;
  startTimes?: string[];
  culturalSignificance?: string;
  seasonalAvailability?: string;
}

// ==================== SEARCH INTERFACES ====================

export type SearchResultType =
  | "tour"
  | "destination"
  | "travel-info"
  | "blog"
  | "featured"
  | "category"
  | "region"
  | "festival";

export interface SlugItem {
  slug: string;
  type: SearchResultType;
}

export type SearchResult =
  | (Tour & { resultType: "tour" })
  | (Destination & { resultType: "destination" })
  | (FeaturedExperience & { resultType: "featured" })
  | (BlogArticle & { resultType: "blog" })
  | (Festival & { resultType: "festival" })
  | (TravelInfoSection & { resultType: "travel-info" });

// ==================== STATISTICS INTERFACES ====================

export interface Statistics {
  tours: {
    total: number;
    featured: number;
    categories: number;
    averageRating: number;
    totalReviews: number;
  };
  destinations: {
    total: number;
    featured: number;
    regions: number;
  };
  festivals: {
    total: number;
    featured: number;
  };
}

// ==================== WISHLIST INTERFACES ====================

export interface WishlistItem {
  id: string;
  itemId: string;
  itemType: 'tour' | 'destination' | 'festival';
  name: string;
  slug: string;
  description: string;
  image?: string;
  duration?: string;
  location?: string;
  date?: string;
  rating?: number;
  addedAt: string;
  notes?: string;
}

export interface Wishlist {
  items: WishlistItem[];
  totalItems: number;
  lastUpdated: string;
}

// ==================== DATA STRUCTURES ====================

export const offersData: Offer[] = [
  // ... your offers data
];

export const experiencesData: Experience[] = [
  // ... your experiences data
];

export interface AppData {
  featured: FeaturedSection;
  tours: ToursSection;
  destinations: DestinationsSection;
  festivals: FestivalsSection;
}

// ==================== HELPER FUNCTIONS TYPES ====================

export const getOffersByCategory = (category: string): Offer[] => {
  return offersData.filter(offer => offer.category === category);
};

export const getFeaturedOffers = (): Offer[] => {
  return offersData.filter(offer => offer.featured);
};

export const getOfferBySlug = (slug: string): Offer | undefined => {
  return offersData.find(offer => offer.slug === slug);
};

export interface DataHelpers {
  // Gallery functions
  getAllGalleryPhotos: () => GalleryPhoto[];
  getGalleryData: () => GallerySection;
  getGalleryPhotosByCategory: (categorySlug: string) => GalleryPhoto[];
  getGalleryCollectionBySlug: (slug: string) => GalleryCollection | undefined;
  getGalleryCategoryBySlug: (slug: string) => GalleryCategory | undefined;
  getFeaturedGalleryPhotos: () => GalleryPhoto[];
  getGalleryPhotosByTourId: (tourId: string) => GalleryPhoto[];
  getGalleryPhotosByDestinationId: (destinationId: string) => GalleryPhoto[];
  getGalleryPhotosByFestivalId: (festivalId: string) => GalleryPhoto[];
  getAllGalleryCollections: () => GalleryCollection[];
  getAllGalleryCategories: () => GalleryCategory[];

  // Tour functions
  getAllTours: () => Tour[];
  getTourById: (id: string) => Tour | undefined;
  getFeaturedTours: () => Tour[];
  getToursByCategory: (categoryId: string) => Tour[];
  getToursByDuration: (minDays: number, maxDays: number) => Tour[];
  getToursByCoordinates: (lat: number, lng: number, radiusKm?: number) => Tour[];
  getToursByRegion: (region: string) => Tour[];
  getToursNearDestination: (destinationId: string, radiusKm?: number) => Tour[];
  getTourCategoryByTourId: (tourId: string) => TourCategory | undefined;
  filterTours: (filters: TourFilters) => Tour[];

  // Destination functions
  getAllDestinations: () => Destination[];
  getDestinationById: (id: string) => Destination | undefined;
  getFeaturedDestinations: () => Destination[];
  getAllRegions: () => Region[];
  getRegionById: (id: string) => Region | undefined;
  getRegionBySlug: (slug: string) => Region | undefined;
  getDestinationsByRegionId: (regionId: string) => Destination[];
  getDestinationsByRegionSlug: (regionSlug: string) => Destination[];

  // Festival functions
  getAllFestivals: () => Festival[];
  getFestivalById: (id: string) => Festival | undefined;
  getFestivalBySlug: (slug: string) => Festival | undefined;
  getFeaturedFestivals: () => Festival[];
  getFestivalsBySeason: (season: string) => Festival[];
  getFestivalsByLocation: (location: string) => Festival[];
  getUpcomingFestivals: () => Festival[];

  // Blog functions
  getAllBlogArticles: () => BlogArticle[];
  getBlogArticleBySlug: (slug: string) => BlogArticle | undefined;
  getFeaturedBlogArticles: () => BlogArticle[];
  getBlogArticlesByCategory: (categoryName: string) => BlogArticle[];

  // Special offer functions
  getOffersByCategory: (category: string) => Offer[];
  getFeaturedOffers: () => Offer[];
  getOfferBySlug: (slug: string) => Offer | undefined;

  // Experience functions
  getAllExperiences: () => Experience[];
  getExperienceBySlug: (slug: string) => Experience | undefined;
  getFeaturedExperiences: () => Experience[];
  getExperiencesByCategory: (category: string) => Experience[];

  // Search functions
  searchAllContent: (query: string) => SearchResult[];
  getContentBySlug: (slug: string) => SearchResult | null;
  getAllSlugs: () => SlugItem[];

  // Statistics
  getStatistics: () => Statistics;
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Calculate distance between two coordinates in kilometers
 */
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// ==================== DEFAULT EXPORT ====================

export default {
  calculateDistance,
};