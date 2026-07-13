
// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import BlogCategory from '@/models/BlogCategory';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '9');
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const sortBy = searchParams.get('sortBy') || 'publishedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build filter object - only show published articles
    const now = new Date();
    const filter: any = {
      $or: [
        { status: 'published' },
        { publishedAt: { $lte: now } }
      ]
    };

    // Featured filter
    if (featured === 'true') {
      filter.featured = true;
    }

    // Category filter
    if (category && category !== 'all') {
      filter.category = category;
    }

    // Tag filter
    if (tag && tag !== 'all') {
      filter.tags = tag;
    }

    // Search functionality
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$and = [
        filter.$or,
        {
          $or: [
            { title: searchRegex },
            { name: searchRegex },
            { description: searchRegex },
            { excerpt: searchRegex },
            { content: searchRegex },
            { author: searchRegex }
          ]
        }
      ];
      delete filter.$or;
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Get category names for mapping
    const categories = await BlogCategory.find({}).lean();
    const categoryMap = new Map(
      categories.map(cat => [cat.id, cat])
    );

    // Execute queries in parallel
    const [articles, totalCount] = await Promise.all([
      BlogArticle.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      
      BlogArticle.countDocuments(filter)
    ]);

    // Transform articles for response
    const transformedArticles = articles.map(article => {
      const categoryId = article.category;
      const category = categoryMap.get(categoryId) || { name: categoryId, slug: categoryId };
      
      // Determine if article is published, draft, or scheduled
      let status: 'published' | 'draft' | 'scheduled' = 'draft';
      if (article.publishedAt) {
        const publishDate = new Date(article.publishedAt);
        status = publishDate <= now ? 'published' : 'scheduled';
      }

      return {
        id: article._id.toString(),
        _id: article._id.toString(),
        name: article.name,
        title: article.title || article.name,
        description: article.description,
        slug: article.slug,
        images: article.images || [],
        category: {
          id: categoryId,
          name: category.name,
          slug: category.slug
        },
        readTime: article.readTime,
        excerpt: article.excerpt || article.description?.substring(0, 160) + '...',
        featured: article.featured || false,
        author: article.author || 'We Travel Ethiopia Tours',
        publishedAt: article.publishedAt,
        tags: article.tags || [],
        views: article.views || 0,
        likes: article.likes || 0,
        comments: article.comments || 0,
        status,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        coverImage: article.coverImage || article.images?.[0],
        content: article.description
      };
    });

    const pagination = {
      page,
      limit,
      total: totalCount,
      pages: Math.ceil(totalCount / limit),
      hasNextPage: page < Math.ceil(totalCount / limit),
      hasPrevPage: page > 1
    };

    // Get stats for the blog
    const stats = await getBlogStats();

    return NextResponse.json({
      success: true,
      data: transformedArticles,
      pagination,
      stats
    });

  } catch (error: any) {
    console.error('Error fetching blog articles:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch articles' 
      },
      { status: 500 }
    );
  }
}

async function getBlogStats() {
  try {
    const now = new Date();
    
    const [
      totalArticles,
      totalViews,
      totalLikes,
      totalComments,
      categoriesCount
    ] = await Promise.all([
      BlogArticle.countDocuments({
        $or: [
          { status: 'published' },
          { publishedAt: { $lte: now } }
        ]
      }),
      BlogArticle.aggregate([
        { $match: { 
          $or: [
            { status: 'published' },
            { publishedAt: { $lte: now } }
          ]
        }},
        { $group: { _id: null, total: { $sum: '$views' } } }
      ]),
      BlogArticle.aggregate([
        { $match: { 
          $or: [
            { status: 'published' },
            { publishedAt: { $lte: now } }
          ]
        }},
        { $group: { _id: null, total: { $sum: '$likes' } } }
      ]),
      BlogArticle.aggregate([
        { $match: { 
          $or: [
            { status: 'published' },
            { publishedAt: { $lte: now } }
          ]
        }},
        { $group: { _id: null, total: { $sum: '$comments' } } }
      ]),
      BlogCategory.countDocuments()
    ]);

    // Get top categories by article count
    const topCategoriesAgg = await BlogArticle.aggregate([
      { $match: { 
        $or: [
          { status: 'published' },
          { publishedAt: { $lte: now } }
        ]
      }},
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 }
    ]);

    // Get category names
    const categories = await BlogCategory.find({}).lean();
    const categoryMap = new Map(
      categories.map(cat => [cat.id, cat])
    );

    const topCategories = topCategoriesAgg.map(item => ({
      id: item._id,
      name: categoryMap.get(item._id)?.name || item._id,
      slug: categoryMap.get(item._id)?.slug || item._id,
      count: item.count
    }));

    // Get top tags
    const topTagsAgg = await BlogArticle.aggregate([
      { $match: { 
        $or: [
          { status: 'published' },
          { publishedAt: { $lte: now } }
        ]
      }},
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const topTags = topTagsAgg.map(item => ({
      id: item._id,
      name: item._id,
      slug: item._id.toLowerCase().replace(/\s+/g, '-'),
      count: item.count
    }));

    // Get recent articles
    const recentArticles = await BlogArticle.find({
      $or: [
        { status: 'published' },
        { publishedAt: { $lte: now } }
      ]
    })
      .sort({ publishedAt: -1 })
      .limit(5)
      .select('name title slug publishedAt views')
      .lean();

    return {
      totalArticles,
      totalViews: totalViews[0]?.total || 0,
      totalLikes: totalLikes[0]?.total || 0,
      totalComments: totalComments[0]?.total || 0,
      categoriesCount,
      tagsCount: topTags.length,
      topCategories,
      topTags,
      recentArticles: recentArticles.map(a => ({
        id: a._id,
        title: a.title || a.name,
        slug: a.slug,
        status: 'published',
        publishedAt: a.publishedAt,
        views: a.views || 0
      }))
    };
  } catch (error) {
    console.error('Error calculating blog stats:', error);
    return {
      totalArticles: 0,
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