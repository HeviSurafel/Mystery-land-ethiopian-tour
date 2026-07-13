import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Booking from '@/models/Booking';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string } >}
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { paymentStatus } = await req.json();
    const bookingId = (await params).id;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    booking.paymentStatus = paymentStatus;
    
    // Add payment history
    if (!booking.paymentHistory) {
      booking.paymentHistory = [];
    }
    
    booking.paymentHistory.push({
      status: paymentStatus,
      changedBy: user.userId,
      changedAt: new Date()
    });

    await booking.save();

    return NextResponse.json({
      success: true,
      data: {
        id: booking._id.toString(),
        paymentStatus: booking.paymentStatus,
        updatedAt: booking.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error updating payment status:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}