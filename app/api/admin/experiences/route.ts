// app/api/admin/experiences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';

import { requireAuthFromRequest } from '@/lib/auth';
import Experience from '@/models/Experience';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};

    if (category && category !== 'all') {
      query.category = category;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const [experiences, total] = await Promise.all([
      Experience.find(query)
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Experience.countDocuments(query)
    ]);

    // Calculate stats for each experience
    const experiencesWithStats = experiences.map(exp => {
      const bookings = exp.bookings?.length || 0;
 
      return {
        ...exp,
        _id: exp._id.toString(),
        id: exp._id.toString(),
        bookings,
    
        reviews: exp.reviews?.length || 0,
        rating: exp.rating || 0
      };
    });

    return NextResponse.json({
      success: true,
      data: experiencesWithStats,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching experiences:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const data = await request.json();

    // Generate slug if not provided
    if (!data.slug && data.name) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    const experience = await Experience.create({
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    return NextResponse.json({
      success: true,
      data: {
        ...experience.toObject(),
        _id: experience._id.toString(),
        id: experience._id.toString()
      }
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating experience:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to create experience' },
      { status: 500 }
    );
  }
}