// app/api/tours/featured/route.ts
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
    itinerary: Array.isArray(cleaned.itinerary) ? cleaned.itinerary : [],
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

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const unescoOnly = searchParams.get('unesco') === 'true';
    const limit = parseInt(searchParams.get('limit') || '12');
    
    // Get all active tours - explicitly select price field
    let tours = await Tour.find({ status: 'active' })
      .select('name slug description images duration highlights difficulty featured rating reviewCount groupSize tag coordinates itinerary inclusions exclusions faq bestTime season departurePoint languages category status bookingsCount type price departureDates')
      .sort({ rating: -1, bookingsCount: -1 })
      .limit(limit)
      .lean();
    
    // Filter for UNESCO tours if requested
    if (unescoOnly) {
      tours = tours.filter(tour => isUnescoTour(tour.name));
    }
    
    // If no tours found or not enough, get top-rated tours
    if (tours.length === 0) {
      tours = await Tour.find({ status: 'active' })
        .select('name slug description images duration highlights difficulty featured rating reviewCount groupSize tag coordinates itinerary inclusions exclusions faq bestTime season departurePoint languages category status bookingsCount type price departureDates')
        .sort({ rating: -1, bookingsCount: -1 })
        .limit(6)
        .lean();
    }
    
    const extractedTours = tours.map(extractTourData);

    return NextResponse.json({
      success: true,
      data: extractedTours
    });

  } catch (error: any) {
    console.error('Error fetching featured tours:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}