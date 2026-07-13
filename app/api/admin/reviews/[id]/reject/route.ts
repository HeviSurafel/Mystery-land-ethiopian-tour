import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Review from '@/models/Review';
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
    const { reason } = await req.json();

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

    // Update review status with rejection reason
    review.status = 'rejected';
    review.updatedAt = new Date();
    
    // Store rejection reason in metadata or notes (you may want to add a field to your schema)
    if (!review.metadata) {
      review.metadata = {};
    }
    review.metadata.rejectionReason = reason;
    review.metadata.rejectedAt = new Date();
    review.metadata.rejectedBy = user.userId;

    await review.save();

    return NextResponse.json({
      success: true,
      message: 'Review rejected successfully',
      data: {
        id: review._id.toString(),
        status: review.status
      }
    });

  } catch (error: any) {
    console.error('Error rejecting review:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reject review' },
      { status: 500 }
    );
  }
}