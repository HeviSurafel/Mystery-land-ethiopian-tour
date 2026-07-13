import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogCategory from '@/models/BlogCategory';
import BlogArticle from '@/models/BlogArticle';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    // Get query parameters
    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search');

    // Build filter
    const filter: any = {};
    if (search) {
      filter.name = new RegExp(search, 'i');
    }

    // Get categories
    const categories = await BlogCategory.find(filter)
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    // Get article counts for each category
    const now = new Date();
    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await BlogArticle.countDocuments({
          category: category.id,
          $or: [
            { status: 'published' },
            { publishedAt: { $lte: now } }
          ]
        });

        return {
          id: category._id.toString(),
          _id: category._id.toString(),
          name: category.name,
          description: category.description,
          slug: category.slug,
          featured: category.featured || false,
          articleCount: count,
          createdAt: category.createdAt,
          updatedAt: category.updatedAt
        };
      })
    );

    return NextResponse.json({
      success: true,
      data: categoriesWithCounts,
      total: categories.length
    });

  } catch (error: any) {
    console.error('Error fetching categories:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}