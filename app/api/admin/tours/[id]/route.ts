// app/api/admin/tours/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Tour from '@/models/Tour';
import Booking from '@/models/Booking';
import { requireAuth } from '@/lib/auth';
import slugify from 'slugify';

const serializeDocument = (doc: any) => {
  if (!doc) return null;
  const obj = doc.toObject ? doc.toObject() : doc;
  return {
    ...obj,
    _id: obj._id?.toString(),
    id: obj._id?.toString(),
    createdAt: obj.createdAt?.toISOString(),
    updatedAt: obj.updatedAt?.toISOString(),
  };
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth('admin');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid tour ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const tour = await Tour.findById(id).lean();

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Get booking statistics
    const bookingStats = await Booking.aggregate([
      { $match: { tourId: tour._id } },
      {
        $group: {
          _id: null,
          totalBookings: { $sum: 1 },
          confirmedBookings: {
            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
          },
          totalRevenue: { $sum: '$totalAmount' },
          averageRating: { $avg: '$review.rating' }
        }
      }
    ]);

    const stats = bookingStats[0] || {
      totalBookings: 0,
      confirmedBookings: 0,
      totalRevenue: 0,
      averageRating: 0
    };

    const transformedTour = {
      _id: tour._id.toString(),
      id: tour._id.toString(),
      name: tour.name,
      slug: tour.slug,
      description: tour.description,
      shortDescription: tour.shortDescription,
      category: tour.category,
      duration: tour.duration,
      location: tour.location,
   
      groupSize: tour.groupSize,
      difficulty: tour.difficulty,
      rating: tour.rating || 0,
      reviewCount: tour.reviewCount || 0,
      images: tour.images || [],
      status: tour.status || 'inactive',
      featured: tour.featured || false,
      bookingsCount: stats.totalBookings,
      revenue: stats.totalRevenue,
      createdAt: tour.createdAt?.toISOString(),
      updatedAt: tour.updatedAt?.toISOString(),
      highlights: tour.highlights || [],
      itinerary: tour.itinerary || [],
      inclusions: tour.inclusions || [],
      exclusions: tour.exclusions || [],
      bestTime: tour.bestTime || [],
      departurePoint: tour.departurePoint,
      languages: tour.languages || [],
      coordinates: tour.coordinates,
      metaTitle: tour.metaTitle,
      metaDescription: tour.metaDescription,
      faqs: tour.faqs || [],
      stats
    };

    return NextResponse.json({
      success: true,
      data: transformedTour
    });

  } catch (error: any) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuth('admin');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = await params;

    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid tour ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const tour = await Tour.findById(id);
    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    const updates = await request.json();

    // Handle slug update if name changed
    if (updates.name && updates.name !== tour.name) {
      const baseSlug = slugify(updates.name, { lower: true, strict: true });
      let slug = baseSlug;
      let counter = 1;

      while (await Tour.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      updates.slug = slug;
    }

    // Remove fields that shouldn't be updated directly
    delete updates._id;
    delete updates.id;
    delete updates.createdAt;
    delete updates.bookingsCount;
    delete updates.revenue;
    delete updates.reviewCount;

    updates.updatedAt = new Date();

    const updatedTour = await Tour.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      data: serializeDocument(updatedTour),
      message: 'Tour updated successfully'
    });

  } catch (error: any) {
    console.error('Error updating tour:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'A tour with this name already exists' },
        { status: 409 }
      );
    }

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation failed', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update tour' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const {id} = resolvedParams
    console.log(`Deleting tour with ID: ${id}`);
    const user = await requireAuth('admin');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }



    if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
      return NextResponse.json(
        { error: 'Invalid tour ID format' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    const tour = await Tour.findById(id);
    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Check if tour has any bookings
    const hasBookings = await Booking.exists({ tourId: id });
    if (hasBookings) {
      return NextResponse.json(
        { error: 'Cannot delete tour with existing bookings' },
        { status: 400 }
      );
    }

    await Tour.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: 'Tour deleted successfully',
      data: { id }
    });

  } catch (error: any) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to delete tour' },
      { status: 500 }
    );
  }
}