import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Booking from '@/models/Booking';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(
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

    const bookingId = (await params).id;

    const booking = await Booking.findById(bookingId);
    
    if (!booking) {
      return NextResponse.json(
        { success: false, error: 'Booking not found' },
        { status: 404 }
      );
    }

    // Optional: Check if booking can be deleted (e.g., not completed)
    if (booking.status === 'completed') {
      return NextResponse.json(
        { success: false, error: 'Cannot delete completed bookings' },
        { status: 400 }
      );
    }

    await Booking.findByIdAndDelete(bookingId);

    return NextResponse.json({
      success: true,
      message: 'Booking deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting booking:', error);
    
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