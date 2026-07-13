// app/api/admin/dashboard/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuthFromRequest } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthFromRequest(request, 'admin');

    const { searchParams } = new URL(request.url);
    const timeRange = searchParams.get('timeRange') || 'week';

    // Fetch all dashboard data in parallel
    const [stats, recentBookings, topTours, recentUsers, systemStatus] = await Promise.all([
      fetch(`${request.nextUrl.origin}/api/admin/dashboard/stats?timeRange=${timeRange}`).then(res => res.json()),
      fetch(`${request.nextUrl.origin}/api/admin/dashboard/recent-bookings?limit=10`).then(res => res.json()),
      fetch(`${request.nextUrl.origin}/api/admin/dashboard/top-tours?limit=5`).then(res => res.json()),
      fetch(`${request.nextUrl.origin}/api/admin/dashboard/recent-users?limit=5`).then(res => res.json()),
      fetch(`${request.nextUrl.origin}/api/admin/dashboard/system-status`).then(res => res.json())
    ]);

    return NextResponse.json({
      success: true,
      data: {
        stats: stats.data,
        recentBookings: recentBookings.data,
        topTours: topTours.data,
        recentUsers: recentUsers.data,
        systemStatus: systemStatus.data,
        timeRange,
        lastUpdated: new Date().toISOString()
      }
    });

  } catch (error: any) {
    console.error('Error fetching dashboard data:', error);

    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}