import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const now = new Date();

    // Aggregate all tags from published articles
    const tagsAgg = await BlogArticle.aggregate([
      { $match: { 
        $or: [
          { status: 'published' },
          { publishedAt: { $lte: now } }
        ]
      }},
      { $unwind: '$tags' },
      { $group: { 
        _id: '$tags', 
        count: { $sum: 1 },
        articles: { $addToSet: '$_id' }
      }},
      { $sort: { count: -1 } },
      { $limit: 50 }
    ]);

    const tags = tagsAgg.map(tag => ({
      id: tag._id,
      name: tag._id,
      slug: tag._id.toLowerCase().replace(/\s+/g, '-'),
      count: tag.count,
      articleCount: tag.articles.length
    }));

    return NextResponse.json({
      success: true,
      data: tags,
      total: tags.length
    });

  } catch (error: any) {
    console.error('Error fetching tags:', error);
    
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}