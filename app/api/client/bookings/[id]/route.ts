// app/api/bookings/[id]/route.ts
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import User from '@/models/User';
import mongoose from 'mongoose';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    console.log('User authenticated:', { userId: user.userId, email: user.email });
    
    await connectToDatabase();

    const { id: bookingId } = await params;
    console.log('Looking for booking with ID:', bookingId);

    // Try different lookup methods
    let booking = null;

    // Method 1: Try by custom id field (matches your document's "id" field)
    booking = await Booking.findOne({ id: bookingId }).lean();
    if (booking) console.log('Found by custom id field');

    // Method 2: Try by bookingNumber
    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: bookingId }).lean();
      if (booking) console.log('Found by bookingNumber');
    }

    // Method 3: Try by MongoDB _id (if it's a valid ObjectId)
    if (!booking && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId).lean();
      if (booking) console.log('Found by MongoDB _id');
    }

    if (!booking) {
      console.log('Booking not found with any method');
      
      // List user's bookings to help debug
      const userBookings = await Booking.find({ 
        $or: [
          { user: user.userId },
          { user: new mongoose.Types.ObjectId(user.userId) }
        ]
      })
      .select('_id id bookingNumber user')
      .lean();
      
      console.log('User bookings:', userBookings.map(b => ({
        _id: b._id.toString(),
        id: b.id,
        bookingNumber: b.bookingNumber
      })));

      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify ownership - check by user field
    const userObjectId = await getUserObjectId(user.userId, user.email);
    const bookingUserId = booking.user ? booking.user.toString() : null;
    
    if (!userObjectId || bookingUserId !== userObjectId.toString()) {
      console.log('Ownership verification failed:', {
        bookingUserId,
        userObjectId: userObjectId?.toString()
      });
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Get tour details
    let tourData = null;
    if (booking.tour) {
      tourData = await Tour.findById(booking.tour).lean();
    }

    // Also try itemRef if tour not found
    if (!tourData && booking.itemRef && booking.itemType === 'tour') {
      tourData = await Tour.findById(booking.itemRef).lean();
    }

    // Get destination details
    let destinationData = null;
    if (tourData?.destinationId) {
      destinationData = await Destination.findOne({
        $or: [
          { _id: tourData.destinationId },
          { id: tourData.destinationId }
        ]
      }).lean();
    }

    // Calculate total travelers
    const totalTravelers = (booking.numberOfTravelers?.adults || 0) + 
                           (booking.numberOfTravelers?.children || 0) + 
                           (booking.numberOfTravelers?.infants || 0);

    // Calculate duration in days
    let durationDays = 0;
    if (booking.travelDate?.start && booking.travelDate?.end) {
      const start = new Date(booking.travelDate.start);
      const end = new Date(booking.travelDate.end);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      durationDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    // Get pricing information
    const pricePerPerson = booking.itemSnapshot?.pricePerPerson || 
                          booking.itemSnapshot?.price || 
                          booking.pricing?.pricePerPerson || 
                          0;

    const subtotal = booking.pricing?.subtotal || 
                    (pricePerPerson * totalTravelers) || 
                    0;

    const totalAmount = booking.pricing?.totalAmount || 
                       booking.itemSnapshot?.totalPrice || 
                       subtotal || 
                       0;

    const depositAmount = booking.pricing?.depositAmount || 
                         booking.itemSnapshot?.deposit || 
                         (totalAmount * 0.2) || 
                         0;

    const taxAmount = booking.pricing?.tax || 0;
    const serviceFee = booking.pricing?.serviceFee || 0;
    const discountAmount = booking.pricing?.discountAmount || 0;

    const responseData = {
      id: booking._id.toString(),
      _id: booking._id.toString(),
      bookingNumber: booking.bookingNumber,
      bookingId: booking.id || booking._id.toString(),
      
      // Pricing Information
      pricing: {
        pricePerPerson: pricePerPerson,
        subtotal: subtotal,
        tax: taxAmount,
        serviceFee: serviceFee,
        discountAmount: discountAmount,
        totalAmount: totalAmount,
        depositAmount: depositAmount,
        depositPercentage: booking.itemSnapshot?.depositPercentage || 20,
        currency: booking.pricing?.currency || 'USD'
      },
      
      // Item Snapshot
      itemSnapshot: {
        name: booking.itemSnapshot?.name || tourData?.name || 'Unknown Item',
        type: booking.itemSnapshot?.type || booking.itemType || 'tour',
        duration: booking.itemSnapshot?.duration || tourData?.duration || '',
        location: booking.itemSnapshot?.location || 'Ethiopia',
        image: booking.itemSnapshot?.image || tourData?.images?.[0] || null,
        price: booking.itemSnapshot?.price || pricePerPerson,
        pricePerPerson: booking.itemSnapshot?.pricePerPerson || pricePerPerson,
        currency: booking.itemSnapshot?.currency || 'USD',
        totalPrice: booking.itemSnapshot?.totalPrice || totalAmount,
        deposit: booking.itemSnapshot?.deposit || depositAmount,
        depositPercentage: booking.itemSnapshot?.depositPercentage || 20,
        discount: booking.itemSnapshot?.discount || null
      },
      
      tour: {
        id: tourData?._id?.toString() || booking.tour?.toString(),
        name: tourData?.name || booking.itemSnapshot?.name || 'Unknown Tour',
        description: tourData?.description || '',
        type: tourData?.type || 'unknown',
        images: tourData?.images || [],
        duration: tourData?.duration || booking.itemSnapshot?.duration || '',
        difficulty: tourData?.difficulty || 'Moderate',
        highlights: tourData?.highlights || [],
        inclusions: booking.inclusions || tourData?.inclusions || [],
        exclusions: booking.exclusions || tourData?.exclusions || [],
        itinerary: tourData?.itinerary || []
      },
      
      destination: destinationData ? {
        id: destinationData._id?.toString(),
        name: destinationData.name,
        description: destinationData.description,
        images: destinationData.images,
        location: destinationData.location
      } : undefined,
      
      travelDate: {
        start: booking.travelDate?.start,
        end: booking.travelDate?.end
      },
      
      numberOfTravelers: {
        adults: booking.numberOfTravelers?.adults || 0,
        children: booking.numberOfTravelers?.children || 0,
        infants: booking.numberOfTravelers?.infants || 0
      },
      
      bookingStatus: booking.bookingStatus || 'pending',
      paymentStatus: booking.paymentStatus || 'pending',
      paymentMethod: booking.paymentMethod || 'bank_transfer',
      
      specialRequests: booking.specialRequests || '',
      
      travelers: booking.travelers || [],
      
      emergencyContact: booking.emergencyContact || {
        name: '',
        relationship: '',
        phone: '',
        email: ''
      },
      
      accommodations: booking.accommodations || [],
      
      cancellationPolicy: booking.cancellationPolicy || 'moderate',
      
      createdAt: booking.createdAt,
      updatedAt: booking.updatedAt,
      
      totalTravelers,
      durationDays
    };

    return NextResponse.json({
      success: true,
      data: responseData
    });

  } catch (error: any) {
    console.error('Error in booking details API:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch booking' },
      { status: 500 }
    );
  }
}

