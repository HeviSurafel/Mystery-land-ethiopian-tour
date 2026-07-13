import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Offer from '@/models/Offer';

// GET /api/offers - Fetch all offers (with filters)
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const featured = searchParams.get('featured');
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter
    const filter: any = {};
    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    if (status) filter.status = status;
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { discount: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Execute queries
    const [offers, total, stats] = await Promise.all([
      Offer.find(filter)
        .sort({ [sortBy]: sortOrder === 'desc' ? -1 : 1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Offer.countDocuments(filter),
      Offer.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            featured: { $sum: { $cond: [{ $eq: ['$featured', true] }, 1, 0] } },
            earlyBird: { $sum: { $cond: [{ $eq: ['$category', 'early-bird'] }, 1, 0] } },
            group: { $sum: { $cond: [{ $eq: ['$category', 'group'] }, 1, 0] } },
            seasonal: { $sum: { $cond: [{ $eq: ['$category', 'seasonal'] }, 1, 0] } },
            lastMinute: { $sum: { $cond: [{ $eq: ['$category', 'last-minute'] }, 1, 0] } },
            family: { $sum: { $cond: [{ $eq: ['$category', 'family'] }, 1, 0] } },
            active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
            expired: { $sum: { $cond: [{ $eq: ['$status', 'expired'] }, 1, 0] } }
          }
        }
      ])
    ]);

    // Clean MongoDB documents for client
    const cleanedOffers = offers.map((offer: any) => ({
      ...offer,
      _id: offer._id.toString(),
      id: offer.id || offer._id.toString(),
      createdAt: offer.createdAt?.toISOString(),
      updatedAt: offer.updatedAt?.toISOString(),
      validFrom: offer.validFrom?.toISOString?.() || offer.validFrom,
      validUntil: offer.validUntil?.toISOString?.() || offer.validUntil
    }));

    return NextResponse.json({
      success: true,
      data: cleanedOffers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      stats: stats[0] || { 
        total: 0, 
        featured: 0, 
        earlyBird: 0, 
        group: 0, 
        seasonal: 0, 
        lastMinute: 0, 
        family: 0,
        active: 0,
        expired: 0 
      }
    });
  } catch (error) {
    console.error('Error fetching offers:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

