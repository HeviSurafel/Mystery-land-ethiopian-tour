import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get('status');
    const limit = parseInt(searchParams.get('limit') || '50');
    const page = parseInt(searchParams.get('page') || '1');
    const skip = (page - 1) * limit;

    // Build filter - using the actual field names from your model
    const filter: any = {
      $or: [
        { user: user.userId }, // The field is 'user' not 'clientId'
      ]
    };

    // Also try to find by email if userId doesn't match
    const userByEmail = await User.findOne({ email: user.email }).lean();
    if (userByEmail) {
      filter.$or.push({ user: userByEmail._id });
    }

    if (status && status !== 'all') {
      filter.bookingStatus = status; // The field is 'bookingStatus' not 'status'
    }

    console.log('Filter:', JSON.stringify(filter));

    // Get bookings
    const [bookings, totalCount] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 }) // Use 'createdAt' not 'date'
        .skip(skip)
        .limit(limit)
        .lean(),
      Booking.countDocuments(filter)
    ]);

    console.log(`Found ${bookings.length} bookings`);

    // Enrich booking data with tour and destination details
    const enrichedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let tourData = null;
        let destinationData = null;
        let guideData = null;

        // Get tour details - the field is 'tour' not 'tourId'
        if (booking.tour) {
          tourData = await Tour.findById(booking.tour).lean();
        }

        // Get destination details from tour if available
        if (tourData?.destinationId) {
          destinationData = await Destination.findOne({
            $or: [
              { _id: tourData.destinationId },
              { id: tourData.destinationId }
            ]
          }).lean();
        }

        // Get guide details if available (you might need to add this to your model)
        if (booking.guideId) {
          guideData = await User.findOne({
            $or: [
              { _id: booking.guideId },
              { id: booking.guideId }
            ]
          }).select('name avatar').lean();
        }

        // Calculate total travelers from numberOfTravelers
        const totalTravelers = (booking.numberOfTravelers?.adults || 0) + 
                               (booking.numberOfTravelers?.children || 0) + 
                               (booking.numberOfTravelers?.infants || 0);

        return {
          id: booking._id.toString(),
          _id: booking._id.toString(),
          bookingId: booking.bookingNumber || booking._id.toString(),
          bookingNumber: booking.bookingNumber,
          tour: {
            id: tourData?._id?.toString() || booking.tour?.toString(),
            name: tourData?.name || 'Unknown Tour',
            type: tourData?.type || 'unknown',
            image: tourData?.images?.[0] || '',
            duration: tourData?.duration,
            difficulty: tourData?.difficulty
          },
          destination: destinationData ? {
            name: destinationData.name,
            image: destinationData.images?.[0]
          } : undefined,
          date: booking.travelDate?.start?.toISOString() || booking.createdAt?.toISOString(),
          status: booking.bookingStatus || 'pending', // Map bookingStatus to status
          paymentStatus: booking.paymentStatus || 'pending',
          participants: totalTravelers || 1,
          totalPrice: booking.paymentDetails?.totalAmount, // You might need to add this
          guide: guideData ? {
            name: guideData.name,
            avatar: guideData.avatar,
            rating: guideData.rating
          } : undefined,
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: enrichedBookings,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}