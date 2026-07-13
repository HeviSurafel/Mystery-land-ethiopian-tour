import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryCollection, GalleryPhoto } from '@/models/Gallery';

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

    const collections = await GalleryCollection.find({})
      .sort({ name: 1 })
      .lean();

    // Get photo counts and ensure cover images
    const collectionsWithDetails = collections.map(collection => ({
      id: collection._id.toString(),
      _id: collection._id.toString(),
      name: collection.name,
      description: collection.description,
      slug: collection.slug,
      coverImage: collection.coverImage || (collection.photos?.[0]?.imageUrl || ''),
      photos: collection.photos || [],
      photoCount: collection.photoCount || collection.photos?.length || 0,
      createdAt: collection.createdAt,
      updatedAt: collection.updatedAt
    }));

    return NextResponse.json({
      success: true,
      data: collectionsWithDetails,
      total: collections.length
    });

  } catch (error: any) {
    console.error('Error fetching collections:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
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
      data.id = `collection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Set default values
    if (!data.photos) data.photos = [];
    if (!data.photoCount) data.photoCount = 0;

    const collection = await GalleryCollection.create(data);

    return NextResponse.json({
      success: true,
      data: {
        id: collection._id.toString(),
        _id: collection._id.toString(),
        ...collection.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error creating collection:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Collection with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}