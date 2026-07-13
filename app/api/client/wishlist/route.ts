import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

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

    // Enrich wishlist items with tour details
    const enrichedWishlist = await Promise.all(
      wishlist.map(async (item: any) => {
        const tourId = item.tourId || item;
        const tour = await Tour.findOne({
          $or: [
            { _id: tourId },
            { id: tourId }
          ]
        }).lean();

        let destinationData = null;
        if (tour?.destinationId) {
          destinationData = await Destination.findOne({
            $or: [
              { _id: tour.destinationId },
              { id: tour.destinationId }
            ]
          }).lean();
        }

        return {
          id: item._id?.toString() || `${tourId}_${Date.now()}`,
          tourId: tourId,
          tourName: tour?.name || 'Unknown Tour',
          tourImage: tour?.images?.[0] || '',
          tourDuration: tour?.duration,
          tourDifficulty: tour?.difficulty,
          destination: destinationData?.name,
          price: tour?.price,
          addedAt: item.addedAt || new Date().toISOString()
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedWishlist,
      total: enrichedWishlist.length
    });

  } catch (error: any) {
    console.error('Error fetching wishlist:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch wishlist' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const { tourId } = await req.json();

    if (!tourId) {
      return NextResponse.json(
        { success: false, error: 'Tour ID is required' },
        { status: 400 }
      );
    }

    // Verify tour exists
    const tour = await Tour.findOne({
      $or: [
        { _id: tourId },
        { id: tourId }
      ]
    });

    if (!tour) {
      return NextResponse.json(
        { success: false, error: 'Tour not found' },
        { status: 404 }
      );
    }

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

    // Initialize wishlist if it doesn't exist
    if (!userData.wishlist) {
      userData.wishlist = [];
    }

    // Check if already in wishlist
    const alreadyExists = userData.wishlist.some(
      (item: any) => (item.tourId || item) === tourId
    );

    if (alreadyExists) {
      return NextResponse.json(
        { success: false, error: 'Tour already in wishlist' },
        { status: 400 }
      );
    }

    // Add to wishlist
    userData.wishlist.push({
      tourId,
      addedAt: new Date()
    });

    await userData.save();

    return NextResponse.json({
      success: true,
      message: 'Added to wishlist successfully'
    });

  } catch (error: any) {
    console.error('Error adding to wishlist:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to add to wishlist' },
      { status: 500 }
    );
  }
}