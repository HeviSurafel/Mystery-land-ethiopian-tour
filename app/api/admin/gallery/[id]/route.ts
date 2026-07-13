import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryPhoto } from '@/models/Gallery';

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

    const photoId = (await params).id;

    const photo = await GalleryPhoto.findOne({
      $or: [
        { _id: photoId },
        { id: photoId }
      ]
    }).lean();

    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await GalleryPhoto.findByIdAndUpdate(photo._id, { $inc: { views: 1 } });

    return NextResponse.json({
      success: true,
      data: {
        id: photo._id.toString(),
        _id: photo._id.toString(),
        title: photo.title,
        description: photo.description,
        imageUrl: photo.imageUrl,
        category: photo.category,
        tags: photo.tags || [],
        location: photo.location,
        likes: photo.likes || 0,
        views: (photo.views || 0) + 1,
        featured: photo.featured || false,
        dateTaken: photo.dateTaken,
        tourId: photo.tourId,
        destinationId: photo.destinationId,
        festivalId: photo.festivalId,
        createdAt: photo.createdAt,
        updatedAt: photo.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error fetching photo:', error);
    
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

    const photoId = (await params).id;
    const updates = await req.json();

    const photo = await GalleryPhoto.findOne({
      $or: [
        { _id: photoId },
        { id: photoId }
      ]
    });
    
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    // Update photo
    Object.keys(updates).forEach(key => {
      photo[key] = updates[key];
    });

    photo.updatedAt = new Date();
    
    await photo.save();

    return NextResponse.json({
      success: true,
      data: {
        id: photo._id.toString(),
        _id: photo._id.toString(),
        ...photo.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error updating photo:', error);
    
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

    const photoId = (await params).id;

    const photo = await GalleryPhoto.findOne({
      $or: [
        { _id: photoId },
        { id: photoId }
      ]
    });
    
    if (!photo) {
      return NextResponse.json(
        { success: false, error: 'Photo not found' },
        { status: 404 }
      );
    }

    await GalleryPhoto.deleteOne({ _id: photo._id });

    return NextResponse.json({
      success: true,
      message: 'Photo deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting photo:', error);
    
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