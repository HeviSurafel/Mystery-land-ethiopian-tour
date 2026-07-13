// app/api/admin/destinations/[id]/route.ts

import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Destination from '@/models/Destination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();
    
    const { id } = await params;
    
    // Fix: Use findById instead of find({})
    const destination = await Destination.findById(id).lean();

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: destination,
    });
  } catch (error: any) {
    console.error('Error fetching destination:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch destination' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    const body = await request.json();
    
    // If slug is being updated, check for uniqueness
    if (body.slug) {
      const existingDestination = await Destination.findOne({
        slug: body.slug,
        _id: { $ne: id }
      });
      
      if (existingDestination) {
        return NextResponse.json(
          { error: 'Destination with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const destination = await Destination.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: destination,
    });
  } catch (error: any) {
    console.error('Error updating destination:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update destination' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    const destination = await Destination.findByIdAndDelete(id);

    if (!destination) {
      return NextResponse.json(
        { error: 'Destination not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Destination deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting destination:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete destination' },
      { status: 500 }
    );
  }
}