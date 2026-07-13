import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';

export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const userData = await User.findOne({ 
      $or: [
        { _id: user.userId },
        { id: user.userId },
        { email: user.email }
      ]
    }).lean();

    if (!userData) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate additional stats
    const totalBookings = userData.bookings?.length || 0;
    const totalSpent = userData.bookings?.reduce((acc: number, booking: any) => 
      acc + (booking.totalPrice || 0), 0) || 0;
    const reviews = userData.reviews?.length || 0;

    return NextResponse.json({
      success: true,
      data: {
        id: userData._id.toString(),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '',
        avatar: userData.avatar || '',
        country: userData.country || '',
        memberSince: userData.createdAt,
        totalBookings,
        totalSpent,
        reviews
      }
    });

  } catch (error: any) {
    console.error('Error fetching profile:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const updates = await req.json();
    const userId = user.userId;

    // Fields that can be updated
    const allowedUpdates = ['name', 'phone', 'country', 'avatar'];
    const filteredUpdates: any = {};
    
    Object.keys(updates).forEach(key => {
      if (allowedUpdates.includes(key)) {
        filteredUpdates[key] = updates[key];
      }
    });

    const updatedUser = await User.findOneAndUpdate(
      { $or: [{ _id: userId }, { id: userId }] },
      { $set: filteredUpdates },
      { new: true }
    ).lean();

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone || '',
        avatar: updatedUser.avatar || '',
        country: updatedUser.country || ''
      }
    });

  } catch (error: any) {
    console.error('Error updating profile:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}