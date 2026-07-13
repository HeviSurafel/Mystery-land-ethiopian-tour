import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Review from '@/models/Review';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams
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

    const { id } = await params;

    // Find review by various ID formats
    let review = null;
    
    if (mongoose.Types.ObjectId.isValid(id)) {
      review = await Review.findById(id);
    }
    
    if (!review) {
      review = await Review.findOne({ id });
    }

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update review status
    review.status = 'published';
    review.updatedAt = new Date();
    await review.save();

    // Update item's average rating
    await updateItemRating(review.itemId, review.itemType);

    return NextResponse.json({
      success: true,
      message: 'Review approved successfully',
      data: {
        id: review._id.toString(),
        status: review.status
      }
    });

  } catch (error: any) {
    console.error('Error approving review:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to approve review' },
      { status: 500 }
    );
  }
}

async function updateItemRating(itemId: string, itemType: string) {
  try {
    const reviews = await Review.find({
      itemId,
      itemType,
      status: 'published'
    });

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
    const reviewCount = reviews.length;

    if (itemType === 'tour') {
      await Tour.findOneAndUpdate(
        { $or: [{ _id: itemId }, { id: itemId }] },
        {
          rating: Math.round(averageRating * 10) / 10,
          reviewCount
        }
      );
    } else if (itemType === 'destination') {
      await Destination.findOneAndUpdate(
        { $or: [{ _id: itemId }, { id: itemId }] },
        {
          rating: Math.round(averageRating * 10) / 10,
          reviewCount
        }
      );
    }
  } catch (error) {
    console.error('Error updating item rating:', error);
  }
}