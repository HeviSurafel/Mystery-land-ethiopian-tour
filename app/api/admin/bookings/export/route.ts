import { requireAuthFromRequest } from '@/lib/auth';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Booking from '@/models/Booking';
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

    // Get all bookings for export
    const bookings = await Booking.find({})
      .populate({
        path: 'client',
        select: 'name email'
      })
      .populate({
        path: 'tour',
        select: 'name type',
        populate: {
          path: 'destination',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 })
      .lean();

    // Transform to CSV format
    const csvData = bookings.map(booking => ({
      'Booking ID': booking.bookingNumber || booking.bookingId,
      'Client Name': booking.client?.name || 'N/A',
      'Client Email': booking.client?.email || 'N/A',
      'Tour Name': booking.tour?.name || 'N/A',
      'Tour Type': booking.tour?.type || 'N/A',
      'Destination': booking.tour?.destination?.name || 'N/A',
      'Travel Date': new Date(booking.date).toLocaleDateString(),
      'Participants': booking.participants || 1,
      'Status': booking.status,
      'Payment Status': booking.paymentStatus,
      'Created At': new Date(booking.createdAt).toLocaleDateString(),
      'Special Requests': booking.specialRequests || ''
    }));

    // Convert to CSV string
    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).map(value => 
      typeof value === 'string' && value.includes(',') ? `"${value}"` : value
    ).join(','));
    
    const csv = [headers, ...rows].join('\n');

    // Return as downloadable file
    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename=bookings_${new Date().toISOString().split('T')[0]}.csv`
      }
    });

  } catch (error: any) {
    console.error('Error exporting bookings:', error);
    
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