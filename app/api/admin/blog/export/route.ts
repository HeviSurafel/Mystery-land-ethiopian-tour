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

    // Get all articles for export
    const articles = await BlogArticle.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Get category names
    const categories = await BlogCategory.find({}).lean();
    const categoryMap = new Map(
      categories.map(c => [c.id, c.name])
    );

    // Transform to CSV format
    const csvData = articles.map(article => {
      const now = new Date();
      const status = !article.publishedAt ? 'draft' :
        new Date(article.publishedAt) <= now ? 'published' : 'scheduled';

      return {
        'ID': article.id || article._id.toString(),
        'Title': article.title || article.name,
        'Slug': article.slug,
        'Category': categoryMap.get(article.category) || article.category,
        'Author': article.author || '',
        'Status': status,
        'Published Date': article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '',
        'Created Date': new Date(article.createdAt).toLocaleDateString(),
        'Featured': article.featured ? 'Yes' : 'No',
        'Read Time': article.readTime || '',
        'Tags': (article.tags || []).join(', '),
        'Excerpt': article.excerpt || ''
      };
    });

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).map(value => 
      typeof value === 'string' && (value.includes(',') || value.includes('"')) 
        ? `"${value.replace(/"/g, '""')}"` 
        : value
    ).join(','));
    
    const csv = [headers, ...rows].join('\n');

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=blog_articles_${new Date().toISOString().split('T')[0]}.csv`
      }
    });

  } catch (error: any) {
    console.error('Error exporting articles:', error);
    
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