import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import BlogCategory from '@/models/BlogCategory';
import { NextRequest, NextResponse } from 'next/server';


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

    const searchParams = req.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '100');
    const search = searchParams.get('search');

    const filter: any = {};
    if (search) {
      filter.name = new RegExp(search, 'i');
    }

    const categories = await BlogCategory.find(filter)
      .sort({ name: 1 })
      .limit(limit)
      .lean();

    const categoriesWithCounts = await Promise.all(
      categories.map(async (category) => {
        const count = await BlogArticle.countDocuments({ category: category.id });
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
      data.id = `cat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Generate slug if not provided
    if (!data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    const category = await BlogCategory.create(data);

    return NextResponse.json({
      success: true,
      data: {
        id: category._id.toString(),
        ...category.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error creating category:', error);
    
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}