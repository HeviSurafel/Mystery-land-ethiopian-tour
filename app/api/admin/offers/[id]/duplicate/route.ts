import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import Offer from '@/models/Offer';
import { requireAuthFromRequest } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuthFromRequest(request, 'admin');
    await connectToDatabase();

    const { id } = await params;
    const originalOffer = await Offer.findById(id);

    if (!originalOffer) {
      return NextResponse.json({ error: 'Offer not found' }, { status: 404 });
    }

    const { _id, createdAt, updatedAt, usageCount, ...offerData } = originalOffer.toObject();

    const duplicatedOffer = await Offer.create({
      ...offerData,
      name: `${offerData.name} (Copy)`,
      slug: `${offerData.slug}-copy-${Date.now()}`,
      code: offerData.code ? `${offerData.code}COPY` : '',
      usageCount: 0,
      status: 'inactive',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ data: duplicatedOffer });
  } catch (error: any) {
    console.error('Error duplicating offer:', error);
    
    if (error.message === 'Authentication required' || error.message === 'Unauthorized: Insufficient permissions') {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to duplicate offer' },
      { status: 500 }
    );
  }
}