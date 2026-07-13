// app/api/tours/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Tour from '@/models/Tour';

// Default coordinates for fallback
const DEFAULT_COORDINATES = {
  lat: 9.145,
  lng: 40.489673,
  city: 'Addis Ababa',
  region: 'Ethiopia'
};

// UNESCO World Heritage sites in Ethiopia
const UNESCO_TOURS = [
  'Lalibela', 'Axum', 'Gondar', 'Simien Mountains', 
  'Omo Valley', 'Tiya', 'Harar', 'Fasil Ghebbi',
  'Rock-Hewn Churches', 'Konso', 'Lower Valley of the Omo'
];

/**
 * Recursively clean any MongoDB document to plain JSON-serializable object
 */
function cleanMongoDocument(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) return obj.toISOString();
  if (obj._bsontype === 'ObjectId' || (obj.toJSON && typeof obj.toJSON === 'function')) {
    return obj.toString();
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanMongoDocument(item));
  }
  if (typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        if (key === '__v' || key.startsWith('$')) continue;
        cleaned[key] = cleanMongoDocument(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
}

/**
 * Extract tour data for client components - price fetched directly from database
 */
function extractTourData(tour: any) {
  const cleaned = cleanMongoDocument(tour);
  
  const id = cleaned._id?.toString() || cleaned.id || `temp-${Date.now()}-${Math.random()}`;

  return {
    _id: id,
    id: cleaned.id || id,
    name: cleaned.name || '',
    slug: cleaned.slug || '',
    description: cleaned.description || '',
    images: Array.isArray(cleaned.images) ? cleaned.images.filter(Boolean) : [],
    duration: cleaned.duration || '',
    highlights: Array.isArray(cleaned.highlights) ? cleaned.highlights.filter(Boolean) : [],
    difficulty: cleaned.difficulty || 'Moderate',
    featured: !!cleaned.featured,
    rating: typeof cleaned.rating === 'number' ? cleaned.rating : 4.8,
    reviewCount: cleaned.reviewCount || 0,
    groupSize: cleaned.groupSize || '2-12 people',
    tag: cleaned.tag || '',
    coordinates: cleaned.coordinates ? {
      lat: typeof cleaned.coordinates.lat === 'number' ? cleaned.coordinates.lat : DEFAULT_COORDINATES.lat,
      lng: typeof cleaned.coordinates.lng === 'number' ? cleaned.coordinates.lng : DEFAULT_COORDINATES.lng,
      city: cleaned.coordinates.city || DEFAULT_COORDINATES.city,
      region: cleaned.coordinates.region || DEFAULT_COORDINATES.region,
    } : DEFAULT_COORDINATES,
    itinerary: Array.isArray(cleaned.itinerary) ? cleaned.itinerary.map((day: any) => ({
      day: day.day || 0,
      title: day.title || '',
      description: day.description || '',
      image: day.image || '',
    })) : [],
    inclusions: Array.isArray(cleaned.inclusions) ? cleaned.inclusions : [],
    exclusions: Array.isArray(cleaned.exclusions) ? cleaned.exclusions : [],
    faq: Array.isArray(cleaned.faq) ? cleaned.faq : [],
    bestTime: Array.isArray(cleaned.bestTime) ? cleaned.bestTime : [],
    season: cleaned.season || '',
    departurePoint: cleaned.departurePoint || '',
    languages: Array.isArray(cleaned.languages) ? cleaned.languages : [],
    category: cleaned.category || '',
    status: cleaned.status || 'active',
    bookingsCount: cleaned.bookingsCount || 0,
    type: cleaned.type,
    price: cleaned.price || 0, // Fetch price directly from database
    departureDates: Array.isArray(cleaned.departureDates) ? cleaned.departureDates : [],
    isUnesco: isUnescoTour(cleaned.name || '')
  };
}

function isUnescoTour(tourName: string): boolean {
  return UNESCO_TOURS.some(keyword => 
    tourName.toLowerCase().includes(keyword.toLowerCase())
  );
}

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    // Await params in Next.js 15+
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    
    console.log('Fetching tour with slug:', slug);
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Tour slug is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find tour by slug
    let tour = await Tour.findOne({ 
      slug: slug,
      status: 'active' 
    }).lean();

    // If not found by slug, try finding by ID
    if (!tour) {
      tour = await Tour.findOne({ 
        _id: slug,
        status: 'active' 
      }).lean();
    }

    // If still not found, try case-insensitive search
    if (!tour) {
      tour = await Tour.findOne({ 
        slug: { $regex: new RegExp(`^${slug}$`, 'i') },
        status: 'active' 
      }).lean();
    }

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

    const extractedTour = extractTourData(tour);

    return NextResponse.json({
      success: true,
      data: extractedTour
    });

  } catch (error: any) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}