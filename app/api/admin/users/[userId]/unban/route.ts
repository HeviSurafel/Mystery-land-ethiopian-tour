// app/api/admin/users/[userId]/unban/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await requireAuth('admin');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { userId } = await params;

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Unban user
    targetUser.banned = false;
    targetUser.status = 'active';
    targetUser.banReason = undefined;
    targetUser.bannedAt = undefined;
    targetUser.updatedAt = new Date();
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: 'User unbanned successfully'
    });

  } catch (error: any) {
    console.error('Error unbanning user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to unban user' },
      { status: 500 }
    );
  }
}