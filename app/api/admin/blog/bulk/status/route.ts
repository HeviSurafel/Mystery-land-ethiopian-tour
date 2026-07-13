import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import { NextRequest, NextResponse } from 'next/server';


export async function PATCH(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { articleIds, status } = await req.json();

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No articles specified' },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { success: false, error: 'Status not specified' },
        { status: 400 }
      );
    }

    // Prepare update data based on status
    const updateData: any = {
      updatedAt: new Date()
    };

    const now = new Date();

    switch(status) {
      case 'published':
        updateData.publishedAt = now;
        break;
      case 'draft':
        updateData.publishedAt = null;
        break;
      case 'scheduled':
        // For scheduled, we keep existing publishedAt or set to future date
        // This would need a scheduledAt field in your schema
        break;
    }

    // Update articles
    await BlogArticle.updateMany(
      {
        $or: [
          { _id: { $in: articleIds } },
          { id: { $in: articleIds } }
        ]
      },
      updateData
    );

    return NextResponse.json({
      success: true,
      message: `${articleIds.length} articles updated`
    });

  } catch (error: any) {
    console.error('Error bulk updating articles:', error);
    
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