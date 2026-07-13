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

const festivalSchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Festival name is required'],
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

  // Festival specific fields
  date: {
    type: String,
    required: [true, 'Date is required'],
  },
  season: {
    type: String,
    required: [true, 'Season is required'],
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
  },
  significance: {
    type: String,
    required: [true, 'Significance is required'],
  },
  highlights: [String],
  featured: {
    type: Boolean,
    default: false,
  },
  coordinates: coordinatesSchema,
  bestTimeToVisit: String,
  culturalTips: [String],

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
festivalSchema.pre('save', function(next) {
  this.updatedAt = new Date();

});

// Add indexes
festivalSchema.index({ slug: 1 });
festivalSchema.index({ season: 1 });
festivalSchema.index({ featured: 1 });

const Festival = mongoose.models.Festival || mongoose.model('Festival', festivalSchema);

export default Festival;