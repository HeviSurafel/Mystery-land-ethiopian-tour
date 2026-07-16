// app/api/experiences/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Experience from '@/models/Experience';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '12');
    const featured = searchParams.get('featured') === 'true';
    const category = searchParams.get('category');
    const search = searchParams.get('search');

    // Build filter
    const filter: any = { status: 'active' };
    
    if (featured) {
      filter.featured = true;
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { shortDescription: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch experiences
    const experiences = await Experience.find(filter)
      .sort({ rating: -1, featured: -1 })
      .limit(limit)
      .lean();

    // Transform data
    const transformedExperiences = experiences.map((exp: any) => ({
      _id: exp._id.toString(),
      id: exp.id || exp._id.toString(),
      name: exp.name || '',
      slug: exp.slug || '',
      shortDescription: exp.shortDescription || '',
      description: exp.description || '',
      images: Array.isArray(exp.images) ? exp.images.filter(Boolean) : [],
      duration: exp.duration || '',
      location: exp.location || '',
      highlights: Array.isArray(exp.highlights) ? exp.highlights : [],
      included: Array.isArray(exp.included) ? exp.included : [],
      notIncluded: Array.isArray(exp.notIncluded) ? exp.notIncluded : [],
      bestTimeToVisit: exp.bestTimeToVisit || '',
      difficulty: exp.difficulty || 'Easy',
      category: exp.category || '',
      tag: exp.tag || '',
      featured: !!exp.featured,
      rating: exp.rating || 0,
      reviewCount: exp.reviewCount || 0,
      coordinates: exp.coordinates || null,
      languages: Array.isArray(exp.languages) ? exp.languages : [],
      groupSize: exp.groupSize || '',
      ageRange: exp.ageRange || '',
      whatToBring: Array.isArray(exp.whatToBring) ? exp.whatToBring : [],
      meetingPoint: exp.meetingPoint || '',
      startTimes: Array.isArray(exp.startTimes) ? exp.startTimes : [],
      culturalSignificance: exp.culturalSignificance || '',
      seasonalAvailability: exp.seasonalAvailability || '',
      price: exp.price || 0,
      status: exp.status || 'active',
      isUnesco: !!exp.isUnesco || !!exp.unesco,
    }));

    return NextResponse.json({
      success: true,
      data: transformedExperiences,
      count: transformedExperiences.length,
    });

  } catch (error: any) {
    console.error('Error fetching experiences:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch experiences' },
      { status: 500 }
    );
  }
}