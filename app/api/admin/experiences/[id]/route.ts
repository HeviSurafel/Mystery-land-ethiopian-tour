// app/api/admin/experiences/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';

import { requireAuthFromRequest } from '@/lib/auth';
import mongoose from 'mongoose';
import Experience from '@/models/Experience';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid experience ID' },
        { status: 400 }
      );
    }

    const experience = await Experience.findById(id).lean();

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    const bookings = experience.bookings?.length || 0;
 
    const experienceWithStats = {
      ...experience,
      _id: experience._id.toString(),
      id: experience._id.toString(),
      bookings,
      reviews: experience.reviews?.length || 0
    };

    return NextResponse.json({
      success: true,
      data: experienceWithStats
    });

  } catch (error: any) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;
    const updates = await request.json();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid experience ID' },
        { status: 400 }
      );
    }

    // Update slug if name changed and slug not provided
    if (updates.name && !updates.slug) {
      updates.slug = updates.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const experience = await Experience.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        ...experience,
        _id: experience._id.toString(),
        id: experience._id.toString()
      }
    });

  } catch (error: any) {
    console.error('Error updating experience:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update experience' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: 'Invalid experience ID' },
        { status: 400 }
      );
    }

    const experience = await Experience.findByIdAndDelete(id);

    if (!experience) {
      return NextResponse.json(
        { error: 'Experience not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Experience deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting experience:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete experience' },
      { status: 500 }
    );
  }
}