// app/api/admin/users/[userId]/verify/route.ts
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

    // Verify user
    targetUser.verified = true;
    targetUser.emailVerified = true;
    targetUser.updatedAt = new Date();
    await targetUser.save();

    return NextResponse.json({
      success: true,
      message: 'User verified successfully'
    });

  } catch (error: any) {
    console.error('Error verifying user:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify user' },
      { status: 500 }
    );
  }
}