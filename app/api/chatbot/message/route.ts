// app/api/chatbot/message/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { chatbotService } from '@/services/ChatbotService';
import { getCurrentUserFromRequest } from '@/lib/auth';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId: existingSessionId } = await req.json();
    
    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      );
    }

    // Get or create session ID
    const sessionId = existingSessionId || uuidv4();
    
    // Get user if logged in
    const user = await getCurrentUserFromRequest(req);
    
    // Get metadata
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const page = req.headers.get('referer') || 'unknown';

    // Find intent
    const match = await chatbotService.findIntent(message);
    
    let response;
    
    if (match) {
      // Get response for matched intent
      response = await chatbotService.getResponse(match.intent);
    } else {
      // Default fallback response
      response = {
        text: "I'm not sure I understand. Could you please rephrase? You can ask me about tours, visa requirements, best time to visit, or contact information.",
        suggestions: ['tours', 'visa', 'best-time', 'contact']
      };
    }

    // Save conversation
    await chatbotService.saveConversation(
      sessionId,
      message,
      response,
      user?.userId,
      { userAgent, ip, page }
    );

    return NextResponse.json({
      success: true,
      response,
      sessionId
    });
  } catch (error) {
    console.error('Chatbot error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process message' },
      { status: 500 }
    );
  }
}