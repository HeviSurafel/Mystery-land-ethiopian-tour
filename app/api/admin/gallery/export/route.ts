import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import { GalleryPhoto } from '@/models/Gallery';

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

    // Get all photos for export
    const photos = await GalleryPhoto.find({})
      .sort({ createdAt: -1 })
      .lean();

    // Transform to CSV format
    const csvData = photos.map(photo => ({
      'ID': photo.id || photo._id.toString(),
      'Title': photo.title,
      'Description': photo.description || '',
      'Category': photo.category,
      'Tags': (photo.tags || []).join(', '),
      'Location': photo.location || '',
      'Likes': photo.likes || 0,
      'Views': photo.views || 0,
      'Featured': photo.featured ? 'Yes' : 'No',
      'Date Taken': photo.dateTaken || '',
      'Tour ID': photo.tourId || '',
      'Destination ID': photo.destinationId || '',
      'Festival ID': photo.festivalId || '',
      'Created At': new Date(photo.createdAt).toLocaleDateString(),
      'Updated At': new Date(photo.updatedAt).toLocaleDateString()
    }));

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
        'Content-Disposition': `attachment; filename=gallery_photos_${new Date().toISOString().split('T')[0]}.csv`
      }
    });

  } catch (error: any) {
    console.error('Error exporting photos:', error);
    
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