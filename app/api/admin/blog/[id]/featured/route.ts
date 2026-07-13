import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { featured } = await req.json();
    const articleId = (await params).id;

    const article = await BlogArticle.findOne({
      $or: [
        { _id: articleId },
        { id: articleId },
        { slug: articleId }
      ]
    });
    
    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    article.featured = featured;
    article.updatedAt = new Date();
    await article.save();

    return NextResponse.json({
      success: true,
      data: {
        id: article._id,
        featured: article.featured
      }
    });

  } catch (error: any) {
    console.error('Error updating featured status:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}