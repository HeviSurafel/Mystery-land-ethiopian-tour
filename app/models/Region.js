import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Region name is required'],
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
  
  // Region specific fields
  destinations: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination'
  }],

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
regionSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
});

// Add indexes
regionSchema.index({ slug: 1 });

const Region = mongoose.models.Region || mongoose.model('Region', regionSchema);

export default Region;