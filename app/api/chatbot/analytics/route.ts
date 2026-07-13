// app/api/chatbot/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { chatbotService } from '@/services/ChatbotService';

export async function GET(req: NextRequest) {
  try {
    const analytics = await chatbotService.getAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}