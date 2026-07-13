// app/api/admin/users/[userId]/ban/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import User from '@/models/User';
import { requireAuth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const user = await requireAuth( 'owner');
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { userId } = await params;
    const { reason } = await request.json();

    // Check if target user exists
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Prevent banning owners
    if (targetUser.role === 'owner') {
      return NextResponse.json(
        { error: 'Cannot ban owner' },
        { status: 403 }
      );
    }

    // Prevent self-ban
    if (targetUser._id.toString() === user.userId.toString()) {
      return NextResponse.json(
        { error: 'Cannot ban yourself' },
        { status: 403 }
      );
    }

    // Ban user
    targetUser.banned = true;
    targetUser.status = 'banned';
    targetUser.banReason = reason || 'No reason provided';
    targetUser.bannedAt = new Date();
    targetUser.updatedAt = new Date();
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: 'User banned successfully'
    });

  } catch (error: any) {
    console.error('Error banning user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to ban user' },
      { status: 500 }
    );
  }
}