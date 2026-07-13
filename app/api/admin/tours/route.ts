// app/api/admin/tours/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import mongoose from 'mongoose';
import Tour from '@/models/Tour';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/auth';

// Helper function to convert MongoDB document to plain object
const serializeDocument = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id?.toString(),
    id: obj._id?.toString(),
    createdAt: obj.createdAt?.toISOString(),
    updatedAt: obj.updatedAt?.toISOString(),
  };
};

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth('admin');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '10')));
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');
    const difficulty = searchParams.get('difficulty');
  
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (featured === 'true') {
      query.featured = true;
    } else if (featured === 'false') {
      query.featured = false;
    }

    if (difficulty && difficulty !== 'all') {
      query.difficulty = difficulty;
    }

    

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { 'highlights': { $regex: search, $options: 'i' } },
        { 'itinerary.title': { $regex: search, $options: 'i' } }
      ];
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder;

    // Fetch tours with pagination
    const [tours, total] = await Promise.all([
      Tour.find(query)
        .skip(skip)
        .limit(limit)
        .sort(sort)
        .lean(),
      Tour.countDocuments(query)
    ]);

    // Get booking statistics for tours
    const tourIds = tours.map(tour => tour._id);
    
    // Aggregate booking data
    const bookingStats = await Booking.aggregate([
      { 
        $match: { 
          tour: { $in: tourIds },
          paymentStatus: { $in: ['paid', 'partial'] }
        } 
      },
      {
        $group: {
          _id: '$tour',
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'confirmed'] }, 1, 0] }
          },
          completedBookings: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'completed'] }, 1, 0] }
          },
       
          averageRating: { $avg: '$reviews.rating' },
          totalTravelers: { $sum: '$numberOfTravelers.adults' }
        }
      }
    ]);

    // Create a map of booking stats by tour ID
    const statsMap = new Map();
    bookingStats.forEach(stat => {
      statsMap.set(stat._id.toString(), stat);
    });

    // Enhance tours with statistics
    const toursWithStats = tours.map(tour => {
      const stats = statsMap.get(tour._id.toString()) || {
        totalBookings: 0,
        confirmedBookings: 0,
        completedBookings: 0,
        totalRevenue: 0,
        averageRating: 0,
        totalTravelers: 0
      };

      return {
        ...tour,
        _id: tour._id.toString(),
        id: tour._id.toString(),
        createdAt: tour.createdAt?.toISOString(),
        updatedAt: tour.updatedAt?.toISOString(),
        stats: {
          bookings: stats.totalBookings,
          confirmed: stats.confirmedBookings,
          completed: stats.completedBookings,
          revenue: stats.totalRevenue,
          rating: stats.averageRating,
          travelers: stats.totalTravelers,
          conversionRate: total > 0 ? ((stats.totalBookings / total) * 100).toFixed(1) : 0
        }
      };
    });

    return NextResponse.json({
      success: true,
      data: toursWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1
      },
      filters: {
        category,
        status,
        featured,
        difficulty,
      
        search
      }
    });

  } catch (error: any) {
    console.error('Error fetching tours:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid parameter format' },
        { status: 400 }
      );
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Authenticate user
    const user = await requireAuth('admin');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Connect to database
    await connectToDatabase();

    // Parse request data
    const data = await request.json();

    // Validate required fields
    const requiredFields = ['name', 'description', 'duration', 'location'];
    const missingFields = requiredFields.filter(field => !data[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if slug exists
      const existingTour = await Tour.findOne({ slug: data.slug });
      if (existingTour) {
        data.slug = `${data.slug}-${Date.now()}`;
      }
    }

    // Generate unique ID if not provided
    if (!data.id) {
      const prefix = data.category?.substring(0, 4).toLowerCase() || 'tour';
      const count = await Tour.countDocuments();
      data.id = `${prefix}-${(count + 1).toString().padStart(3, '0')}`;
    }

    // Set default values
    const tourData = {
      ...data,
      status: data.status || 'draft',
      featured: data.featured || false,
      rating: data.rating || 0,
      reviewCount: data.reviewCount || 0,
      imageCount: data.images?.length || 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create tour
    const tour = await Tour.create(tourData);

    // Log activity (if you have an activity log model)
    // await ActivityLog.create({
    //   user: user._id,
    //   action: 'CREATE',
    //   resource: 'tour',
    //   resourceId: tour._id,
    //   details: { tourName: tour.name }
    // });

    return NextResponse.json({
      success: true,
      data: serializeDocument(tour),
      message: 'Tour created successfully'
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating tour:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `A tour with this ${field} already exists` },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create tour' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS request for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}