// app/api/admin/dashboard/stats/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';

import { requireAuthFromRequest } from '@/lib/auth';
import Tour from '@/models/Tour';
import Booking from '@/models/Booking';
import User from '@/models/User';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    // Calculate date ranges
    const now = new Date();
    let startDate = new Date();
    
    switch(timeRange) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get user stats
    const [totalUsers, newUsers] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ 
        role: { $ne: 'admin' },
        createdAt: { $gte: startDate }
      })
    ]);

    // Get booking stats
    const [totalBookings, pendingBookings, bookingsOverTime] = await Promise.all([
      Booking.countDocuments(),
      Booking.countDocuments({ status: 'pending' }),
      Booking.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate }
          }
        },
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
            },
            count: { $sum: 1 }
          }
        },
        { $sort: { "_id": 1 } }
      ])
    ]);

    // Get review stats
    const [totalReviews, averageRating] = await Promise.all([
      Booking.countDocuments({ review: { $exists: true, $ne: null } }),
      Booking.aggregate([
        { $match: { rating: { $exists: true, $ne: null } } },
        { $group: { _id: null, avg: { $avg: "$rating" } } }
      ])
    ]);

    // Get tour stats
    const [activeTours, completedTours, toursByCategory] = await Promise.all([
      Tour.countDocuments({ status: 'active' }),
      Booking.countDocuments({ 
        status: 'completed',
        createdAt: { $gte: startDate }
      }),
      Tour.aggregate([
        { $match: { status: 'active' } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ])
    ]);

    // Get user activity
    const [activeUsers, returningUsers] = await Promise.all([
      User.countDocuments({
        lastActive: { $gte: startDate }
      }),
      User.countDocuments({
        bookings: { $exists: true, $ne: [] },
        createdAt: { $lt: startDate }
      })
    ]);

    // Calculate completion rate
    const completedBookings = await Booking.countDocuments({ status: 'completed' });
    const completionRate = totalBookings > 0 
      ? Math.round((completedBookings / totalBookings) * 100) 
      : 0;

    return NextResponse.json({
      success: true,
      data: {
        // User Stats
        totalUsers,
        newUsers,
        activeUsers,
        returningUsers,
        
        // Booking Stats
        totalBookings,
        pendingBookings,
        completedBookings,
        bookingsOverTime,
        completionRate,
        
        // Review Stats
        totalReviews,
        averageRating: averageRating[0]?.avg || 0,
        
        // Tour Stats
        activeTours,
        completedTours,
        toursByCategory,
        
        // Metadata
        timeRange,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    if (error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard stats' },
      { status: 500 }
    );
  }
}