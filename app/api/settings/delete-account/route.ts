import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import Booking from '@/models/Booking';
import Review from '@/models/Review';
import bcrypt from 'bcryptjs';

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, error: 'Password is required' },
        { status: 400 }
      );
    }

    // Find user
    const userData = await User.findOne({
      $or: [
        { _id: user.userId },
        { id: user.userId },
        { email: user.email }
      ]
    });

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, userData.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, error: 'Password is incorrect' },
        { status: 401 }
      );
    }

    // Delete all user data in parallel
    await Promise.all([
      // Delete all bookings
      Booking.deleteMany({
        $or: [
          { clientId: user.userId },
          { 'client.id': user.userId },
          { 'client.email': user.email }
        ]
      }),
      
      // Delete all reviews
      Review.deleteMany({ userId: user.userId }),
      
      // Delete the user account
      User.deleteOne({ _id: userData._id })
    ]);

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting account:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete account' },
      { status: 500 }
    );
  }
}