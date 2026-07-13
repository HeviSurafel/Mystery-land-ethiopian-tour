import mongoose from 'mongoose';

const offerSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Offer name is required'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  shortDescription: {
    type: String,
    required: [true, 'Short description is required'],
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  images: [String],
  discount: {
    type: String,
    required: [true, 'Discount is required'],
  },
  validFrom: {
    type: String,
    required: [true, 'Valid from date is required'],
  },
  validUntil: {
    type: String,
    required: [true, 'Valid until date is required'],
  },
  terms: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  category: {
    type: String,
    enum: ['early-bird', 'group', 'seasonal', 'last-minute', 'family'],
    required: [true, 'Category is required'],
  },
  tourIds: [String],
  destinationIds: [String],
  minParticipants: Number,
  maxParticipants: Number,
  bookingDeadline: String,
  highlights: [String],
  inclusions: [String],

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamps on save
offerSchema.pre('save', function(next) {
  this.updatedAt = new Date();

});

// Add indexes
offerSchema.index({ slug: 1 });
offerSchema.index({ category: 1 });
offerSchema.index({ featured: 1 });
offerSchema.index({ validUntil: 1 });

const Offer = mongoose.models.Offer || mongoose.model('Offer', offerSchema);

export default Offer;