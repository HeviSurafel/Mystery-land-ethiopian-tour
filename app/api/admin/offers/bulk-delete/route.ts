import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Offer from '@/models/Offer';
import { requireAuthFromRequest } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ error: 'No offer IDs provided' }, { status: 400 });
    }

    const result = await Offer.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} offers deleted successfully`,
      count: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Error bulk deleting offers:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete offers' },
      { status: 500 }
    );
  }
}