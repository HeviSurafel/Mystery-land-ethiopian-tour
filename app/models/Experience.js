// models/Experience.ts
import mongoose from 'mongoose';

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

const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    required: true,
  },
});

const experienceSchema = new mongoose.Schema({
  // Base fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Experience name is required'],
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
  
  // Experience specific fields
  duration: {
    type: String,
    required: [true, 'Duration is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  highlights: [String],
  included: [String],
  notIncluded: [String],
  bestTimeToVisit: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Moderate', 'Challenging', 'Moderate to Challenging'],
    required: [true, 'Difficulty is required'],
  },
  category: {
    type: String,
    enum: ['cultural', 'historical', 'nature', 'adventure', 'tribal', 'coffee', 'festivals', 'food', 'hiking', 'birding', 'photography', 'wellness'],
    required: [true, 'Category is required'],
  },
  tag: String,
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
  coordinates: coordinatesSchema,
  languages: [String],
  groupSize: String,
  ageRange: String,
  whatToBring: [String],
  meetingPoint: String,
  startTimes: [String],
  culturalSignificance: String,
  seasonalAvailability: String,
  
  // Pricing
  price: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
    description: 'Price per person in USD',
  },
  
  // Historical/Cultural Tour specific fields
  itinerary: [dayItinerarySchema],
  inclusions: [String],
  exclusions: [String],
  faq: [faqSchema],
  bestTime: [String],
  season: String,
  departurePoint: String,
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'active',
  },
  
  // Tour specific
  bookingsCount: {
    type: Number,
    default: 0,
  },
  isUnesco: {
    type: Boolean,
    default: false,
  },
  unesco: {
    type: Boolean,
    default: false,
  },
  
  // Metadata
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
experienceSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Add indexes for performance
experienceSchema.index({ slug: 1 });
experienceSchema.index({ category: 1 });
experienceSchema.index({ featured: 1 });
experienceSchema.index({ difficulty: 1 });
experienceSchema.index({ status: 1 });
experienceSchema.index({ rating: -1 });
experienceSchema.index({ 'coordinates.region': 1 });
experienceSchema.index({ price: 1 }); // Add index for price queries

// Create text index for search
experienceSchema.index(
  { 
    name: 'text', 
    description: 'text', 
    shortDescription: 'text',
    'highlights': 'text',
    'location': 'text'
  },
  { 
    weights: {
      name: 10,
      description: 5,
      shortDescription: 3,
      highlights: 2,
      location: 1,
    }
  }
);

const Experience = mongoose.models.Experience || mongoose.model('Experience', experienceSchema);

export default Experience;