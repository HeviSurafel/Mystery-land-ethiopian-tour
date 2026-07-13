import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';

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

    const { reviewIds } = await req.json();

    if (!reviewIds || !Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No review IDs provided' },
        { status: 400 }
      );
    }

    // Convert string IDs to appropriate formats for querying
    const objectIds = reviewIds.filter(id => mongoose.Types.ObjectId.isValid(id));
    const stringIds = reviewIds.filter(id => !mongoose.Types.ObjectId.isValid(id));

    const query: any = {
      $or: [
        ...(objectIds.length > 0 ? [{ _id: { $in: objectIds } }] : []),
        ...(stringIds.length > 0 ? [{ id: { $in: stringIds } }] : [])
      ]
    };

    // Get all reviews to know which items need rating updates
    const reviews = await Review.find(query);

    // Delete the reviews
    await Review.deleteMany(query);

    // Update ratings for affected items
    const itemUpdates = new Map();
    reviews.forEach(review => {
      if (review.status === 'published') {
        const key = `${review.itemType}:${review.itemId}`;
        if (!itemUpdates.has(key)) {
          itemUpdates.set(key, { itemId: review.itemId, itemType: review.itemType });
        }
      }
    });

    // Update all affected items' ratings
    await Promise.all(
      Array.from(itemUpdates.values()).map(({ itemId, itemType }) =>
        updateItemRating(itemId, itemType)
      )
    );

    return NextResponse.json({
      success: true,
      message: `${reviewIds.length} reviews deleted successfully`
    });

  } catch (error: any) {
    console.error('Error bulk deleting reviews:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete reviews' },
      { status: 500 }
    );
  }
}

async function updateItemRating(itemId: string, itemType: string) {
  try {
    const { default: Review } = await import('@/models/Review');
    const { default: Tour } = await import('@/models/Tour');
    const { default: Destination } = await import('@/models/Destination');

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