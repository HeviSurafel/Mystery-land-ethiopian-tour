import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Offer from '@/models/Offer';
import { requireAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const total = await Offer.countDocuments();
    const active = await Offer.countDocuments({ status: 'active' });
    const inactive = await Offer.countDocuments({ status: 'inactive' });
    const expired = await Offer.countDocuments({ status: 'expired' });
    const featured = await Offer.countDocuments({ featured: true });

    const categoryDistribution = await Offer.aggregate([
      { $match: { category: { $exists: true, $ne: null } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    const statusDistribution = await Offer.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const recentOffers = await Offer.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name category discount status validUntil images')
      .lean();

    const categoryDistObj = categoryDistribution.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const statusDistObj = statusDistribution.reduce((acc, item) => {
      acc[item._id || 'unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      data: {
        total,
        active,
        inactive,
        expired,
        featured,
        categoryDistribution: categoryDistObj,
        statusDistribution: statusDistObj,
        recentOffers,
      }
    });
  } catch (error: any) {
    console.error('Error fetching offer stats:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch offer stats' },
      { status: 500 }
    );
  }
}