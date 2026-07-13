import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryPhoto } from '@/models/Gallery';

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

    const { featured } = await req.json();
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

    photo.featured = featured;
    photo.updatedAt = new Date();
    await photo.save();

    return NextResponse.json({
      success: true,
      data: {
        id: photo._id.toString(),
        featured: photo.featured
      }
    });

  } catch (error: any) {
    console.error('Error updating featured status:', error);
    
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