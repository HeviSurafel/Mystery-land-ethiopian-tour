import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import BlogArticle from '@/models/BlogArticle';
import { NextRequest, NextResponse } from 'next/server';


export async function DELETE(req: NextRequest) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const { articleIds } = await req.json();

    if (!articleIds || !Array.isArray(articleIds) || articleIds.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No articles specified' },
        { status: 400 }
      );
    }

    // Delete articles
    await BlogArticle.deleteMany({
      $or: [
        { _id: { $in: articleIds } },
        { id: { $in: articleIds } }
      ]
    });

    return NextResponse.json({
      success: true,
      message: `${articleIds.length} articles deleted successfully`
    });

  } catch (error: any) {
    console.error('Error bulk deleting articles:', error);
    
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