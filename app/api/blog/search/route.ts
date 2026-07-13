import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import BlogCategory from '@/models/BlogCategory';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const searchParams = req.nextUrl.searchParams;
    const q = searchParams.get('q');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!q) {
      return NextResponse.json(
        { success: false, error: 'Search query is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;
    const now = new Date();
    const searchRegex = new RegExp(q, 'i');

    // Search in title, content, excerpt, author, tags
    const filter = {
      $and: [
        {
          $or: [
            { status: 'published' },
            { publishedAt: { $lte: now } }
          ]
        },
        {
          $or: [
            { title: searchRegex },
            { name: searchRegex },
            { description: searchRegex },
            { excerpt: searchRegex },
            { content: searchRegex },
            { author: searchRegex },
            { tags: searchRegex }
          ]
        }
      ]
    };

    const [articles, totalCount] = await Promise.all([
      BlogArticle.find(filter)
        .sort({ publishedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      BlogArticle.countDocuments(filter)
    ]);

    // Get categories for mapping
    const categories = await BlogCategory.find({}).lean();
    const categoryMap = new Map(
      categories.map(cat => [cat.id, cat])
    );

    const transformedArticles = articles.map(article => ({
      id: article._id.toString(),
      title: article.title || article.name,
      slug: article.slug,
      excerpt: article.excerpt || article.description?.substring(0, 160) + '...',
      coverImage: article.coverImage || article.images?.[0],
      author: article.author || 'We Travel Ethiopia Tours',
      publishedAt: article.publishedAt,
      readTime: article.readTime,
      category: {
        id: article.category,
        name: categoryMap.get(article.category)?.name || article.category,
        slug: categoryMap.get(article.category)?.slug || article.category
      }
    }));

    return NextResponse.json({
      success: true,
      data: transformedArticles,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit),
        hasNextPage: page < Math.ceil(totalCount / limit)
      },
      query: q
    });

  } catch (error: any) {
    console.error('Error searching articles:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}