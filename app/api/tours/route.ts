// app/api/tours/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Tour from '@/models/Tour';

/**
 * Clean and transform tour data - fetch price directly from database
 */
function cleanTourData(tour: any) {
  return {
    _id: tour._id.toString(),
    id: tour.id || tour._id.toString(),
    name: tour.name || '',
    slug: tour.slug || '',
    description: tour.description || '',
    shortDescription: tour.shortDescription || '',
    duration: tour.duration || '',
    images: Array.isArray(tour.images) ? tour.images.filter(Boolean) : [],
    coordinates: tour.coordinates || {
      lat: 9.032,
      lng: 38.7468,
      city: 'Addis Ababa',
      region: 'Ethiopia'
    },
    groupSize: tour.groupSize || '',
    difficulty: tour.difficulty || 'Moderate',
    rating: typeof tour.rating === 'number' ? tour.rating : 4.8,
    reviewCount: tour.reviewCount || 0,
    featured: !!tour.featured,
    tag: tour.tag || '',
    highlights: Array.isArray(tour.highlights) ? tour.highlights : [],
    category: tour.category || tour.type || 'cultural',
    bestTime: Array.isArray(tour.bestTime) ? tour.bestTime : [],
    price: tour.price || 0, // Fetch price directly from database
    status: tour.status || 'active',
    departureDates: Array.isArray(tour.departureDates) ? tour.departureDates : [],
    isUnesco: tour.isUnesco || false
  };
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const sort = searchParams.get('sort') || 'featured';
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const duration = searchParams.get('duration');
    const minRating = searchParams.get('minRating');
    const destination = searchParams.get('destination');
    const search = searchParams.get('search');
    const featured = searchParams.get('featured');

    // Build filter
    const filter: any = { status: 'active' };
    
    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }
    
    // Category filter
    if (category && category !== 'all' && category !== '') {
      filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }
    
    // Difficulty filter
    if (difficulty && difficulty !== 'all' && difficulty !== '') {
      filter.difficulty = { $regex: new RegExp(`^${difficulty}$`, 'i') };
    }
    
    // Rating filter
    if (minRating && minRating !== 'all' && minRating !== '') {
      const ratingValue = parseFloat(minRating);
      if (!isNaN(ratingValue)) {
        filter.rating = { $gte: ratingValue };
      }
    }

    // Duration filter
    if (duration && duration !== 'all' && duration !== '') {
      const durationMap: { [key: string]: RegExp } = {
        '1-3': /^[1-3]/,
        '4-7': /^[4-7]/,
        '8-14': /^([8-9]|1[0-4])/,
        '15+': /^1[5-9]|^[2-9][0-9]/
      };
      if (durationMap[duration]) {
        filter.duration = durationMap[duration];
      }
    }

    // Handle search and destination filters with $or
    const orConditions: any[] = [];
    
    // Destination filter
    if (destination && destination !== '') {
      orConditions.push(
        { 'coordinates.region': { $regex: destination, $options: 'i' } },
        { 'coordinates.city': { $regex: destination, $options: 'i' } },
        { location: { $regex: destination, $options: 'i' } }
      );
    }

    // Search filter
    if (search && search !== '') {
      orConditions.push(
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { 'coordinates.city': { $regex: search, $options: 'i' } },
        { 'coordinates.region': { $regex: search, $options: 'i' } }
      );
    }

    // If there are $or conditions, add them to the filter
    if (orConditions.length > 0) {
      if (Object.keys(filter).length > 1) {
        filter.$and = [{ ...filter }, { $or: orConditions }];
        delete filter.$or;
      } else {
        filter.$or = orConditions;
      }
    }

    // Build sort
    let sortOption: any = {};
    switch(sort) {
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'duration-asc':
        sortOption = { duration: 1 };
        break;
      case 'duration-desc':
        sortOption = { duration: -1 };
        break;
      case 'name-asc':
        sortOption = { name: 1 };
        break;
      case 'name-desc':
        sortOption = { name: -1 };
        break;
      case 'featured':
      default:
        sortOption = { featured: -1, rating: -1 };
        break;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute queries with error handling
    let tours = [];
    let total = 0;
    
    try {
      // Remove any undefined or empty values from filter
      Object.keys(filter).forEach(key => {
        if (filter[key] === undefined || filter[key] === null || filter[key] === '') {
          delete filter[key];
        }
      });

      if (filter.$and && Array.isArray(filter.$and)) {
        filter.$and = filter.$and.filter((condition: any) => 
          condition && Object.keys(condition).length > 0
        );
        if (filter.$and.length === 0) {
          delete filter.$and;
        }
      }

      [tours, total] = await Promise.all([
        Tour.find(filter)
          .select('name slug description shortDescription duration images coordinates groupSize difficulty rating reviewCount featured tag highlights category bestTime price status departureDates isUnesco')
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .lean(),
        Tour.countDocuments(filter)
      ]);
    } catch (dbError) {
      console.error('Database query error:', dbError);
      const simpleFilter: any = { status: 'active' };
      if (featured === 'true') {
        simpleFilter.featured = true;
      }
      [tours, total] = await Promise.all([
        Tour.find(simpleFilter)
          .select('name slug description shortDescription duration images coordinates groupSize difficulty rating reviewCount featured tag highlights category bestTime price status departureDates isUnesco')
          .sort(sortOption)
          .skip(skip)
          .limit(limit)
          .lean(),
        Tour.countDocuments(simpleFilter)
      ]);
    }

    // Clean and transform the data - price comes directly from database
    const cleanedTours = tours.map(cleanTourData);

    // Calculate pagination
    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    return NextResponse.json({
      success: true,
      data: cleanedTours,
      pagination: {
        page,
        limit,
        total,
        pages: totalPages,
        hasMore,
        hasPrev: page > 1
      },
      filters: {
        category: category || null,
        difficulty: difficulty || null,
        duration: duration || null,
        minRating: minRating || null,
        destination: destination || null,
        search: search || null,
        featured: featured || null
      }
    });

  } catch (error: any) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch tours',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}