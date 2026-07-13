// app/api/chatbot/train/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/seo/mongodb';
import TrainingData from '@/models/ChatbotTraining';
import { chatbotService } from '@/services/ChatbotService';

// POST /api/chatbot/train - Add training data
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const data = await req.json();
    
    // Validate required fields
    if (!data.intent || !data.patterns || !data.responses) {
      return NextResponse.json(
        { success: false, error: 'Intent, patterns, and responses are required' },
        { status: 400 }
      );
    }

    // Add training data
    const training = await chatbotService.addTrainingData(data);

    return NextResponse.json({
      success: true,
      data: training
    });
  } catch (error) {
    console.error('Error adding training data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to add training data' },
      { status: 500 }
    );
  }
}

// GET /api/chatbot/train - Get all training data
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    
    const trainingData = await TrainingData.find({})
      .sort({ usageCount: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: trainingData,
      count: trainingData.length
    });
  } catch (error) {
    console.error('Error fetching training data:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch training data' },
      { status: 500 }
    );
  }
}