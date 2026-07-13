import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Offer from '@/models/Offer';
import { requireAuthFromRequest } from '@/lib/auth';

export async function PATCH(request: NextRequest) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { ids, status } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No offer IDs provided' }, { status: 400 });
    }

    if (!status || !['active', 'inactive', 'expired'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const result = await Offer.updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} offers updated to ${status}`,
      count: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Error bulk updating offer status:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update offer status' },
      { status: 500 }
    );
  }
}