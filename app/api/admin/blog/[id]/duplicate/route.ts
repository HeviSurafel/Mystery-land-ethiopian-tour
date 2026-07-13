import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
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

    const articleId = (await params).id;

    const originalArticle = await BlogArticle.findOne({
      $or: [
        { _id: articleId },
        { id: articleId },
        { slug: articleId }
      ]
    }).lean();
    
    if (!originalArticle) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Create duplicate article
    const duplicateData: any = {};
    
    // Copy fields
    Object.keys(originalArticle).forEach(key => {
      if (!['_id', 'id', 'createdAt', 'updatedAt', 'publishedAt'].includes(key)) {
        duplicateData[key] = originalArticle[key];
      }
    });

    // Generate new id and slug
    duplicateData.id = `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    duplicateData.name = `${originalArticle.name} (Copy)`;
    if (originalArticle.title) {
      duplicateData.title = `${originalArticle.title} (Copy)`;
    }
    duplicateData.slug = `${originalArticle.slug}-copy-${Date.now()}`;
    duplicateData.publishedAt = undefined;

    const duplicatedArticle = await BlogArticle.create(duplicateData);

    return NextResponse.json({
      success: true,
      data: {
        id: duplicatedArticle._id,
        name: duplicatedArticle.name,
        slug: duplicatedArticle.slug
      }
    });

  } catch (error: any) {
    console.error('Error duplicating article:', error);
    
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