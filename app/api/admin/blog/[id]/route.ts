import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import BlogCategory from '@/models/BlogCategory';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
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

    const {id: articleId} = await params;

    const article = await BlogArticle.findOne({
      $or: [
        { _id: articleId },
        { id: articleId },
        { slug: articleId }
      ]
    }).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Get category details
    const category = article.category ? 
      await BlogCategory.findOne({ id: article.category }).lean() : null;

    return NextResponse.json({
      success: true,
      data: {
        id: article._id.toString(),
        _id: article._id.toString(),
        name: article.name,
        title: article.title || article.name,
        description: article.description,
        slug: article.slug,
        images: article.images || [],
        category: category || article.category,
        readTime: article.readTime,
        excerpt: article.excerpt,
        featured: article.featured || false,
        author: article.author,
        publishedAt: article.publishedAt,
        tags: article.tags || [],
        createdAt: article.createdAt,
        updatedAt: article.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error fetching article:', error);
    
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

export async function PATCH(
  req: NextRequest,
  { params }: { params:Promise< { id: string }> }
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

    const {id :articleId} = await params;
    const updates = await req.json();

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

    // Update fields
    Object.keys(updates).forEach(key => {
      article[key] = updates[key];
    });

    article.updatedAt = new Date();
    
    await article.save();

    return NextResponse.json({
      success: true,
      data: {
        id: article._id.toString(),
        ...article.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error updating article:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Article with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    const {id:articleId} = await params;

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

    await BlogArticle.deleteOne({ _id: article._id });

    return NextResponse.json({
      success: true,
      message: 'Article deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting article:', error);
    
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