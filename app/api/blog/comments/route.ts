import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogComment from '@/models/BlogComment';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Get approved comments
    const comments = await BlogComment.find({
      articleId,
      status: { $in: ['approved', 'pending'] }
    })
      .sort({ createdAt: -1 })
      .lean();

    // Organize comments into a tree structure
    const commentMap = new Map();
    const rootComments: any[] = [];

    comments.forEach(comment => {
      commentMap.set(comment._id.toString(), {
        id: comment._id.toString(),
        articleId: comment.articleId,
        author: comment.author,
        content: comment.content,
        likes: comment.likes || 0,
        status: comment.status,
        createdAt: comment.createdAt,
        parentId: comment.parentId,
        replies: []
      });
    });

    comments.forEach(comment => {
      const commentId = comment._id.toString();
      const commentNode = commentMap.get(commentId);
      
      if (comment.parentId && commentMap.has(comment.parentId)) {
        commentMap.get(comment.parentId).replies.push(commentNode);
      } else if (!comment.parentId) {
        rootComments.push(commentNode);
      }
    });

    rootComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json({
      success: true,
      data: rootComments
    });

  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const data = await req.json();

    // Validate required fields
    if (!data.articleId) {
      return NextResponse.json(
        { success: false, error: 'Article ID is required' },
        { status: 400 }
      );
    }

    if (!data.content || !data.content.trim()) {
      return NextResponse.json(
        { success: false, error: 'Comment content is required' },
        { status: 400 }
      );
    }

    if (!data.authorName || !data.authorName.trim()) {
      return NextResponse.json(
        { success: false, error: 'Author name is required' },
        { status: 400 }
      );
    }

    if (!data.authorEmail || !data.authorEmail.trim()) {
      return NextResponse.json(
        { success: false, error: 'Author email is required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(data.authorEmail)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Create comment - let the model generate the id
    const commentData: any = {
      articleId: data.articleId,
      author: {
        name: data.authorName.trim(),
        email: data.authorEmail.trim(),
        avatar: data.authorAvatar || null,
      },
      content: data.content.trim(),
      likes: 0,
      status: 'pending',
    };

    // Add parentId if this is a reply
    if (data.parentId) {
      commentData.parentId = data.parentId;
    }

    const comment = await BlogComment.create(commentData);

    // Update article comment count (optional)
    try {
      const BlogArticle = (await import('@/models/BlogArticle')).default;
      await BlogArticle.findOneAndUpdate(
        { $or: [{ id: data.articleId }, { _id: data.articleId }] },
        { $inc: { comments: 1 } }
      );
    } catch (err) {
      console.error('Error updating comment count:', err);
      // Non-critical error, don't fail the request
    }

    return NextResponse.json({
      success: true,
      data: {
        id: comment._id.toString(),
        articleId: comment.articleId,
        author: comment.author,
        content: comment.content,
        likes: comment.likes,
        status: comment.status,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
      }
    });

  } catch (error: any) {
    console.error('Error creating comment:', error);
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: messages.join(', ') },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create comment' },
      { status: 500 }
    );
  }
}