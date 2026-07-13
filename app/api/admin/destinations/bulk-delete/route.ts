// app/api/admin/destinations/bulk-delete/route.ts

import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Destination from '@/models/Destination';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No destination IDs provided' },
        { status: 400 }
      );
    }

    const result = await Destination.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({
      success: true,
      message: `${result.deletedCount} destinations deleted successfully`,
      count: result.deletedCount,
    });
  } catch (error: any) {
    console.error('Error bulk deleting destinations:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete destinations' },
      { status: 500 }
    );
  }
}