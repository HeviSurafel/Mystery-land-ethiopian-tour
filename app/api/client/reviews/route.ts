import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Booking from '@/models/Booking';
import Review from '@/models/Review';
import Tour from '@/models/Tour';
import Destination from '@/models/Destination';
import User from '@/models/User';
import mongoose from 'mongoose';

// GET - Fetch available items for review
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    // First, find the user's ObjectId
    let userObjectId = null;
    
    // Try by _id
    if (mongoose.Types.ObjectId.isValid(user.userId)) {
      userObjectId = new mongoose.Types.ObjectId(user.userId);
    } 
    
    // If not found, try by custom id or email
    if (!userObjectId) {
      const userDoc = await User.findOne({ 
        $or: [
          { id: user.userId },
          { email: user.email }
        ]
      }).lean();
      
      if (userDoc) {
        userObjectId = userDoc._id;
      }
    }

    if (!userObjectId) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Get user's completed and confirmed bookings
    const bookings = await Booking.find({
      user: userObjectId,
      bookingStatus: { $in: ['completed', 'confirmed'] }
    }).lean();

    // Get items user has already reviewed
    const reviewedItems = await Review.find({
      userId: user.userId
    }).distinct('itemId');

    // Get all tours to map IDs
    const allTours = await Tour.find({}).lean();
    
    // Create a map of tour string IDs to ObjectIds
    const tourMap = new Map();
    allTours.forEach(tour => {
      if (tour.id) {
        tourMap.set(tour.id, tour._id.toString());
      }
      if (tour._id) {
        tourMap.set(tour._id.toString(), tour._id.toString());
      }
    });

    // Filter out already reviewed items
    const availableItems = [];

    for (const booking of bookings) {
      // Check for tour
      if (booking.tour) {
        const tourObjectId = booking.tour.toString();
        
        // Find the tour to get its details
        const tour = await Tour.findById(tourObjectId).lean();
        
        if (tour) {
          // Check if this tour has been reviewed (check both string id and ObjectId)
          const tourStringId = tour.id || tour._id.toString();
          const isReviewed = reviewedItems.includes(tourStringId) || 
                            reviewedItems.includes(tour._id.toString());
          
          if (!isReviewed) {
            availableItems.push({
              id: tour._id.toString(),
              type: 'tour',
              name: tour.name,
              image: tour.images?.[0],
              date: booking.travelDate?.start,
              bookingId: booking._id.toString()
            });
          }
        }
      }
    }

    return NextResponse.json({
      success: true,
      data: availableItems,
      total: availableItems.length
    });

  } catch (error: any) {
    console.error('Error fetching available items:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch available items' },
      { status: 500 }
    );
  }
}

// POST - Create a new review
export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    await connectToDatabase();

    const data = await req.json();

    // Validate required fields
    if (!data.itemId || !data.itemType || !data.rating || !data.title || !data.content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate rating range
    if (data.rating < 1 || data.rating > 5) {
      return NextResponse.json(
        { success: false, error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Find the user's ObjectId
    let userObjectId = null;
    
    if (mongoose.Types.ObjectId.isValid(user.userId)) {
      userObjectId = new mongoose.Types.ObjectId(user.userId);
    } 
    
    if (!userObjectId) {
      const userDoc = await User.findOne({ 
        $or: [
          { id: user.userId },
          { email: user.email }
        ]
      }).lean();
      
      if (userDoc) {
        userObjectId = userDoc._id;
      }
    }

    if (!userObjectId) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if user has already reviewed this item
    const existingReview = await Review.findOne({
      userId: user.userId,
      itemId: data.itemId,
      itemType: data.itemType
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this item' },
        { status: 400 }
      );
    }

    // Check if user has booked this item
    let hasBooked = false;
    if (data.itemType === 'tour') {
      // First, find the tour by either ObjectId or string id
      let tourDoc = null;
      
      if (mongoose.Types.ObjectId.isValid(data.itemId)) {
        tourDoc = await Tour.findById(data.itemId).lean();
      }
      
      if (!tourDoc) {
        tourDoc = await Tour.findOne({ id: data.itemId }).lean();
      }

      if (tourDoc) {
        // Check for booking using the tour's ObjectId
        const booking = await Booking.findOne({
          user: userObjectId,
          tour: tourDoc._id, // Use ObjectId here
          bookingStatus: { $in: ['completed', 'confirmed'] }
        });
        hasBooked = !!booking;
      }
    }

    // Get user details
    const userDoc = await User.findById(userObjectId).lean();
    const userName = data.anonymous ? 'Anonymous' : (userDoc?.name || user.name);
    const userAvatar = data.anonymous ? null : (userDoc?.avatar || null);

    // Generate unique ID
    const reviewId = `rev_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create review
    const review = await Review.create({
      id: reviewId,
      userId: user.userId,
      userName: userName,
      userEmail: user.email,
      userAvatar: userAvatar,
      itemId: data.itemId,
      itemType: data.itemType,
      rating: data.rating,
      title: data.title,
      content: data.content,
      pros: data.pros || [],
      cons: data.cons || [],
      images: data.images || [],
      verified: hasBooked,
      status: 'pending',
      helpful: 0,
      helpfulBy: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Update tour's rating (if it's a tour review)
    if (data.itemType === 'tour') {
      await updateTourRating(data.itemId);
    }

    return NextResponse.json({
      success: true,
      data: {
        id: review._id.toString(),
        ...review.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error creating review:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'You have already reviewed this item' },
        { status: 400 }
      );
    }
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create review' },
      { status: 500 }
    );
  }
}

// Helper function to update tour rating
async function updateTourRating(tourId: string) {
  try {
    // Find the tour by either ObjectId or string id
    let tourDoc = null;
    
    if (mongoose.Types.ObjectId.isValid(tourId)) {
      tourDoc = await Tour.findById(tourId).lean();
    }
    
    if (!tourDoc) {
      tourDoc = await Tour.findOne({ id: tourId }).lean();
    }

    if (!tourDoc) return;

    const reviews = await Review.find({
      itemId: tourId,
      itemType: 'tour',
      status: 'published'
    });

    const averageRating = reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1);
    const reviewCount = reviews.length;

    // Update using the tour's ObjectId
    await Tour.findByIdAndUpdate(tourDoc._id, {
      rating: Math.round(averageRating * 10) / 10,
      reviewCount
    });
    
  } catch (error) {
    console.error('Error updating tour rating:', error);
  }
}