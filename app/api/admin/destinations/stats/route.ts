// app/api/admin/destinations/stats/route.ts

import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Destination from '@/models/Destination';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    // Get total counts by status
    const total = await Destination.countDocuments();
    const active = await Destination.countDocuments({ status: 'active' });
    const inactive = await Destination.countDocuments({ status: 'inactive' });
    const upcoming = await Destination.countDocuments({ status: 'upcoming' });
    const featured = await Destination.countDocuments({ featured: true });

    // Get region distribution
    const regionDistribution = await Destination.aggregate([
      { $match: { region: { $exists: true, $ne: null } } },
      { $group: { _id: '$region', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get type distribution
    const typeDistribution = await Destination.aggregate([
      { $match: { type: { $exists: true, $ne: null } } },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get tag distribution (UNESCO, etc.)
    const tagDistribution = await Destination.aggregate([
      { $match: { tag: { $exists: true, $ne: null } } },
      { $group: { _id: '$tag', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Get recent destinations
    const recentDestinations = await Destination.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name region country type images slug createdAt')
      .lean();

    // Format distributions as objects
    const regionDistObj = regionDistribution.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const typeDistObj = typeDistribution.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    const tagDistObj = tagDistribution.reduce((acc, item) => {
      acc[item._id || 'Unknown'] = item.count;
      return acc;
    }, {} as Record<string, number>);

    return NextResponse.json({
      total,
      active,
      inactive,
      upcoming,
      featured,
      regionDistribution: regionDistObj,
      typeDistribution: typeDistObj,
      tagDistribution: tagDistObj,
      recentDestinations,
    });
  } catch (error: any) {
    console.error('Error fetching destination stats:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch destination stats' },
      { status: 500 }
    );
  }
}