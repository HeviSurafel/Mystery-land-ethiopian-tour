import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const resolvedParams = await params;
    const reviewId = resolvedParams.id;

    const review = await Review.findOne({
      $or: [
        { _id: reviewId },
        { id: reviewId }
      ]
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: 'Review not found' },
        { status: 404 }
      );
    }

    // Initialize helpfulBy array if it doesn't exist
    if (!review.helpfulBy) {
      review.helpfulBy = [];
    }

    // Check if user already marked as helpful
    const alreadyHelpful = review.helpfulBy.includes(user.userId);

    if (alreadyHelpful) {
      // Remove helpful mark
      review.helpfulBy = review.helpfulBy.filter((id: string) => id !== user.userId);
      review.helpful = Math.max(0, (review.helpful || 1) - 1);
    } else {
      // Add helpful mark
      review.helpfulBy.push(user.userId);
      review.helpful = (review.helpful || 0) + 1;
    }

    await review.save();

    return NextResponse.json({
      success: true,
      data: {
        helpful: review.helpful,
        isHelpful: !alreadyHelpful
      }
    });

  } catch (error: any) {
    console.error('Error toggling helpful:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update helpful' },
      { status: 500 }
    );
  }
}