import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Offer from '@/models/Offer';
import { requireAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort') || '-createdAt';

    // Build query
    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (featured !== null && featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Parse sort string (e.g., "-createdAt" for descending)
    const sortOptions: any = {};
    if (sort.startsWith('-')) {
      sortOptions[sort.substring(1)] = -1;
    } else {
      sortOptions[sort] = 1;
    }

    // Execute queries in parallel
    const [offers, total] = await Promise.all([
      Offer.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(),
      Offer.countDocuments(query)
    ]);

    return NextResponse.json({
      data: offers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error: any) {
    console.error('Error fetching offers:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch offers' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.shortDescription || !body.description || !body.validFrom || !body.validUntil || !body.category) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    if (!body.slug && body.name) {
      body.slug = body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }

    // Check if slug exists and make it unique if needed
    let slug = body.slug;
    let counter = 1;
    while (await Offer.findOne({ slug })) {
      slug = `${body.slug}-${counter}`;
      counter++;
    }
    body.slug = slug;

    // Generate custom offer ID if not provided
    if (!body.id) {
      const count = await Offer.countDocuments();
      body.id = `offer-${String(count + 1).padStart(3, '0')}`;
    }

    // Set defaults
    const offerData = {
      ...body,
      usageCount: 0,
      status: body.status || 'active',
      featured: body.featured || false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const offer = await Offer.create(offerData);

    return NextResponse.json({ data: offer }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating offer:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `Offer with this ${field} already exists` },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create offer' },
      { status: 500 }
    );
  }
}