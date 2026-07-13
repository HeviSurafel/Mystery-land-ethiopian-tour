// app/api/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NotificationService } from '@/services/NotificationService';
import { getCurrentUserFromRequest } from '@/lib/auth';

// GET /api/notifications - Get user notifications
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const status = searchParams.get('status') as any || undefined;
    const type = searchParams.get('type') || undefined;

    const notifications = await NotificationService.getUserNotifications(user.userId, {
      limit,
      offset,
      status,
      type
    });

    return NextResponse.json({
      success: true,
      ...notifications
    });

  } catch (error: any) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PATCH /api/notifications - Mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const user = await getCurrentUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    
    if (body.markAllAsRead) {
      await NotificationService.markAllAsRead(user.userId);
    } else if (body.notificationId) {
      await NotificationService.markAsRead(body.notificationId, user.userId);
    }

    // Get updated unread count
    const { unreadCount } = await NotificationService.getUserNotifications(user.userId, {
      limit: 1,
      status: 'unread'
    });

    return NextResponse.json({
      success: true,
      unreadCount
    });

  } catch (error: any) {
    console.error('Error updating notifications:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}