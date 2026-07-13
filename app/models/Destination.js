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

const destinationSchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Destination name is required'],
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

  // Destination specific fields
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['cultural', 'historical', 'nature', 'adventure', 'urban', 'religious'],
  },
  tag: String,
  highlights: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  coordinates: coordinatesSchema,

  // Optional itinerary
  itinerary: [dayItinerarySchema],

  // Additional fields
  region: String,
  country: String,
  attractions: [String],
  bestTimeToVisit: [String],
  averageStay: String,
  popularTours: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'upcoming'],
    default: 'active',
  },
  imageCount: {
    type: Number,
    default: 0,
  },
  tourCount: {
    type: Number,
    default: 0,
  },
  unesco: {
    type: Boolean,
    default: false,
  },
  shortDescription: String,
  bestTime: [String],

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
destinationSchema.pre('save', function(next) {
  this.updatedAt = new Date();

});

// Add indexes
destinationSchema.index({ slug: 1 });
destinationSchema.index({ type: 1 });
destinationSchema.index({ region: 1 });
destinationSchema.index({ status: 1 });
destinationSchema.index({ featured: 1 });

const Destination = mongoose.models.Destination || mongoose.model('Destination', destinationSchema);

export default Destination;