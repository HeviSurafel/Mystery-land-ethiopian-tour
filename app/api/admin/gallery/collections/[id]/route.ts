import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryCollection } from '@/models/Gallery';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const collectionId = (await params).id;

    const collection = await GalleryCollection.findOne({
      $or: [
        { _id: collectionId },
        { id: collectionId },
        { slug: collectionId }
      ]
    }).lean();

    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: collection._id.toString(),
        _id: collection._id.toString(),
        name: collection.name,
        description: collection.description,
        slug: collection.slug,
        coverImage: collection.coverImage,
        photos: collection.photos || [],
        photoCount: collection.photoCount || collection.photos?.length || 0,
        createdAt: collection.createdAt,
        updatedAt: collection.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error fetching collection:', error);
    
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const collectionId = (await params).id;
    const updates = await req.json();

    const collection = await GalleryCollection.findOne({
      $or: [
        { _id: collectionId },
        { id: collectionId },
        { slug: collectionId }
      ]
    });
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Update photo count if photos array changed
    if (updates.photos) {
      updates.photoCount = updates.photos.length;
    }

    // Update collection
    Object.keys(updates).forEach(key => {
      collection[key] = updates[key];
    });

    collection.updatedAt = new Date();
    
    await collection.save();

    return NextResponse.json({
      success: true,
      data: {
        id: collection._id.toString(),
        _id: collection._id.toString(),
        ...collection.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error updating collection:', error);
    
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const collectionId = (await params).id;

    const collection = await GalleryCollection.findOne({
      $or: [
        { _id: collectionId },
        { id: collectionId },
        { slug: collectionId }
      ]
    });
    
    if (!collection) {
      return NextResponse.json(
        { success: false, error: 'Collection not found' },
        { status: 404 }
      );
    }

    await GalleryCollection.deleteOne({ _id: collection._id });

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting collection:', error);
    
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