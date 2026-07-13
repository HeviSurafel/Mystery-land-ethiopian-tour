import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryCategory, GalleryPhoto } from '@/models/Gallery';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const categoryId = (await params).id;

    const category = await GalleryCategory.findOne({
      $or: [
        { _id: categoryId },
        { id: categoryId },
        { slug: categoryId }
      ]
    }).lean();

    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Get photo count for this category
    const photoCount = await GalleryPhoto.countDocuments({ category: category.id });

    return NextResponse.json({
      success: true,
      data: {
        id: category._id.toString(),
        _id: category._id.toString(),
        name: category.name,
        description: category.description,
        slug: category.slug,
        collections: category.collections || [],
        featuredPhotos: category.featuredPhotos || [],
        collectionCount: category.collections?.length || 0,
        photoCount,
        createdAt: category.createdAt,
        updatedAt: category.updatedAt
      }
    });

  } catch (error: any) {
    console.error('Error fetching category:', error);
    
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

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const categoryId = (await params).id;
    const updates = await req.json();

    const category = await GalleryCategory.findOne({
      $or: [
        { _id: categoryId },
        { id: categoryId },
        { slug: categoryId }
      ]
    });
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    // Update category
    Object.keys(updates).forEach(key => {
      category[key] = updates[key];
    });

    category.updatedAt = new Date();
    
    await category.save();

    return NextResponse.json({
      success: true,
      data: {
        id: category._id.toString(),
        _id: category._id.toString(),
        ...category.toObject()
      }
    });

  } catch (error: any) {
    console.error('Error updating category:', error);
    
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

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireAuthFromRequest(req);
    
    if (!['admin', 'owner'].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized: Insufficient permissions' },
        { status: 403 }
      );
    }

    await connectToDatabase();

    const categoryId = (await params).id;

    // Check if category has photos
    const category = await GalleryCategory.findOne({
      $or: [
        { _id: categoryId },
        { id: categoryId },
        { slug: categoryId }
      ]
    });
    
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      );
    }

    const photoCount = await GalleryPhoto.countDocuments({ category: category.id });
    
    if (photoCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete category with existing photos' },
        { status: 400 }
      );
    }

    await GalleryCategory.deleteOne({ _id: category._id });

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    });

  } catch (error: any) {
    console.error('Error deleting category:', error);
    
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