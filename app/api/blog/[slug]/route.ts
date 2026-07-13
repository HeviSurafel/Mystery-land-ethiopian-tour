//app/api/blog/[slug]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import BlogCategory from '@/models/BlogCategory';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  req: NextRequest,
  { params }: RouteParams
) {
  try {
    await connectToDatabase();

    const { slug } = await params;

    // Find article by slug
    const article = await BlogArticle.findOne({
      $or: [
        { slug },
        { id: slug },
        { _id: slug }
      ]
    }).lean();

    if (!article) {
      return NextResponse.json(
        { success: false, error: 'Article not found' },
        { status: 404 }
      );
    }

    // Increment view count
    await BlogArticle.findByIdAndUpdate(article._id, {
      $inc: { views: 1 }
    });

    // Get category details
    const category = await BlogCategory.findOne({ 
      $or: [
        { id: article.category },
        { _id: article.category }
      ]
    }).lean();

    // Get related articles (same category, exclude current)
    const relatedArticles = await BlogArticle.find({
      category: article.category,
      _id: { $ne: article._id },
      $or: [
        { status: 'published' },
        { publishedAt: { $lte: new Date() } }
      ]
    })
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();

    const now = new Date();
    const publishDate = article.publishedAt ? new Date(article.publishedAt) : null;
    const status = !publishDate ? 'draft' : (publishDate <= now ? 'published' : 'scheduled');

    // Transform article for response
    const transformedArticle = {
      id: article._id.toString(),
      _id: article._id.toString(),
      name: article.name,
      title: article.title || article.name,
      description: article.description,
      content: article.description,
      slug: article.slug,
      images: article.images || [],
      category: category ? {
        id: category.id || category._id.toString(),
        name: category.name,
        slug: category.slug
      } : {
        id: article.category,
        name: article.category,
        slug: article.category.toLowerCase().replace(/\s+/g, '-')
      },
      readTime: article.readTime,
      excerpt: article.excerpt || article.description?.substring(0, 160) + '...',
      featured: article.featured || false,
      author: article.author || 'We Travel Ethiopia Tours',
      publishedAt: article.publishedAt,
      tags: article.tags || [],
      views: (article.views || 0) + 1, // Include the increment
      likes: article.likes || 0,
      comments: article.comments || 0,
      status,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      coverImage: article.coverImage || article.images?.[0],
      relatedArticles: relatedArticles.map(rel => ({
        id: rel._id.toString(),
        title: rel.title || rel.name,
        slug: rel.slug,
        coverImage: rel.coverImage || rel.images?.[0],
        excerpt: rel.excerpt || rel.description?.substring(0, 100) + '...',
        publishedAt: rel.publishedAt
      }))
    };

    return NextResponse.json({
      success: true,
      data: transformedArticle
    });

  } catch (error: any) {
    console.error('Error fetching article:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch article' 
      },
      { status: 500 }
    );
  }
}