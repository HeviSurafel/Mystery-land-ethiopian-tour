// app/api/destinations/route.ts
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
    tourCount: cleaned.tourCount || Math.floor(Math.random() * 20) + 5,
    rating: typeof cleaned.rating === 'number' ? cleaned.rating : 4.8,
    status: cleaned.status || 'active',
    imageCount: cleaned.imageCount || cleaned.images?.length || 0,
    reviewCount: cleaned.reviewCount || 0,
    keywords: cleaned.keywords || [],
    createdAt: cleaned.createdAt,
    updatedAt: cleaned.updatedAt
  };
}

// GET - Fetch destinations with filtering and pagination
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const region = searchParams.get('region');
    const type = searchParams.get('type');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'rating';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter
    const filter: any = { status: 'active' };
    
    // Filter by region
    if (region && region !== 'all') {
      filter.$or = [
        { region: { $regex: region, $options: 'i' } },
        { 'coordinates.region': { $regex: region, $options: 'i' } }
      ];
    }
    
    // Filter by type
    if (type && type !== 'all') {
      filter.type = type;
    }
    
    // Filter by featured
    if (featured === 'true') {
      filter.featured = true;
    }
    
    // Search by name or description
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'coordinates.city': { $regex: search, $options: 'i' } }
      ];
    }
    
    // Build sort
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Get total count for pagination
    const total = await Destination.countDocuments(filter);
    
    // Get destinations
    let destinations = await Destination.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
    
    const extractedDestinations = destinations.map(extractDestinationData);

    return NextResponse.json({
      success: true,
      data: extractedDestinations,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    });

  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

// POST - Create a new destination
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    
    // Validate required fields
    const requiredFields = ['name', 'description', 'type'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }
    
    // Generate slug from name if not provided
    if (!body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    // Check if destination with same slug exists
    const existing = await Destination.findOne({ slug: body.slug });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Destination with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Set default values
    if (!body.status) body.status = 'active';
    if (!body.country) body.country = 'Ethiopia';
    if (!body.rating) body.rating = 0;
    if (!body.reviewCount) body.reviewCount = 0;
    
    // Create destination
    const destination = await Destination.create(body);
    
    return NextResponse.json({
      success: true,
      data: extractDestinationData(destination),
      message: 'Destination created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating destination:', error);
    
    // Handle duplicate key error
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Destination with this name or slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create destination' },
      { status: 500 }
    );
  }
}

// PUT - Update a destination
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Destination ID is required' },
        { status: 400 }
      );
    }
    
    const body = await req.json();
    
    // Generate slug from name if name changed and slug not provided
    if (body.name && !body.slug) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    
    // Find and update destination
    const destination = await Destination.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: extractDestinationData(destination),
      message: 'Destination updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating destination:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Destination with this name or slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update destination' },
      { status: 500 }
    );
  }
}

// DELETE - Delete a destination
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Destination ID is required' },
        { status: 400 }
      );
    }
    
    const destination = await Destination.findByIdAndDelete(id);
    
    if (!destination) {
      return NextResponse.json(
        { success: false, error: 'Destination not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting destination:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete destination' },
      { status: 500 }
    );
  }
}