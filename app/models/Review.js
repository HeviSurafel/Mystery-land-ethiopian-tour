import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userAvatar: String,
  itemId: {
    type: String,
    required: true,
  },
  itemType: {
    type: String,
    enum: ['tour', 'destination'],
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  pros: [String],
  cons: [String],
  images: [String],
  helpful: {
    type: Number,
    default: 0,
  },
  helpfulBy: [String], // Array of user IDs who found this helpful
  verified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    enum: ['pending', 'published', 'rejected'],
    default: 'pending',
  },
  response: {
    content: String,
    createdAt: Date,
    author: String,
    authorId: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps
reviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
});

// Ensure one review per user per item
reviewSchema.index({ userId: 1, itemId: 1, itemType: 1 }, { unique: true });

// Add indexes
reviewSchema.index({ itemId: 1, itemType: 1 });
reviewSchema.index({ status: 1 });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ createdAt: -1 });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);

export default Review;