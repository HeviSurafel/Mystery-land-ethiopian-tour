// app/api/bookings/route.ts
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import Festival from '@/models/Festival';
import Experience from '@/models/Experience';
import User from '@/models/User';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

// Helper function to find item by type and ID
async function findItemByType(type: string, id: string) {
  const isValidObjectId = (id: string) => {
    return /^[0-9a-fA-F]{24}$/.test(id);
  };

  let item = null;
  let Model;

  switch (type) {
    case 'tour':
      Model = Tour;
      break;
    case 'destination':
      Model = Destination;
      break;
    case 'festival':
      Model = Festival;
      break;
    case 'experience':
      Model = Experience;
      break;
    default:
      return null;
  }

  // Try to find by MongoDB _id first
  if (isValidObjectId(id)) {
    item = await Model.findById(id).lean();
  }

  // If not found, try by custom id field
  if (!item) {
    item = await Model.findOne({ id: id }).lean();
  }

  // If still not found, try by slug
  if (!item) {
    item = await Model.findOne({ slug: id }).lean();
  }

  return item;
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    // Try to get logged in user
    const user = await getCurrentUserFromRequest(req);
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

    // Find the item
    const item = await findItemByType(data.itemType, data.itemId);
    
    if (!item) {
      return NextResponse.json(
        { success: false, error: `${data.itemType} not found` },
        { status: 404 }
      );
    }

    // Find or create user if logged in
    let userId = null;
    if (user) {
      userId = user.userId;
    } else {
      // Check if user exists with this email
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        userId = existingUser._id;
      }
    }

    // Generate unique ID
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Generate booking number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const dateStr = `${year}${month}${day}`;

    // Count bookings today to generate sequence
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const todayBookingsCount = await Booking.countDocuments({
      createdAt: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    });

    const sequence = (todayBookingsCount + 1).toString().padStart(4, '0');
    const bookingNumber = `BK${dateStr}${sequence}`;

    // Calculate end date based on item duration
    const startDate = new Date(data.preferredDate);
    const endDate = new Date(startDate);
    
    // Parse duration (e.g., "7 days", "2 weeks", "3 days")
    const durationMatch = item.duration?.match(/(\d+)/);
    const days = durationMatch ? parseInt(durationMatch[0]) : 1;
    endDate.setDate(endDate.getDate() + days);

    // Prepare the booking data structure
    const bookingData: any = {
      id: bookingId,
      bookingNumber: bookingNumber,
      
      // User reference (if available)
      user: userId,
      
      // Item references
      itemType: data.itemType,
      itemRef: item._id,
      
      // Keep backward compatibility
      tour: data.itemType === 'tour' ? item._id : null,
      destination: data.itemType === 'destination' ? item._id : null,
      festival: data.itemType === 'festival' ? item._id : null,
      experience: data.itemType === 'experience' ? item._id : null,
      
      // Item snapshot
      itemSnapshot: {
        name: item.name,
        type: data.itemType,
        duration: item.duration,
        location: item.location,
        image: item.images?.[0] || item.image,
        price: item.price,
        discount: item.discount
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
        children: 0,
        infants: 0
      },
      
      // Payment
      paymentStatus: 'pending',
      paymentMethod: 'bank_transfer',
      
      // Booking status
      bookingStatus: 'pending',
      
      // Special requests
      specialRequests: data.specialRequests || '',
      
      // Accommodation preference (if applicable)
      accommodations: data.accommodation ? [{
        type: data.accommodation === 'luxury' ? 'resort' : 
               data.accommodation === 'budget' ? 'lodge' : 'hotel',
        name: 'To be arranged',
        checkIn: startDate,
        checkOut: endDate,
        numberOfRooms: Math.ceil(data.travelers / 2)
      }] : [],
      
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
      
      // Inclusions/Exclusions from item
      inclusions: item.inclusions || [],
      exclusions: item.exclusions || [],
      
      // Cancellation policy
      cancellationPolicy: 'moderate'
    };

    // Create booking
    const booking = await Booking.create(bookingData);

    // Update item bookings count (if the field exists)
    try {
      const Model = getModelByType(data.itemType);
      if (Model) {
        await Model.findByIdAndUpdate(item._id, {
          $inc: { bookingsCount: 1 }
        });
      }
    } catch (err) {
      console.log('Could not update bookings count:', err);
    }

    // If user is logged in, update their bookings array
    if (userId) {
      await User.findByIdAndUpdate(userId, {
        $push: { bookings: booking._id }
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        bookingReference: booking.bookingNumber,
        bookingId: booking.id,
        guestName: booking.travelers[0]?.firstName + ' ' + booking.travelers[0]?.lastName,
        guestEmail: booking.travelers[0]?.email,
        preferredDate: booking.travelDate.start,
        travelers: booking.numberOfTravelers.adults,
        itemName: item.name,
        itemType: data.itemType,
        status: booking.bookingStatus,
      }
    });

  } catch (error: any) {
    console.error('Error creating booking:', error);
    
    // Handle validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create booking' },
      { status: 500 }
    );
  }
}

// Helper function to get model by type
function getModelByType(type: string) {
  switch (type) {
    case 'tour':
      return Tour;
    case 'destination':
      return Destination;
    case 'festival':
      return Festival;
    case 'experience':
      return Experience;
    default:
      return null;
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const user = await getCurrentUserFromRequest(req);
    const searchParams = req.nextUrl.searchParams;
    const email = searchParams.get('email');
    const reference = searchParams.get('reference');

    let query: any = {};

    // If user is logged in, show their bookings
    if (user) {
      query = { user: user.userId };
    } 
    // If email is provided (for guests), show bookings with that email
    else if (email) {
      query = { 'travelers.email': email };
    } 
    // If reference is provided, show specific booking
    else if (reference) {
      query = { bookingNumber: reference };
    } 
    else {
      return NextResponse.json(
        { success: false, error: 'Either login, provide email, or provide booking reference' },
        { status: 400 }
      );
    }

    const bookings = await Booking.find(query)
      .populate('itemRef')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return NextResponse.json({
      success: true,
      data: bookings.map(booking => ({
        id: booking._id.toString(),
        bookingReference: booking.bookingNumber,
        itemName: booking.itemSnapshot?.name || booking.itemRef?.name,
        itemType: booking.itemType,
        preferredDate: booking.travelDate?.start,
        travelers: booking.numberOfTravelers?.adults || 0,
        status: booking.bookingStatus,
        guestName: booking.travelers[0]?.firstName + ' ' + booking.travelers[0]?.lastName,
        createdAt: booking.createdAt,
      }))
    });

  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}