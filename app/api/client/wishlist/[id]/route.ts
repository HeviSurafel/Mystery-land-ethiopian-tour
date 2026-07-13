import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const { id: itemId } = await params;

    const userData = await User.findOne({ 
      $or: [
        { _id: user.userId },
        { id: user.userId },
        { email: user.email }
      ]
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    if (!userData.wishlist) {
      return NextResponse.json(
        { success: false, error: 'Wishlist is empty' },
        { status: 404 }
      );
    }

    // Remove from wishlist - handle both string IDs and object items
    const initialLength = userData.wishlist.length;
    userData.wishlist = userData.wishlist.filter((item: any) => {
      const itemIdToCompare = typeof item === 'string' ? item : item.tourId;
      return itemIdToCompare !== itemId && item._id?.toString() !== itemId;
    });

    if (userData.wishlist.length === initialLength) {
      return NextResponse.json(
        { success: false, error: 'Item not found in wishlist' },
        { status: 404 }
      );
    }

    await userData.save();

    return NextResponse.json({
      success: true,
      message: 'Removed from wishlist successfully'
    });

  } catch (error: any) {
    console.error('Error removing from wishlist:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to remove from wishlist' },
      { status: 500 }
    );
  }
}