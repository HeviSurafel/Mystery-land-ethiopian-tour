// app/models/ChatbotTraining.js
import mongoose from 'mongoose';

const TrainingDataSchema = new mongoose.Schema({
  intent: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  patterns: [{
    type: String,
    required: true
  }],
  responses: [{
    type: String,
    required: true
  }],
  context: String,
  metadata: {
    tours: [String],
    categories: [String],
    tags: [String],
    priority: {
      type: Number,
      default: 0
    }
  },
  examples: [{
    userMessage: String,
    botResponse: String,
    feedback: {
      type: String,
      enum: ['positive', 'negative']
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: Date
}, {
  timestamps: true
});

// Index for search
TrainingDataSchema.index({ patterns: 'text' });

// Check if model exists before creating new one
const TrainingData = mongoose.models.TrainingData || mongoose.model('TrainingData', TrainingDataSchema);

export default TrainingData;