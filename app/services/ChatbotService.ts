// app/services/ChatbotService.ts
import TrainingData from '../models/ChatbotTraining.js';
import ChatConversation from '../models/ChatbotConversation.js';
import Tour from '../models/Tour.js';
import BlogArticle from '../models/BlogArticle.js';

import natural from 'natural';
import mongoose from 'mongoose';

interface MatchResult {
  intent: string;
  confidence: number;
  context?: string;
  metadata?: any;
}

interface BotResponse {
  text: string;
  intent?: string;
  confidence?: number;
  suggestions?: string[];
  tours?: any[];
  articles?: any[];
  contact?: boolean;
}
function connectToDatabase() {
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@dorzetour.2qcu7wl.mongodb.net/dorzetour?retryWrites=true&w=majority';
  return mongoose.connect(MONGODB_URI, {
  });
}
export class ChatbotService {
  private tokenizer: natural.WordTokenizer;
  private tfidf: natural.TfIdf;
  private trained: boolean = false;
  private trainingData: any[] = [];

  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
  }

  // Initialize and train the model
  async train() {
    await connectToDatabase();
    
    // Load training data from database
    this.trainingData = await TrainingData.find({}).lean();
    
    // Add documents to TF-IDF
    this.trainingData.forEach((item, index) => {
      const text = item.patterns.join(' ');
      this.tfidf.addDocument(text);
    });
    
    this.trained = true;
    console.log(`Chatbot trained with ${this.trainingData.length} intents`);
  }

  // Find best matching intent
  async findIntent(userMessage: string): Promise<MatchResult | null> {
    if (!this.trained) {
      await this.train();
    }

    const tokens = this.tokenizer.tokenize(userMessage.toLowerCase());
    const query = tokens.join(' ');
    
    const scores: { index: number; score: number }[] = [];
    
    // Get TF-IDF scores
    this.tfidf.tfidfs(query, (i, measure) => {
      scores.push({ index: i, score: measure });
    });

    // Sort by score descending
    scores.sort((a, b) => b.score - a.score);

    if (scores.length === 0 || scores[0].score === 0) {
      return null;
    }

    const bestMatch = scores[0];
    const confidence = Math.min(bestMatch.score / 2, 1); // Normalize confidence

    if (confidence < 0.3) {
      return null; // Low confidence
    }

    const matchedData = this.trainingData[bestMatch.index];
    
    return {
      intent: matchedData.intent,
      confidence,
      context: matchedData.context,
      metadata: matchedData.metadata
    };
  }

  // Get response for intent
  async getResponse(intent: string, context?: any): Promise<BotResponse> {
    await connectToDatabase();
    
    const training = await TrainingData.findOne({ intent }).lean();
    
    if (!training) {
      return {
        text: "I'm not sure how to help with that. Could you please rephrase?"
      };
    }

    // Update usage count
    await TrainingData.updateOne(
      { intent },
      { 
        $inc: { usageCount: 1 },
        $set: { lastUsed: new Date() }
      }
    );

    // Select random response
    const responseText = training.responses[Math.floor(Math.random() * training.responses.length)];

    // Check if we need to fetch additional data
    let tours: any[] = [];
    let articles: any[] = [];

    if (training.metadata?.tours) {
      tours = await Tour.find({ 
        slug: { $in: training.metadata.tours } 
      }).lean();
    }

    if (training.metadata?.categories) {
      articles = await BlogArticle.find({
        category: { $in: training.metadata.categories }
      })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    }

    // Get suggestions (related intents)
    const suggestions = await this.getSuggestions(intent);

    return {
      text: responseText,
      intent: training.intent,
      confidence: 1,
      suggestions,
      tours: tours.length > 0 ? tours : undefined,
      articles: articles.length > 0 ? articles : undefined,
      contact: training.intent === 'contact'
    };
  }

  // Get related intent suggestions
  async getSuggestions(currentIntent: string, limit: number = 3): Promise<string[]> {
    const allIntents = await TrainingData.find({
      intent: { $ne: currentIntent }
    })
    .sort({ usageCount: -1 })
    .limit(limit)
    .lean();

    return allIntents.map(i => i.intent);
  }

  // Save conversation
  async saveConversation(sessionId: string, message: string, response: BotResponse, userId?: string, metadata?: any) {
    await connectToDatabase();
    
    let conversation = await ChatConversation.findOne({ sessionId });
    
    if (!conversation) {
      conversation = new ChatConversation({
        sessionId,
        userId,
        messages: [],
        metadata: metadata || {}
      });
    }

    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date()
    });

    conversation.messages.push({
      role: 'bot',
      content: response.text,
      intent: response.intent,
      confidence: response.confidence,
      timestamp: new Date()
    });

    await conversation.save();
  }

  // Log feedback
  async logFeedback(sessionId: string, rating: number, comment?: string) {
    await connectToDatabase();
    
    await ChatConversation.findOneAndUpdate(
      { sessionId },
      {
        $set: {
          feedback: {
            rating,
            comment,
            timestamp: new Date()
          }
        }
      }
    );
  }

  // Train with new data
  async addTrainingData(data: {
    intent: string;
    patterns: string[];
    responses: string[];
    context?: string;
    metadata?: any;
  }) {
    await connectToDatabase();
    
    const training = await TrainingData.findOneAndUpdate(
      { intent: data.intent },
      {
        $set: {
          patterns: data.patterns,
          responses: data.responses,
          context: data.context,
          metadata: data.metadata
        }
      },
      { upsert: true, new: true }
    );

    // Retrain the model
    await this.train();

    return training;
  }

  // Learn from example
  async learnFromExample(userMessage: string, botResponse: string, feedback: 'positive' | 'negative') {
    // Find the intent that was used
    const match = await this.findIntent(userMessage);
    
    if (match) {
      await TrainingData.updateOne(
        { intent: match.intent },
        {
          $push: {
            examples: {
              userMessage,
              botResponse,
              feedback,
              timestamp: new Date()
            }
          }
        }
      );
    }
  }

  // Get analytics
  async getAnalytics() {
    await connectToDatabase();
    
    const totalConversations = await ChatConversation.countDocuments();
    const totalMessages = await ChatConversation.aggregate([
      { $project: { messageCount: { $size: '$messages' } } },
      { $group: { _id: null, total: { $sum: '$messageCount' } } }
    ]);

    const popularIntents = await TrainingData.find()
      .sort({ usageCount: -1 })
      .limit(10)
      .select('intent usageCount')
      .lean();

    const feedbackStats = await ChatConversation.aggregate([
      { $match: { 'feedback.rating': { $exists: true } } },
      { $group: {
        _id: null,
        avgRating: { $avg: '$feedback.rating' },
        count: { $sum: 1 }
      }}
    ]);

    return {
      totalConversations,
      totalMessages: totalMessages[0]?.total || 0,
      popularIntents,
      averageRating: feedbackStats[0]?.avgRating || 0,
      totalFeedback: feedbackStats[0]?.count || 0
    };
  }
}

export const chatbotService = new ChatbotService();