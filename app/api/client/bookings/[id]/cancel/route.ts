import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';

export async function POST(
  req: NextRequest,
  { params }: { params:Promise< { id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const { id: bookingId } = await params;
    const { reason } = await req.json();

    const booking = await Booking.findOne({
      $or: [
        { _id: bookingId },
        { id: bookingId },
        { bookingId: bookingId },
        { bookingNumber: bookingId }
      ]
    });

    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Verify that this booking belongs to the user
    const isOwner = booking.clientId === user.userId || 
                   booking.client?.id === user.userId ||
                   booking.client?.email === user.email;

    if (!isOwner) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 403 }
      );
    }

    // Check if booking can be cancelled
    if (booking.status === 'cancelled') {
      return NextResponse.json(
        { success: false, error: 'Booking is already cancelled' },
        { status: 400 }
      );
    }

    if (booking.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot cancel completed booking' },
        { status: 400 }
      );
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.cancelledAt = new Date();
    booking.cancelledBy = user.userId;
    booking.cancellationReason = reason || 'Cancelled by customer';
    
    // Add to status history
    if (!booking.statusHistory) {
      booking.statusHistory = [];
    }
    booking.statusHistory.push({
      status: 'cancelled',
      changedBy: user.userId,
      changedAt: new Date(),
      reason: reason || 'Cancelled by customer'
    });

    await booking.save();

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