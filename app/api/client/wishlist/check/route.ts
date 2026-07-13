import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const tourId = searchParams.get('tourId');

    if (!tourId) {
      return NextResponse.json(
        { success: false, error: 'Tour ID is required' },
        { status: 400 }
      );
    }

    const userData = await User.findOne({ 
      $or: [
        { _id: user.userId },
        { id: user.userId },
        { email: user.email }
      ]
    }).lean();

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    const wishlist = userData.wishlist || [];
    const isInWishlist = wishlist.some(
      (item: any) => (item.tourId || item) === tourId
    );

    return NextResponse.json({
      success: true,
      data: {
        isInWishlist,
        tourId
      }
    });

  } catch (error: any) {
    console.error('Error checking wishlist:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to check wishlist' },
      { status: 500 }
    );
  }
}