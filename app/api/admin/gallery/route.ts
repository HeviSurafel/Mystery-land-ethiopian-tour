import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryPhoto, GalleryCategory } from '@/models/Gallery';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '24');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    } else if (featured === 'false') {
      filter.featured = false;
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Tag filter
    if (tag && tag !== 'all') {
      filter.tags = tag;
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { tags: searchRegex },
        { location: searchRegex }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel
    const [photos, totalCount, stats] = await Promise.all([
      GalleryPhoto.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      
      GalleryPhoto.countDocuments(filter),
      
      getGalleryStats()
    ]);

    // Transform photos for response
    const transformedPhotos = photos.map(photo => ({
      id: photo._id.toString(),
      _id: photo._id.toString(),
      title: photo.title,
      description: photo.description,
      imageUrl: photo.imageUrl,
      category: photo.category,
      tags: photo.tags || [],
      location: photo.location,
      likes: photo.likes || 0,
      views: photo.views || 0,
      featured: photo.featured || false,
      dateTaken: photo.dateTaken,
      tourId: photo.tourId,
      destinationId: photo.destinationId,
      festivalId: photo.festivalId,
      createdAt: photo.createdAt,
      updatedAt: photo.updatedAt
    }));

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    };

    return NextResponse.json({
      success: true,
      data: transformedPhotos,
      pagination,
      stats
    });

  } catch (error: any) {
    console.error('Error fetching gallery photos:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch photos' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const data = await req.json();

    // Generate unique ID if not provided
    if (!data.id) {
      data.id = `photo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Set default values
    if (!data.likes) data.likes = 0;
    if (!data.views) data.views = 0;
    if (!data.tags) data.tags = [];

    const photo = await GalleryPhoto.create(data);

    return NextResponse.json({
      success: true,
      data: {
        id: photo._id.toString(),
        _id: photo._id.toString(),
        ...photo.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error creating photo:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

async function getGalleryStats() {
  try {
    const [
      totalPhotos,
      featuredPhotos,
      totalViews,
      totalLikes,
      topCategories,
      recentPhotos
    ] = await Promise.all([
      GalleryPhoto.countDocuments(),
      GalleryPhoto.countDocuments({ featured: true }),
      GalleryPhoto.aggregate([{ $group: { _id: null, total: { $sum: '$views' } } }]),
      GalleryPhoto.aggregate([{ $group: { _id: null, total: { $sum: '$likes' } } }]),
      GalleryPhoto.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      GalleryPhoto.find()
        .sort({ createdAt: -1 })
        .limit(10)
        .select('title imageUrl category views likes createdAt')
        .lean()
    ]);

    return {
      totalPhotos,
      featuredPhotos,
      totalCategories: 0, // Will be populated from categories endpoint
      totalCollections: 0, // Will be populated from collections endpoint
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      topCategories: topCategories.map(item => ({
        id: item._id,
        name: item._id,
        count: item.count
      })),
      recentPhotos: recentPhotos.map(p => ({
        id: p._id,
        title: p.title,
        imageUrl: p.imageUrl,
        category: p.category,
        views: p.views || 0,
        likes: p.likes || 0,
        createdAt: p.createdAt
      }))
    };
  } catch (error) {
    console.error('Error calculating gallery stats:', error);
    return {
      totalPhotos: 0,
      featuredPhotos: 0,
      totalCategories: 0,
      totalCollections: 0,
      totalViews: 0,
      totalLikes: 0,
      topCategories: [],
      recentPhotos: []
    };
  }
}