import { connectToDatabase } from '@/lib/seo/mongodb';
import { NextRequest, NextResponse } from 'next/server';
import Offer from '@/models/Offer';

interface RouteParams {
  params: Promise<{
    slug: string;
  }>;
}

// GET /api/offers/[slug] - Fetch single offer by slug
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    
    const { slug } = await params;
    
    const offer = await Offer.findOne({ slug }).lean();

    if (!offer) {
      return NextResponse.json(
        { success: false, error: 'Offer not found' },
        { status: 404 }
      );
    }

    // Clean the response
    const cleanedOffer = {
      ...offer,
      _id: offer._id.toString(),
      id: offer.id || offer._id.toString(),
      createdAt: offer.createdAt?.toISOString(),
      updatedAt: offer.updatedAt?.toISOString(),
      validFrom: offer.validFrom?.toISOString?.() || offer.validFrom,
      validUntil: offer.validUntil?.toISOString?.() || offer.validUntil
    };

    return NextResponse.json({
      success: true,
      data: cleanedOffer
    });
  } catch (error) {
    console.error('Error fetching offer:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch offer' },
      { status: 500 }
    );
  }
}

