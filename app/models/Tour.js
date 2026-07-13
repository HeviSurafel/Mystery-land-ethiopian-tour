import mongoose from 'mongoose';

const dayItinerarySchema = new mongoose.Schema({
  day: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  activities: [String],
  accommodation: String,
  meals: [String],
});

const faqItemSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const coordinatesSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  city: String,
  region: String,
});

const tourSchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Tour name is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
  },
  slug: {
    type: String,
    required: [true, 'Slug is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  
  // ImageSet
  images: [String],
  
  // Basic Information
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  highlights: [String],
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging','Moderate to Challenging','Easy to Moderate'],
    default: 'Moderate',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  groupSize: String,
  tag: String,

  // Location
  coordinates: coordinatesSchema,

  // Detailed Information
  itinerary: [dayItinerarySchema],
  inclusions: [String],
  exclusions: [String],
  faq: [faqItemSchema],

  // Practical Information
  bestTime: [String],
  season: String,
  departurePoint: String,
  languages: [String],

  // Dashboard Fields
  category: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'active',
  },
  bookingsCount: {
    type: Number,
    default: 0,
  },
  type: {
    type: String,
    enum: ['historical', 'cultural', 'nature', 'adventure'],
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

// Update timestamps on save
tourSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
});

// Add indexes
tourSchema.index({ slug: 1 });
tourSchema.index({ category: 1 });
tourSchema.index({ status: 1 });
tourSchema.index({ featured: 1 });
tourSchema.index({ 'coordinates.region': 1 });

const Tour = mongoose.models.Tour || mongoose.model('Tour', tourSchema);

export default Tour;