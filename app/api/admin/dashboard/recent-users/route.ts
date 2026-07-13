// app/api/admin/dashboard/recent-users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { requireAuthFromRequest } from '@/lib/auth';
import User from '@/models/User';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    const recentUsers = await User.find({ role: { $ne: 'admin' } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('name email createdAt lastActive isVerified status')
      .lean();

    // Get booking counts for each user
    const usersWithStats = await Promise.all(
      recentUsers.map(async (user) => {
        const bookingCount = await Booking.countDocuments({ user: user._id });
        const completedBookings = await Booking.countDocuments({ 
          user: user._id,
          status: 'completed'
        });
        const lastBooking = await Booking.findOne({ user: user._id })
          .sort({ createdAt: -1 })
          .select('createdAt');

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          avatar: user.avatar || null,
          joined: user.createdAt,
          lastActive: user.lastActive || user.createdAt,
          isVerified: user.isVerified || false,
          status: user.status || 'active',
          stats: {
            totalBookings: bookingCount,
            completedBookings,
            hasBooked: bookingCount > 0,
            lastBookingDate: lastBooking?.createdAt || null
          }
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: usersWithStats
    });

  } catch (error: any) {
    console.error('Error fetching recent users:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch recent users' },
      { status: 500 }
    );
  }
}