// app/api/chatbot/feedback/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { chatbotService } from '@/services/ChatbotService';

export async function POST(req: NextRequest) {
  try {
    const { sessionId, rating, comment, userMessage, botResponse, feedback } = await req.json();

    if (!sessionId) {
      return NextResponse.json(
        { success: false, error: 'Session ID is required' },
        { status: 400 }
      );
    }

    // Log feedback
    if (rating) {
      await chatbotService.logFeedback(sessionId, rating, comment);
    }

    // Learn from example
    if (userMessage && botResponse && feedback) {
      await chatbotService.learnFromExample(userMessage, botResponse, feedback);
    }

    return NextResponse.json({
      success: true,
      message: 'Feedback recorded'
    });
  } catch (error) {
    console.error('Error recording feedback:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to record feedback' },
      { status: 500 }
    );
  }
}