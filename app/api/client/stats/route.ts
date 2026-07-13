import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const now = new Date();

    // Get all user bookings
    const bookings = await Booking.find({
      $or: [
        { clientId: user.userId },
        { 'client.id': user.userId },
        { 'client.email': user.email }
      ]
    }).lean();

    // Get user data for wishlist count
    const userData = await User.findOne({ 
      $or: [
        { _id: user.userId },
        { id: user.userId },
        { email: user.email }
      ]
    }).lean();

    // Calculate stats
    const totalBookings = bookings.length;
    const upcoming = bookings.filter(b => 
      new Date(b.date) > now && b.status !== 'cancelled' && b.status !== 'completed'
    ).length;
    const completed = bookings.filter(b => b.status === 'completed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    const totalSpent = bookings.reduce((acc, b) => acc + (b.totalPrice || 0), 0);
    const wishlistCount = userData?.wishlist?.length || 0;

    // Get recent activity
    const recentBookings = bookings
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        totalBookings,
        upcoming,
        completed,
        cancelled,
        totalSpent,
        wishlistCount,
        recentBookings: recentBookings.map(b => ({
          id: b._id,
          tourName: b.tourName,
          date: b.date,
          status: b.status
        }))
      }
    });

  } catch (error: any) {
    console.error('Error fetching stats:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}