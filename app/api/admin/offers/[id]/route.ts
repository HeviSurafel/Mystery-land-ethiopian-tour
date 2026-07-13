import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Offer from '@/models/Offer';
import { requireAuthFromRequest } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;
    const offer = await Offer.findById(id).lean();

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ data: offer });
  } catch (error: any) {
    console.error('Error fetching offer:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    
    // Remove _id from body if present
    if (body._id) delete body._id;

    // If slug is being updated, check for uniqueness
    if (body.slug) {
      const existingOffer = await Offer.findOne({
        slug: body.slug,
        _id: { $ne: id }
      });
      
      if (existingOffer) {
        return NextResponse.json(
          { error: 'Offer with this slug already exists' },
          { status: 400 }
        );
      }
    }

    const offer = await Offer.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ data: offer });
  } catch (error: any) {
    console.error('Error updating offer:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    if (error.name === 'CastError') {
      return NextResponse.json({ error: 'Invalid offer ID format' }, { status: 400 });
    }
    
    if (error.name === 'ValidationError') {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to update offer' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;
    const offer = await Offer.findByIdAndDelete(id);

    if (!offer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Offer deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting offer:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to delete offer' },
      { status: 500 }
    );
  }
}