// lib/models/Inquiry.ts
import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Name is required'],
    trim: true 
  },
  email: { 
    type: String, 
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true 
  },
  phone: { 
    type: String,
    trim: true 
  },
  inquiryType: {
    type: String,
    enum: ['general', 'booking', 'custom-tour', 'group', 'corporate', 'urgent'],
    default: 'general'
  },
  tourInterest: {
    type: String,
    trim: true
  },
  travelDate: {
    type: String,
    trim: true
  },
  groupSize: {
    type: Number,
    min: 1,
    default: 1
  },
  budget: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'in-progress', 'resolved', 'archived'],
    default: 'new'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: String,
    default: null
  },
  adminNotes: {
    type: String,
    default: ''
  },
  tags: [String],
  attachments: [{
    filename: String,
    url: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  source: {
    type: String,
    enum: ['website', 'email', 'phone', 'whatsapp', 'referral'],
    default: 'website'
  },
  internalNotes: [{
    note: {
      type: String,
      required: true
    },
    createdBy: {
      type: String,
      default: 'Admin'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  country: String,
  communicationHistory: [{
    type: {
      type: String,
      enum: ['email', 'note', 'phone', 'whatsapp']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    },
    by: String
  }],
  repliedAt: Date,
  resolvedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
InquirySchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Check if model exists before creating new one (for Next.js hot reload)
export default mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);