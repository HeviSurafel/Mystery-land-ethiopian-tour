import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryPhoto } from '@/models/Gallery';

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { photoIds } = await req.json();

    if (!photoIds || !Array.isArray(photoIds) || photoIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No photos specified' },
        { status: 400 }
      );
    }

    // Delete photos
    await GalleryPhoto.deleteMany({
      $or: [
        { _id: { $in: photoIds } },
        { id: { $in: photoIds } }
      ]
    });

    return NextResponse.json({
      success: true,
      message: `${photoIds.length} photos deleted successfully`
    });

  } catch (error: any) {
    console.error('Error bulk deleting photos:', error);
    
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