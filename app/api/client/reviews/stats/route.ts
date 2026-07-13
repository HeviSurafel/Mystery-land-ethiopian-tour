import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Review from '@/models/Review';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const [reviews, published, pending, helpful, byType] = await Promise.all([
      Review.find({ userId: user.userId }),
      Review.countDocuments({ userId: user.userId, status: 'published' }),
      Review.countDocuments({ userId: user.userId, status: 'pending' }),
      Review.aggregate([
        { $match: { userId: user.userId } },
        { $group: { _id: null, total: { $sum: '$helpful' } } }
      ]),
      Review.aggregate([
        { $match: { userId: user.userId } },
        { $group: { _id: '$itemType', count: { $sum: 1 } } }
      ])
    ]);

    const totalReviews = reviews.length;
    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (totalReviews || 1);
    const totalHelpful = helpful[0]?.total || 0;

    const topCategories = byType.map(item => ({
      type: item._id === 'tour' ? 'Tours' : 'Destinations',
      count: item.count
    }));

    return NextResponse.json({
      success: true,
      data: {
        totalReviews,
        publishedReviews: published,
        pendingReviews: pending,
        averageRating: Math.round(averageRating * 10) / 10,
        totalHelpful,
        topCategories
      }
    });

  } catch (error: any) {
    console.error('Error fetching review stats:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}