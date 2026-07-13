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
  if (!dest) {
    return null;
  }
  
  const cleaned = cleanMongoDocument(dest);
  
  const id = cleaned._id?.toString() || cleaned.id || `temp-${Date.now()}-${Math.random()}`;

  return {
    id,
    _id: id,
    name: cleaned.name || '',
    slug: cleaned.slug || '',
    description: cleaned.description || '',
    shortDescription: cleaned.shortDescription || '',
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
    region: cleaned.region || cleaned.coordinates?.region || 'Ethiopia',
    country: cleaned.country || 'Ethiopia',
    attractions: Array.isArray(cleaned.attractions) ? cleaned.attractions : [],
    bestTimeToVisit: Array.isArray(cleaned.bestTimeToVisit) ? cleaned.bestTimeToVisit : [],
    bestTime: Array.isArray(cleaned.bestTime) ? cleaned.bestTime : [],
    averageStay: cleaned.averageStay || '2-3 days',
    popularTours: cleaned.popularTours || 0,
    tourCount: cleaned.tourCount || 0,
    rating: typeof cleaned.rating === 'number' ? cleaned.rating : 0,
    status: cleaned.status || 'active',
    imageCount: cleaned.imageCount || cleaned.images?.length || 0,
    reviewCount: cleaned.reviewCount || 0,
    keywords: cleaned.keywords || [],
    itinerary: Array.isArray(cleaned.itinerary) ? cleaned.itinerary.map((day: any) => ({
      day: day.day || 0,
      title: day.title || '',
      description: day.description || '',
      activities: day.activities || [],
      accommodation: day.accommodation || '',
      meals: day.meals || [],
    })) : [],
    unesco: !!cleaned.unesco,
    isUnesco: !!cleaned.unesco,
    createdAt: cleaned.createdAt,
    updatedAt: cleaned.updatedAt
  };
}

// GET - Fetch a single destination by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // Await the params Promise to access its properties
    const { slug } = await params;

    console.log('Fetching destination with slug:', slug);

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Destination slug is required' },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // First try to find by exact slug match
    let destination = await Destination.findOne({ 
      slug: slug,
      status: 'active' 
    });

    // If not found, try case-insensitive search
    if (!destination) {
      console.log('No exact match found, trying case-insensitive search...');
      destination = await Destination.findOne({ 
        slug: { $regex: new RegExp(`^${slug}$`, 'i') },
        status: 'active' 
      });
    }

    // If still not found, try to find by partial slug match
    if (!destination) {
      console.log('No case-insensitive match found, trying partial match...');
      const allDestinations = await Destination.find({ status: 'active' });
      
      // Find destination where slug is contained in the searched slug or vice versa
      destination = allDestinations.find(d => 
        d.slug?.includes(slug) || slug.includes(d.slug)
      );
      
      if (destination) {
        console.log('Found partial match:', destination.slug);
      }
    }

    if (!destination) {
      console.log('Destination not found for slug:', slug);
      
      // Return a proper 404 with all available slugs for debugging
      const allSlugs = await Destination.find({ status: 'active' }).select('slug name');
      
      return NextResponse.json(
        { 
          success: false, 
          error: 'Destination not found',
          availableSlugs: allSlugs.map(d => ({ slug: d.slug, name: d.name })),
          requestedSlug: slug
        },
        { status: 404 }
      );
    }

    // Extract and return destination data
    const extractedData = extractDestinationData(destination);

    if (!extractedData) {
      return NextResponse.json(
        { success: false, error: 'Failed to extract destination data' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: extractedData
    });

  } catch (error: any) {
    console.error('Error fetching destination:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}