// app/api/inquiries/stats/route.ts
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Inquiry from '@/models/Inquiry';
import {emailService} from '@/lib/email/emailService';

export async function GET() {
  try {
    await connectToDatabase();
    
    const [
      total,
      newInquiries,
      replied,
      resolved,
      urgent,
      byType,
      byPriority
    ] = await Promise.all([
      Inquiry.countDocuments(),
      Inquiry.countDocuments({ status: 'new' }),
      Inquiry.countDocuments({ status: 'replied' }),
      Inquiry.countDocuments({ status: 'resolved' }),
      Inquiry.countDocuments({ priority: 'urgent' }),
      Inquiry.aggregate([
        { $group: { _id: '$inquiryType', count: { $sum: 1 } } }
      ]),
      Inquiry.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ])
    ]);

    // Get last 7 days trend
    const last7Days = await Inquiry.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 7))
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    return NextResponse.json({
      success: true,
      data: {
        total,
        new: newInquiries,
        replied,
        resolved,
        urgent,
        byType: byType.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        byPriority: byPriority.reduce((acc, item) => ({ ...acc, [item._id]: item.count }), {}),
        trend: last7Days
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch stats' },
      { status: 500 }
    );
  }
}