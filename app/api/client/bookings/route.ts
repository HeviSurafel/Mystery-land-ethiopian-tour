// app/api/bookings/route.ts
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
        { user: user.userId },
        { 'travelers.email': user.email }
      ]
    };

    // Also try to find by email if userId doesn't match
    const userByEmail = await User.findOne({ email: user.email }).lean();
    if (userByEmail) {
      filter.$or.push({ user: userByEmail._id });
    }

    if (status && status !== 'all') {
      filter.bookingStatus = status;
    }

    console.log('Filter:', JSON.stringify(filter));

    // Get bookings
    const [bookings, totalCount] = await Promise.all([
      Booking.find(filter)
        .sort({ createdAt: -1 })
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

        // Get tour details
        if (booking.tour) {
          tourData = await Tour.findById(booking.tour).lean();
        }

        // Also try to get from itemRef if tour is not found
        if (!tourData && booking.itemRef && booking.itemType === 'tour') {
          tourData = await Tour.findById(booking.itemRef).lean();
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

        // Get guide details if available
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

        // Get item name from snapshot or tour data
        const itemName = booking.itemSnapshot?.name || 
                         tourData?.name || 
                         booking.itemSnapshot?.itemName || 
                         'Unknown Item';

        // Get price from pricing or snapshot
        const totalPrice = booking.pricing?.totalAmount || 
                          booking.itemSnapshot?.totalPrice || 
                          booking.itemSnapshot?.price || 
                          0;

        const pricePerPerson = booking.itemSnapshot?.pricePerPerson || 
                              booking.itemSnapshot?.price || 
                              0;

        return {
          id: booking._id.toString(),
          _id: booking._id.toString(),
          bookingId: booking.bookingNumber || booking._id.toString(),
          bookingNumber: booking.bookingNumber,
          itemType: booking.itemType || 'tour',
          itemName: itemName,
          tour: {
            id: tourData?._id?.toString() || booking.tour?.toString() || booking.itemRef?.toString(),
            name: tourData?.name || itemName,
            type: tourData?.type || booking.itemType || 'unknown',
            image: tourData?.images?.[0] || booking.itemSnapshot?.image || '',
            duration: tourData?.duration || booking.itemSnapshot?.duration,
            difficulty: tourData?.difficulty
          },
          destination: destinationData ? {
            name: destinationData.name,
            image: destinationData.images?.[0]
          } : undefined,
          date: booking.travelDate?.start?.toISOString() || booking.createdAt?.toISOString(),
          status: booking.bookingStatus || 'pending',
          paymentStatus: booking.paymentStatus || 'pending',
          participants: totalTravelers || 1,
          totalPrice: totalPrice,
          pricePerPerson: pricePerPerson,
          depositAmount: booking.pricing?.depositAmount || booking.itemSnapshot?.deposit || 0,
          preferredDate: booking.travelDate?.start,
          endDate: booking.travelDate?.end,
          guide: guideData ? {
            name: guideData.name,
            avatar: guideData.avatar,
            rating: guideData.rating
          } : undefined,
          specialRequests: booking.specialRequests || '',
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

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const data = await req.json();

    // Validate required fields
    const requiredFields = [
      'fullName', 'email', 'phone', 'country', 
      'preferredDate', 'travelers', 'itemId', 'itemName', 'itemType'
    ];
    
    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json(
          { success: false, error: `${field} is required` },
          { status: 400 }
        );
      }
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate item type
    const validTypes = ['tour', 'destination', 'festival', 'experience'];
    if (!validTypes.includes(data.itemType)) {
      return NextResponse.json(
        { success: false, error: 'Invalid item type' },
        { status: 400 }
      );
    }

    // Generate unique ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate booking number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    const bookingNumber = `BK${dateStr}${random}`;

    // Calculate end date based on duration
    const startDate = new Date(data.preferredDate);
    const endDate = new Date(startDate);
    const days = data.durationDays || 1;
    endDate.setDate(endDate.getDate() + days);

    // Calculate pricing - NO TAX, NO SERVICE FEE
    const pricePerPerson = data.price || 0;
    const travelersCount = data.travelers || 1;
    const totalAmount = pricePerPerson * travelersCount;
    const depositPercentage = 20;
    const depositAmount = (totalAmount * depositPercentage) / 100;

    // Prepare the booking data structure
    const bookingData: any = {
      id: bookingId,
      bookingNumber: bookingNumber,
      
      // User reference
      user: user.userId,
      
      // Item references
      itemType: data.itemType,
      itemRef: data.itemId,
      
      // Keep backward compatibility
      tour: data.itemType === 'tour' ? data.itemId : null,
      destination: data.itemType === 'destination' ? data.itemId : null,
      
      // Item snapshot with price
      itemSnapshot: {
        name: data.itemName,
        type: data.itemType,
        duration: data.duration || '',
        location: data.location || 'Ethiopia',
        image: data.image || null,
        price: pricePerPerson,
        pricePerPerson: pricePerPerson,
        currency: 'USD',
        totalPrice: totalAmount,
        deposit: depositAmount,
        depositPercentage: depositPercentage,
        discount: data.discount || null
      },
      
      // Pricing details - NO TAX, NO SERVICE FEE
      pricing: {
        subtotal: totalAmount,
        tax: 0,
        serviceFee: 0,
        discountAmount: 0,
        discountType: null,
        discountCode: null,
        depositAmount: depositAmount,
        totalAmount: totalAmount,
        currency: 'USD'
      },
      
      // Booking dates
      bookingDate: new Date(),
      travelDate: {
        start: startDate,
        end: endDate
      },
      
      // Travelers
      numberOfTravelers: {
        adults: data.travelers,
        children: data.children || 0,
        infants: data.infants || 0
      },
      
      // Payment
      paymentStatus: 'pending',
      paymentMethod: data.paymentMethod || 'bank_transfer',
      
      // Booking status
      bookingStatus: 'pending',
      
      // Special requests
      specialRequests: data.specialRequests || '',
      
      // Travelers details
      travelers: [{
        firstName: data.fullName.split(' ')[0] || data.fullName,
        lastName: data.fullName.split(' ').slice(1).join(' ') || 'Guest',
        dateOfBirth: null,
        nationality: data.country,
        passportNumber: '',
        passportExpiry: null,
        email: data.email,
        phone: data.phone,
        dietaryRestrictions: '',
        medicalConditions: ''
      }],
      
      // Emergency contact
      emergencyContact: {
        name: data.fullName,
        relationship: 'Self',
        phone: data.phone,
        email: data.email
      },
      
      // Metadata
      metadata: {
        source: 'website',
        ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
        userAgent: req.headers.get('user-agent') || 'unknown'
      },
      
      // Cancellation policy
      cancellationPolicy: data.cancellationPolicy || 'moderate'
    };

    // Create booking
    const booking = await Booking.create(bookingData);

    // If user is logged in, update their bookings array
    await User.findByIdAndUpdate(user.userId, {
      $push: { bookings: booking._id }
    });

    return NextResponse.json({
      success: true,
      data: {
        bookingReference: booking.bookingNumber,
        bookingId: booking.id,
        guestName: booking.travelers[0]?.firstName + ' ' + booking.travelers[0]?.lastName,
        guestEmail: booking.travelers[0]?.email,
        preferredDate: booking.travelDate.start,
        travelers: booking.numberOfTravelers.adults,
        itemName: data.itemName,
        itemType: data.itemType,
        status: booking.bookingStatus,
        totalAmount: totalAmount,
        depositAmount: depositAmount,
        pricePerPerson: pricePerPerson,
      }
    });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const data = await req.json();
    const { bookingId, status, paymentStatus, notes } = data;

    if (!bookingId) {
      return NextResponse.json(
        { success: false, error: 'Booking ID is required' },
        { status: 400 }
      );
    }

    // Find the booking
    const booking = await Booking.findOne({ 
      $or: [
        { id: bookingId },
        { bookingNumber: bookingId },
        { _id: bookingId }
      ]
    });
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update
    const isOwner = booking.user && booking.user.toString() === user.userId;
    const isAdmin = user.role === 'admin' || user.role === 'owner';
    
    if (!isOwner && !isAdmin) {
      return NextResponse.json(
        { success: false, error: 'You do not have permission to update this booking' },
        { status: 403 }
      );
    }

    // Update fields
    if (status) {
      booking.bookingStatus = status;
      // If status is cancelled, update payment status
      if (status === 'cancelled') {
        booking.paymentStatus = 'cancelled';
      }
    }

    if (paymentStatus) {
      booking.paymentStatus = paymentStatus;
    }

    if (notes) {
      booking.notes = notes;
    }

    await booking.save();

    return NextResponse.json({
      success: true,
      data: {
        id: booking.id,
        bookingReference: booking.bookingNumber,
        status: booking.bookingStatus,
        paymentStatus: booking.paymentStatus,
        updatedAt: booking.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error updating booking:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update booking' },
      { status: 500 }
    );
  }
}