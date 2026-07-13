// app/api/admin/destinations/bulk-status/route.ts

import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Destination from '@/models/Destination';
import { NextRequest, NextResponse } from 'next/server';


export async function PUT(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    const { ids, status } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'No destination IDs provided' },
        { status: 400 }
      );
    }

    if (!status || !['active', 'inactive', 'upcoming'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    const result = await Destination.updateMany(
      { _id: { $in: ids } },
      { $set: { status, updatedAt: new Date() } }
    );

    return NextResponse.json({
      success: true,
      message: `${result.modifiedCount} destinations updated to ${status}`,
      count: result.modifiedCount,
    });
  } catch (error: any) {
    console.error('Error bulk updating destination status:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update destination status' },
      { status: 500 }
    );
  }
}