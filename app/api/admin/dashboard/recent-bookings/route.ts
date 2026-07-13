// app/api/admin/dashboard/recent-bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { requireAuthFromRequest } from '@/lib/auth';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');

    const recentBookings = await Booking.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .populate('user', 'name email')
      .populate('tour', 'name')
      .lean();

    const formattedBookings = recentBookings.map(booking => ({
      id: booking._id.toString().slice(-6).toUpperCase(),
      bookingId: booking.bookingNumber || booking._id.toString().slice(-8),
      user: {
        name: booking.user?.name || 'Anonymous',
        email: booking.user?.email || 'No email'
      },
      tour: booking.tour?.name || 'Unknown Tour',
      date: booking.createdAt,
      status: booking.status,
      paymentStatus: booking.paymentStatus,
      participants: booking.participants || 1,
      hasReview: !!booking.review,
      rating: booking.rating || null
    }));

    return NextResponse.json({
      success: true,
      data: formattedBookings
    });

  } catch (error: any) {
    console.error('Error fetching recent bookings:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recent bookings' },
      { status: 500 }
    );
  }
}