import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogComment from '@/models/BlogComment';
import mongoose from 'mongoose';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase();

    const { id } = await params;

    // Find comment by various ID formats
    let comment = null;
    
    // Try by MongoDB _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      comment = await BlogComment.findById(id);
    }
    
    // Try by custom id field
    if (!comment) {
      comment = await BlogComment.findOne({ id });
    }

    if (!comment) {
      return NextResponse.json(
        { success: false, error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Increment likes and save to database
    comment.likes = (comment.likes || 0) + 1;
    await comment.save();

    return NextResponse.json({
      success: true,
      data: {
        id: comment._id.toString(),
        likes: comment.likes
      }
    });

  } catch (error: any) {
    console.error('Error liking comment:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to like comment' },
      { status: 500 }
    );
  }
}