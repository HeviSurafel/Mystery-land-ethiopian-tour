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

export async function GET(
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
    
    // Try by MongoDB _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      review = await Review.findById(id).lean();
    }
    
    // Try by custom id field
    if (!review) {
      review = await Review.findOne({ id }).lean();
    }

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Get item name
    let itemName = review.itemName;
    if (!itemName && review.itemId) {
      if (review.itemType === 'tour') {
        const tour = await Tour.findOne({
          $or: [
            { _id: review.itemId },
            { id: review.itemId }
          ]
        }).lean();
        itemName = tour?.name || 'Unknown Tour';
      } else if (review.itemType === 'destination') {
        const destination = await Destination.findOne({
          $or: [
            { _id: review.itemId },
            { id: review.itemId }
          ]
        }).lean();
        itemName = destination?.name || 'Unknown Destination';
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        id: review._id.toString(),
        _id: review._id.toString(),
        userId: review.userId,
        userName: review.userName,
        userEmail: review.userEmail,
        userAvatar: review.userAvatar,
        itemId: review.itemId,
        itemType: review.itemType,
        itemName: itemName || 'Unknown',
        rating: review.rating,
        title: review.title,
        content: review.content,
        pros: review.pros || [],
        cons: review.cons || [],
        images: review.images || [],
        helpful: review.helpful || 0,
        verified: review.verified || false,
        status: review.status || 'pending',
        createdAt: review.createdAt,
        updatedAt: review.updatedAt,
        response: review.response
      }
    });

  } catch (error: any) {
    console.error('Error fetching review:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch review' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    // Store item info before deletion for rating update
    const itemId = review.itemId;
    const itemType = review.itemType;

    await Review.deleteOne({ _id: review._id });

    // Update item's average rating if it was published
    if (review.status === 'published') {
      await updateItemRating(itemId, itemType);
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting review:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete review' },
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