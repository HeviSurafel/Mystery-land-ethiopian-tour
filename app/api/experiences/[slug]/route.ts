// app/api/experiences/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Experience from '@/models/Experience';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const resolvedParams = await params;
    const slug = resolvedParams?.slug;
    
    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Experience slug is required' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Find experience by slug
    let experience = await Experience.findOne({ 
      slug: slug,
      status: 'active' 
    }).lean();

    // If not found by slug, try finding by ID
    if (!experience) {
      experience = await Experience.findOne({ 
        _id: slug,
        status: 'active' 
      }).lean();
    }

    // If still not found, try case-insensitive search
    if (!experience) {
      experience = await Experience.findOne({ 
        slug: { $regex: new RegExp(`^${slug}$`, 'i') },
        status: 'active' 
      }).lean();
    }

    if (!experience) {
      return NextResponse.json(
        { success: false, error: 'Experience not found' },
        { status: 404 }
      );
    }

    // Transform experience data
    const transformedExperience = {
      _id: experience._id.toString(),
      id: experience.id || experience._id.toString(),
      name: experience.name || '',
      slug: experience.slug || '',
      shortDescription: experience.shortDescription || '',
      description: experience.description || '',
      images: Array.isArray(experience.images) ? experience.images.filter(Boolean) : [],
      duration: experience.duration || '',
      location: experience.location || '',
      highlights: Array.isArray(experience.highlights) ? experience.highlights : [],
      included: Array.isArray(experience.included) ? experience.included : [],
      notIncluded: Array.isArray(experience.notIncluded) ? experience.notIncluded : [],
      bestTimeToVisit: experience.bestTimeToVisit || '',
      difficulty: experience.difficulty || 'Easy',
      category: experience.category || '',
      tag: experience.tag || '',
      featured: !!experience.featured,
      rating: experience.rating || 0,
      reviewCount: experience.reviewCount || 0,
      coordinates: experience.coordinates || null,
      languages: Array.isArray(experience.languages) ? experience.languages : [],
      groupSize: experience.groupSize || '',
      ageRange: experience.ageRange || '',
      whatToBring: Array.isArray(experience.whatToBring) ? experience.whatToBring : [],
      meetingPoint: experience.meetingPoint || '',
      startTimes: Array.isArray(experience.startTimes) ? experience.startTimes : [],
      culturalSignificance: experience.culturalSignificance || '',
      seasonalAvailability: experience.seasonalAvailability || '',
      price: experience.price || 0,
      status: experience.status || 'active',
      isUnesco: !!experience.isUnesco || !!experience.unesco,
      unesco: !!experience.unesco || !!experience.isUnesco,
    };

    return NextResponse.json({
      success: true,
      data: transformedExperience
    });

  } catch (error: any) {
    console.error('Error fetching experience:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch experience' },
      { status: 500 }
    );
  }
}