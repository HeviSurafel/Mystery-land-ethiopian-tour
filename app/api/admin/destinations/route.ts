// app/api/admin/destinations/route.ts

import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Destination from '@/models/Destination';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const region = searchParams.get('region');
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');

    // Build query
    const query: any = {};
    
    // Only add filters if they're not 'all'
    if (region && region !== 'all') {
      query.region = region;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (type && type !== 'all') {
      query.type = type;
    }
    
    if (tag && tag !== 'all') {
      query.tag = tag;
    }
    
    if (featured) {
      query.featured = featured === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { region: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate pagination
    const skip = (page - 1) * limit;
    
    // Get total count
    const total = await Destination.countDocuments(query);
    
    // Get destinations with pagination
    const destinations = await Destination.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      data: destinations,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching destinations:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch destinations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require admin authentication
    await requireAuthFromRequest(request, 'admin');

    await connectToDatabase();

    const body = await request.json();
    
    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug exists
    const existingDestination = await Destination.findOne({ slug: body.slug });
    if (existingDestination) {
      return NextResponse.json(
        { error: 'Destination with this slug already exists' },
        { status: 400 }
      );
    }

    const destination = await Destination.create({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      data: destination,
    });
  } catch (error: any) {
    console.error('Error creating destination:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create destination' },
      { status: 500 }
    );
  }
}