import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Review from '@/models/Review';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    // Check if user has admin role
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const rating = searchParams.get('rating');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    if (status && status !== 'all') {
      filter.status = status;
    }

    if (type && type !== 'all') {
      filter.itemType = type;
    }

    if (rating && rating !== 'all') {
      const minRating = parseInt(rating);
      filter.rating = { $gte: minRating };
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { title: searchRegex },
        { content: searchRegex },
        { userName: searchRegex },
        { userEmail: searchRegex },
        { itemName: searchRegex }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel
    const [reviews, totalCount, stats] = await Promise.all([
      Review.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      
      Review.countDocuments(filter),
      
      getReviewStats()
    ]);

    // Enrich reviews with item names if needed - FIXED to handle string IDs
    const enrichedReviews = await Promise.all(
      reviews.map(async (review) => {
        let itemName = review.itemName;
        
        // If itemName is not set, try to fetch it - handle both ObjectId and string ID
        if (!itemName && review.itemId) {
          try {
            if (review.itemType === 'tour') {
              // Try to find by MongoDB _id first
              let tour = null;
              if (mongoose.Types.ObjectId.isValid(review.itemId)) {
                tour = await Tour.findById(review.itemId).lean();
              }
              // If not found, try by custom id field
              if (!tour) {
                tour = await Tour.findOne({ id: review.itemId }).lean();
              }
              itemName = tour?.name || 'Unknown Tour';
            } else if (review.itemType === 'destination') {
              // Try to find by MongoDB _id first
              let destination = null;
              if (mongoose.Types.ObjectId.isValid(review.itemId)) {
                destination = await Destination.findById(review.itemId).lean();
              }
              // If not found, try by custom id field
              if (!destination) {
                destination = await Destination.findOne({ id: review.itemId }).lean();
              }
              itemName = destination?.name || 'Unknown Destination';
            }
          } catch (err) {
            console.error(`Error fetching item name for ${review.itemType}:`, err);
            itemName = 'Unknown';
          }
        }

        return {
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
        };
      })
    );

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit)
    };

    return NextResponse.json({
      success: true,
      data: enrichedReviews,
      pagination,
      stats
    });

  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}

async function getReviewStats() {
  try {
    const [total, pending, published, rejected, totalHelpful] = await Promise.all([
      Review.countDocuments(),
      Review.countDocuments({ status: 'pending' }),
      Review.countDocuments({ status: 'published' }),
      Review.countDocuments({ status: 'rejected' }),
      Review.aggregate([
        { $group: { _id: null, total: { $sum: '$helpful' } } }
      ])
    ]);

    // Calculate average rating from published reviews
    const publishedReviews = await Review.find({ status: 'published' }).lean();
    const averageRating = publishedReviews.length > 0
      ? publishedReviews.reduce((acc, r) => acc + r.rating, 0) / publishedReviews.length
      : 0;

    return {
      total,
      pending,
      published,
      rejected,
      averageRating: Math.round(averageRating * 10) / 10,
      totalHelpful: totalHelpful[0]?.total || 0
    };
  } catch (error) {
    console.error('Error calculating review stats:', error);
    return {
      total: 0,
      pending: 0,
      published: 0,
      rejected: 0,
      averageRating: 0,
      totalHelpful: 0
    };
  }
}