// PUT - Update booking
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    await connectToDatabase();

    const { id: bookingId } = await params;
    const data = await req.json();

    // Find the booking
    let booking = await Booking.findOne({ id: bookingId }).lean();

    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: bookingId }).lean();
    }

    if (!booking && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId).lean();
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const userObjectId = await getUserObjectId(user.userId, user.email);
    const bookingUserId = booking.user ? booking.user.toString() : null;
    const isAdmin = user.role === 'admin' || user.role === 'owner';
    
    if (!isAdmin && (!userObjectId || bookingUserId !== userObjectId.toString())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Update fields
    const updateFields: any = {};

    if (data.status) {
      updateFields.bookingStatus = data.status;
      if (data.status === 'cancelled') {
        updateFields.paymentStatus = 'cancelled';
      }
    }

    if (data.paymentStatus) {
      updateFields.paymentStatus = data.paymentStatus;
    }

    if (data.paymentMethod) {
      updateFields.paymentMethod = data.paymentMethod;
    }

    if (data.specialRequests) {
      updateFields.specialRequests = data.specialRequests;
    }

    if (data.travelDate) {
      updateFields['travelDate.start'] = data.travelDate.start;
      updateFields['travelDate.end'] = data.travelDate.end;
    }

    if (data.numberOfTravelers) {
      updateFields['numberOfTravelers.adults'] = data.numberOfTravelers.adults;
      updateFields['numberOfTravelers.children'] = data.numberOfTravelers.children || 0;
      updateFields['numberOfTravelers.infants'] = data.numberOfTravelers.infants || 0;
    }

    if (data.notes) {
      updateFields.notes = data.notes;
    }

    if (data.cancellationPolicy) {
      updateFields.cancellationPolicy = data.cancellationPolicy;
    }

    updateFields.updatedAt = new Date();

    const updatedBooking = await Booking.findOneAndUpdate(
      { _id: booking._id },
      { $set: updateFields },
      { new: true, lean: true }
    );

    return NextResponse.json({
      success: true,
      data: {
        id: updatedBooking.id,
        bookingNumber: updatedBooking.bookingNumber,
        status: updatedBooking.bookingStatus,
        paymentStatus: updatedBooking.paymentStatus,
        updatedAt: updatedBooking.updatedAt
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

// DELETE - Cancel booking
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    await connectToDatabase();

    const { id: bookingId } = await params;

    // Find the booking
    let booking = await Booking.findOne({ id: bookingId }).lean();

    if (!booking) {
      booking = await Booking.findOne({ bookingNumber: bookingId }).lean();
    }

    if (!booking && mongoose.Types.ObjectId.isValid(bookingId)) {
      booking = await Booking.findById(bookingId).lean();
    }

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    const userObjectId = await getUserObjectId(user.userId, user.email);
    const bookingUserId = booking.user ? booking.user.toString() : null;
    const isAdmin = user.role === 'admin' || user.role === 'owner';
    
    if (!isAdmin && (!userObjectId || bookingUserId !== userObjectId.toString())) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Soft delete - update status to cancelled
    await Booking.findOneAndUpdate(
      { _id: booking._id },
      { 
        $set: { 
          bookingStatus: 'cancelled',
          paymentStatus: 'cancelled',
          updatedAt: new Date()
        } 
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Booking cancelled successfully'
    });

  } catch (error: any) {
    console.error('Error cancelling booking:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to cancel booking' },
      { status: 500 }
    );
  }
}

// Helper function to get user ObjectId
async function getUserObjectId(userId: string, email: string) {
  try {
    // Try by _id first
    if (mongoose.Types.ObjectId.isValid(userId)) {
      const user = await User.findById(userId).lean();
      if (user) return user._id;
    }
    
    // Try by custom id field
    const userById = await User.findOne({ id: userId }).lean();
    if (userById) return userById._id;
    
    // Try by email
    const userByEmail = await User.findOne({ email }).lean();
    if (userByEmail) return userByEmail._id;
    
    return null;
  } catch (error) {
    console.error('Error finding user:', error);
    return null;
  }
}