import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
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

    // Find article by various ID formats
    let article = null;
    
    // Try by MongoDB _id
    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await BlogArticle.findById(id);
    }
    
    // Try by custom id field
    if (!article) {
      article = await BlogArticle.findOne({ id });
    }

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment likes and save to database
    article.likes = (article.likes || 0) + 1;
    await article.save();

    return NextResponse.json({
      success: true,
      data: {
        id: article._id.toString(),
        likes: article.likes
      }
    });

  } catch (error: any) {
    console.error('Error liking article:', error);
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to like article' },
      { status: 500 }
    );
  }
}