// app/api/admin/dashboard/top-tours/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';

import { requireAuthFromRequest } from '@/lib/auth';
import Booking from '@/models/Booking';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get top tours by booking count
    const topTours = await Booking.aggregate([
      {
        $group: {
          _id: "$tour",
          bookings: { $sum: 1 },
          avgRating: { $avg: "$rating" },
          totalParticipants: { $sum: "$participants" },
          completedBookings: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] }
          }
        }
      },
      { $sort: { bookings: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "tours",
          localField: "_id",
          foreignField: "_id",
          as: "tourInfo"
        }
      },
      { $unwind: "$tourInfo" },
      {
        $project: {
          name: "$tourInfo.name",
          category: "$tourInfo.category",
          duration: "$tourInfo.duration",
          difficulty: "$tourInfo.difficulty",
          bookings: 1,
          avgRating: { $round: ["$avgRating", 1] },
          totalParticipants: 1,
          completionRate: {
            $round: [
              { $multiply: [{ $divide: ["$completedBookings", "$bookings"] }, 100] },
              0
            ]
          }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: topTours
    });

  } catch (error: any) {
    console.error('Error fetching top tours:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch top tours' },
      { status: 500 }
    );
  }
}