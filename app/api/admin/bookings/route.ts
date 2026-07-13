import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import User from '@/models/User';
import Destination from '@/models/Destination';
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    // Check if user is authenticated and has admin/owner role
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const search = searchParams.get('search');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object based on actual schema
    const filter: any = {};

    // Map status to bookingStatus (since your schema uses bookingStatus)
    if (status && status !== 'all') {
      filter.bookingStatus = status;
    }

    if (paymentStatus && paymentStatus !== 'all') {
      filter.paymentStatus = paymentStatus;
    }

    // Date range filter (using travelDate.start instead of date)
    if (startDate || endDate) {
      filter['travelDate.start'] = {};
      if (startDate) filter['travelDate.start'].$gte = new Date(startDate);
      if (endDate) filter['travelDate.start'].$lte = new Date(endDate);
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      
      // First find users that match the search
      const matchingUsers = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex }
        ]
      }).distinct('_id');

      // Find tours that match the search
      const matchingTours = await Tour.find({
        $or: [
          { name: searchRegex },
          { id: searchRegex }
        ]
      }).distinct('_id');

      filter.$or = [
        { bookingNumber: searchRegex },
        { id: searchRegex },
        { user: { $in: matchingUsers } },
        { tour: { $in: matchingTours } },
        { specialRequests: searchRegex }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get bookings first without nested population
    const bookings = await Booking.find(filter)
      .populate({
        path: 'user',
        select: 'name email avatar'
      })
      .populate({
        path: 'tour',
        select: 'name type images duration difficulty destinationId id'
      })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count
    const totalCount = await Booking.countDocuments(filter);

    // Get stats
    const stats = await getBookingStats(filter);

    // Manually fetch destination data for each tour that has a destinationId
    const transformedBookings = await Promise.all(
      bookings.map(async (booking) => {
        let destinationData = null;
        
        // If the tour has a destinationId, fetch the destination
        if (booking.tour && booking.tour.destinationId) {
          try {
            // Try to find destination by MongoDB _id or custom id
            let destination = null;
            if (mongoose.Types.ObjectId.isValid(booking.tour.destinationId)) {
              destination = await Destination.findById(booking.tour.destinationId).lean();
            }
            if (!destination) {
              destination = await Destination.findOne({ id: booking.tour.destinationId }).lean();
            }
            
            if (destination) {
              destinationData = {
                _id: destination._id.toString(),
                name: destination.name,
                images: destination.images || []
              };
            }
          } catch (err) {
            console.error('Error fetching destination:', err);
          }
        }

        // Calculate total participants
        const totalParticipants = 
          (booking.numberOfTravelers?.adults || 0) + 
          (booking.numberOfTravelers?.children || 0) + 
          (booking.numberOfTravelers?.infants || 0);

        return {
          id: booking._id.toString(),
          _id: booking._id.toString(),
          bookingId: booking.bookingNumber || booking._id.toString().slice(-8).toUpperCase(),
          bookingNumber: booking.bookingNumber,
          client: {
            id: booking.user?._id?.toString() || '',
            name: booking.user?.name || 'Deleted User',
            email: booking.user?.email || '',
            avatar: booking.user?.avatar
          },
          tour: {
            id: booking.tour?._id?.toString() || '',
            name: booking.tour?.name || 'Deleted Tour',
            type: booking.tour?.type || 'unknown',
            image: booking.tour?.images?.[0],
            duration: booking.tour?.duration,
            difficulty: booking.tour?.difficulty
          },
          destination: destinationData ? {
            _id: destinationData._id,
            name: destinationData.name,
            images: destinationData.images
          } : undefined,
          date: booking.travelDate?.start || booking.createdAt,
          travelDate: booking.travelDate?.start,
          status: booking.bookingStatus || 'pending',
          paymentStatus: booking.paymentStatus || 'pending',
          createdAt: booking.createdAt,
          updatedAt: booking.updatedAt,
          participants: totalParticipants || 1,
          numberOfPeople: totalParticipants,
          notes: booking.specialRequests,
          specialRequests: booking.specialRequests,
          totalPrice: booking.paymentDetails?.totalAmount
        };
      })
    );

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    };

    return NextResponse.json({
      success: true,
      data: transformedBookings,
      pagination,
      stats
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
      { 
        success: false, 
        error: error.message || 'Failed to fetch bookings' 
      },
      { status: 500 }
    );
  }
}

async function getBookingStats(filter: any) {
  try {
    const stats = await Booking.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          pending: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'pending'] }, 1, 0] }
          },
          confirmed: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'confirmed'] }, 1, 0] }
          },
          completed: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'completed'] }, 1, 0] }
          },
          cancelled: {
            $sum: { $cond: [{ $eq: ['$bookingStatus', 'cancelled'] }, 1, 0] }
          }
        }
      }
    ]);

    if (stats.length > 0) {
      return {
        total: stats[0].total,
        pending: stats[0].pending,
        confirmed: stats[0].confirmed,
        completed: stats[0].completed,
        cancelled: stats[0].cancelled,
        totalRevenue: 0,
        averageBookingValue: 0,
        occupancyRate: 0
      };
    }

    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      occupancyRate: 0
    };
  } catch (error) {
    console.error('Error calculating stats:', error);
    return {
      total: 0,
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      totalRevenue: 0,
      averageBookingValue: 0,
      occupancyRate: 0
    };
  }
}