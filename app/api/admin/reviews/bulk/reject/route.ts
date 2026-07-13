import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Review from '@/models/Review';
import mongoose from 'mongoose';

export async function POST(req: NextRequest) {
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

    // Update all reviews to rejected
    await Review.updateMany(query, {
      $set: {
        status: 'rejected',
        updatedAt: new Date(),
        'metadata.rejectedAt': new Date(),
        'metadata.rejectedBy': user.userId
      }
    });

    return NextResponse.json({
      success: true,
      message: `${reviewIds.length} reviews rejected successfully`
    });

  } catch (error: any) {
    console.error('Error bulk rejecting reviews:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to reject reviews' },
      { status: 500 }
    );
  }
}