// app/api/admin/blog/route.ts
import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import BlogArticle from '@/models/BlogArticle';
import BlogCategory from '@/models/BlogCategory';
export async function GET(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const featured = searchParams.get('featured');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object
    const filter: any = {};

    // Status filter (using publishedAt to determine status)
    if (status && status !== 'all') {
      const now = new Date();
      if (status === 'published') {
        filter.publishedAt = { $lte: now };
      } else if (status === 'scheduled') {
        filter.publishedAt = { $gt: now };
      } else if (status === 'draft') {
        filter.publishedAt = { $exists: false };
      }
    }

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    } else if (featured === 'false') {
      filter.featured = false;
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Date range filter
    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { excerpt: searchRegex },
        { author: searchRegex }
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Execute queries in parallel
    const [articles, totalCount, stats] = await Promise.all([
      BlogArticle.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      
      BlogArticle.countDocuments(filter),
      
      getBlogStats()
    ]);

    // Transform articles for response
    const transformedArticles = articles.map(article => ({
      id: article._id.toString(),
      _id: article._id.toString(),
      name: article.name,
      title: article.title || article.name,
      description: article.description,
      slug: article.slug,
      images: article.images || [],
      category: article.category,
      readTime: article.readTime,
      excerpt: article.excerpt,
      featured: article.featured || false,
      author: article.author,
      publishedAt: article.publishedAt,
      tags: article.tags || [],
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      // Determine status based on publishedAt
      status: getArticleStatus(article)
    }));

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    };

    return NextResponse.json({
      success: true,
      data: transformedArticles,
      pagination,
      stats
    });

  } catch (error: any) {
    console.error('Error fetching blog articles:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch articles' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const data = await req.json();

    // Generate unique ID if not provided
    if (!data.id) {
      data.id = `blog_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = (data.title || data.name)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    // Set title from name if not provided
    if (!data.title && data.name) {
      data.title = data.name;
    }

    // Set author if not provided
    if (!data.author) {
      data.author = user.name;
    }

    // Calculate read time if not provided
    if (!data.readTime && data.description) {
      const wordsPerMinute = 200;
      const wordCount = data.description.split(/\s+/).length;
      const readTime = Math.ceil(wordCount / wordsPerMinute);
      data.readTime = `${readTime} min read`;
    }

    // Generate excerpt if not provided
    if (!data.excerpt && data.description) {
      data.excerpt = data.description.substring(0, 160) + '...';
    }

    const article = await BlogArticle.create(data);

    return NextResponse.json({
      success: true,
      data: {
        id: article._id.toString(),
        ...article.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error creating blog article:', error);
    
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

function getArticleStatus(article: any): 'published' | 'draft' | 'scheduled' {
  if (!article.publishedAt) {
    return 'draft';
  }
  
  const now = new Date();
  const publishDate = new Date(article.publishedAt);
  
  if (publishDate <= now) {
    return 'published';
  } else {
    return 'scheduled';
  }
}

async function getBlogStats() {
  try {
    const now = new Date();
    
    const [
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      categoriesCount
    ] = await Promise.all([
      BlogArticle.countDocuments(),
      BlogArticle.countDocuments({ publishedAt: { $lte: now } }),
      BlogArticle.countDocuments({ publishedAt: { $exists: false } }),
      BlogArticle.countDocuments({ publishedAt: { $gt: now } }),
      BlogCategory.countDocuments()
    ]);

    // Get top categories by article count
    const articles = await BlogArticle.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    const topCategories = await Promise.all(
      articles.map(async (item) => {
        const category = await BlogCategory.findOne({ id: item._id }).lean();
        return {
          id: item._id,
          name: category?.name || item._id,
          slug: category?.slug || item._id,
          count: item.count
        };
      })
    );

    // Get recent articles
    const recentArticles = await BlogArticle.find({ publishedAt: { $lte: now } })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('name title slug publishedAt')
      .lean();

    return {
      totalArticles,
      publishedArticles,
      draftArticles,
      scheduledArticles,
      archivedArticles: 0, // Not in your schema
      totalViews: 0, // Not in your schema
      totalLikes: 0, // Not in your schema
      totalComments: 0, // Not in your schema
      categoriesCount,
      tagsCount: 0, // Not in your schema
      topCategories,
      topTags: [], // Not in your schema
      recentArticles: recentArticles.map(a => ({
        id: a._id,
        title: a.title || a.name,
        slug: a.slug,
        status: 'published',
        publishedAt: a.publishedAt,
        views: 0
      }))
    };
  } catch (error) {
    console.error('Error calculating blog stats:', error);
    return {
      totalArticles: 0,
      publishedArticles: 0,
      draftArticles: 0,
      scheduledArticles: 0,
      archivedArticles: 0,
      totalViews: 0,
      totalLikes: 0,
      totalComments: 0,
      categoriesCount: 0,
      tagsCount: 0,
      topCategories: [],
      topTags: [],
      recentArticles: []
    };
  }
}