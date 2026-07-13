//app/api/destinations/featured/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Destination from '@/models/Destination';

// Default coordinates for fallback
const DEFAULT_COORDINATES = {
  lat: 9.145,
  lng: 40.489673,
  city: 'Addis Ababa',
  region: 'Ethiopia'
};

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
 * Extract destination data for client components
 */
function extractDestinationData(dest: any) {
  const cleaned = cleanMongoDocument(dest);
  
  const id = cleaned._id?.toString() || cleaned.id || `temp-${Date.now()}-${Math.random()}`;

  return {
    id,
    _id: id,
    name: cleaned.name || '',
    slug: cleaned.slug || '',
    description: cleaned.description || '',
    images: Array.isArray(cleaned.images) ? cleaned.images.filter(Boolean) : [],
    type: cleaned.type || 'cultural',
    tag: cleaned.tag || '',
    highlights: Array.isArray(cleaned.highlights) ? cleaned.highlights.filter(Boolean) : [],
    featured: !!cleaned.featured,
    coordinates: cleaned.coordinates ? {
      lat: typeof cleaned.coordinates.lat === 'number' ? cleaned.coordinates.lat : DEFAULT_COORDINATES.lat,
      lng: typeof cleaned.coordinates.lng === 'number' ? cleaned.coordinates.lng : DEFAULT_COORDINATES.lng,
      city: cleaned.coordinates.city || DEFAULT_COORDINATES.city,
      region: cleaned.coordinates.region || DEFAULT_COORDINATES.region,
    } : DEFAULT_COORDINATES,
    region: cleaned.region || cleaned.coordinates?.region || 'Omo Valley',
    country: cleaned.country || 'Ethiopia',
    attractions: Array.isArray(cleaned.attractions) ? cleaned.attractions : [],
    bestTimeToVisit: Array.isArray(cleaned.bestTimeToVisit) ? cleaned.bestTimeToVisit : ['Year Round'],
    averageStay: cleaned.averageStay || '2-3 days',
    popularTours: cleaned.popularTours || 0,
    tourCount: cleaned.tourCount || Math.floor(Math.random() * 20) + 5, // Random for demo
    rating: typeof cleaned.rating === 'number' ? cleaned.rating : 4.8,
    status: cleaned.status || 'active',
    imageCount: cleaned.imageCount || cleaned.images?.length || 0,
    reviewCount: cleaned.reviewCount || 0,
    keywords: cleaned.keywords || [],
    createdAt: cleaned.createdAt,
    updatedAt: cleaned.updatedAt
  };
}

// Southern Ethiopia specific destinations
const SOUTHERN_ETHIOPIA_REGIONS = [
  'Omo Valley',
  'Southern Nations',
  'Arba Minch',
  'Jinka',
  'Turmi',
  'Konso',
  'Mago National Park',
  'Nech Sar National Park'
];

function isSouthernEthiopia(destination: any): boolean {
  const region = destination.region || destination.coordinates?.region || '';
  const name = destination.name || '';
  
  return SOUTHERN_ETHIOPIA_REGIONS.some(keyword => 
    region.toLowerCase().includes(keyword.toLowerCase()) ||
    name.toLowerCase().includes(keyword.toLowerCase())
  );
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '8');
    const region = searchParams.get('region');
    
    // Build filter
    const filter: any = { status: 'active' };
    
    // Filter by region if specified
    if (region && region !== 'all') {
      filter.$or = [
        { region },
        { 'coordinates.region': region }
      ];
    }
    
    // Get all active destinations
    let destinations = await Destination.find(filter)
      .sort({ featured: -1, rating: -1 })
      .limit(50)
      .lean();
    
    // Filter for Southern Ethiopia if no specific region
    if (!region || region === 'all') {
      destinations = destinations.filter(isSouthernEthiopia);
    }
    
    // Limit the results
    destinations = destinations.slice(0, limit);
    
    // If no destinations found, create some demo data based on your static list
    if (destinations.length === 0) {
      // Return empty array - you can add fallback data here if needed
      return NextResponse.json({
        success: true,
        data: []
      });
    }
    
    const extractedDestinations = destinations.map(extractDestinationData);

    return NextResponse.json({
      success: true,
      data: extractedDestinations
    });

  } catch (error: any) {
    console.error('Error fetching featured destinations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}