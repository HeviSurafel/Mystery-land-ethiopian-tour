// app/models/ChatbotConversation.js
import mongoose from 'mongoose';

const ChatConversationSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userEmail: {
    type: String,
    index: true
  },
  userName: String,
  
  // Messages array
  messages: [{
    role: {
      type: String,
      enum: ['user', 'bot', 'system'],
      required: true
    },
    content: {
      type: String,
      required: true
    },
    intent: String,
    confidence: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: {
      suggestedTours: [mongoose.Schema.Types.Mixed],
      suggestedArticles: [mongoose.Schema.Types.Mixed],
      quickReplies: [String],
      context: String
    }
  }],
  
  // Feedback array (can have multiple feedback entries)
  feedback: [{
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    category: {
      type: String,
      enum: ['helpful', 'unhelpful', 'confusing', 'wrong', 'other']
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    userMessage: String,
    botResponse: String
  }],
  
  // Average rating (calculated)
  averageRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  
  // Conversation timing
  startedAt: {
    type: Date,
    default: Date.now
  },
  endedAt: Date,
  duration: Number, // in seconds
  
  // Message counts
  messageCount: {
    type: Number,
    default: 0
  },
  userMessageCount: {
    type: Number,
    default: 0
  },
  botMessageCount: {
    type: Number,
    default: 0
  },
  
  // Intent tracking
  primaryIntent: String,
  intentsDetected: [{
    intent: String,
    confidence: Number,
    timestamp: {
      type: Date,
      default: Date.now
    },
    messageId: String
  }],
  
  // Escalation tracking
  escalatedTo: {
    type: String,
    enum: ['human', 'admin', 'manager']
  },
  escalatedAt: Date,
  escalatedBy: {
    type: String,
    enum: ['user', 'system']
  },
  resolvedAt: Date,
  
  // Metadata
  metadata: {
    userAgent: String,
    ip: String,
    page: String,
    language: String,
    referrer: String,
    device: {
      type: String,
      enum: ['mobile', 'tablet', 'desktop']
    },
    browser: String,
    os: String,
    sessionDuration: Number,
    tags: [String],
    source: {
      type: String,
      enum: ['website', 'whatsapp', 'messenger', 'api'],
      default: 'website'
    }
  }
}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// Indexes for better query performance
ChatConversationSchema.index({ sessionId: 1 });
ChatConversationSchema.index({ userId: 1 });
ChatConversationSchema.index({ userEmail: 1 });
ChatConversationSchema.index({ 'messages.timestamp': -1 });
ChatConversationSchema.index({ startedAt: -1 });
ChatConversationSchema.index({ primaryIntent: 1 });
ChatConversationSchema.index({ 'metadata.source': 1 });
ChatConversationSchema.index({ escalatedTo: 1, resolvedAt: 1 });

// Pre-save middleware to calculate stats
ChatConversationSchema.pre('save', function() {
  // Update message counts
  if (this.messages) {
    this.messageCount = this.messages.length;
    this.userMessageCount = this.messages.filter(m => m.role === 'user').length;
    this.botMessageCount = this.messages.filter(m => m.role === 'bot').length;
  }
  
  // Calculate duration if ended
  if (this.endedAt && this.startedAt) {
    this.duration = Math.floor((this.endedAt - this.startedAt) / 1000);
  }
  
  // Calculate average rating from feedback
  if (this.feedback && this.feedback.length > 0) {
    const validRatings = this.feedback.filter(f => f.rating).map(f => f.rating);
    if (validRatings.length > 0) {
      const sum = validRatings.reduce((a, b) => a + b, 0);
      this.averageRating = sum / validRatings.length;
    }
  }
  
});

// Virtual for session duration (if not ended)
ChatConversationSchema.virtual('currentDuration').get(function() {
  if (this.endedAt) {
    return this.duration;
  }
  return Math.floor((Date.now() - this.startedAt) / 1000);
});

// Method to add a message
ChatConversationSchema.methods.addMessage = function(role, content, options = {}) {
  const message = {
    role,
    content,
    timestamp: new Date(),
    ...options
  };
  
  this.messages.push(message);
  return this.save();
};

// Method to add feedback
ChatConversationSchema.methods.addFeedback = function(feedback) {
  this.feedback.push({
    ...feedback,
    timestamp: new Date()
  });
  return this.save();
};

// Method to end conversation
ChatConversationSchema.methods.endConversation = function() {
  this.endedAt = new Date();
  return this.save();
};

// Static method to get analytics
ChatConversationSchema.statics.getAnalytics = async function(startDate, endDate) {
  const match = {};
  if (startDate || endDate) {
    match.startedAt = {};
    if (startDate) match.startedAt.$gte = startDate;
    if (endDate) match.startedAt.$lte = endDate;
  }

  const analytics = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalConversations: { $sum: 1 },
        totalMessages: { $sum: '$messageCount' },
        avgMessagesPerConversation: { $avg: '$messageCount' },
        avgDuration: { $avg: '$duration' },
        avgRating: { $avg: '$averageRating' },
        escalatedCount: {
          $sum: { $cond: [{ $ne: ['$escalatedTo', null] }, 1, 0] }
        },
        resolvedCount: {
          $sum: { $cond: [{ $ne: ['$resolvedAt', null] }, 1, 0] }
        }
      }
    }
  ]);

  // Get top intents
  const topIntents = await this.aggregate([
    { $match: match },
    { $unwind: '$intentsDetected' },
    { $group: { _id: '$intentsDetected.intent', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  // Get daily stats
  const dailyStats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          year: { $year: '$startedAt' },
          month: { $month: '$startedAt' },
          day: { $dayOfMonth: '$startedAt' }
        },
        count: { $sum: 1 },
        avgRating: { $avg: '$averageRating' }
      }
    },
    { $sort: { '_id.year': -1, '_id.month': -1, '_id.day': -1 } },
    { $limit: 30 }
  ]);

  return {
    summary: analytics[0] || {
      totalConversations: 0,
      totalMessages: 0,
      avgMessagesPerConversation: 0,
      avgDuration: 0,
      avgRating: 0,
      escalatedCount: 0,
      resolvedCount: 0
    },
    topIntents,
    dailyStats
  };
};

// Check if model exists before creating new one
const ChatConversation = mongoose.models.ChatConversation || 
  mongoose.model('ChatConversation', ChatConversationSchema);

export default ChatConversation;