import mongoose from 'mongoose';

// Gallery Photo Schema
const galleryPhotoSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
  },
  description: String,
  imageUrl: {
    type: String,
    required: [true, 'Image URL is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  tags: [String],
  location: String,
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  dateTaken: String,
  tourId: String,
  destinationId: String,
  festivalId: String,

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Gallery Collection Schema
const galleryCollectionSchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Collection name is required'],
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

  // Collection specific fields
  photos: [galleryPhotoSchema],
  coverImage: String,
  photoCount: {
    type: Number,
    default: 0,
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

// Gallery Category Schema
const galleryCategorySchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Category name is required'],
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

  // Category specific fields
  collections: [galleryCollectionSchema],
  featuredPhotos: [galleryPhotoSchema],

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
galleryPhotoSchema.pre('save', function(next) {
  this.updatedAt = new Date();

});

galleryCollectionSchema.pre('save', function(next) {
  this.updatedAt = new Date();

});

galleryCategorySchema.pre('save', function(next) {
  this.updatedAt = new Date();

});

// Add indexes
galleryPhotoSchema.index({ category: 1 });
galleryPhotoSchema.index({ featured: 1 });
galleryCollectionSchema.index({ slug: 1 });
galleryCategorySchema.index({ slug: 1 });

export const GalleryPhoto = mongoose.models.GalleryPhoto || mongoose.model('GalleryPhoto', galleryPhotoSchema);
export const GalleryCollection = mongoose.models.GalleryCollection || mongoose.model('GalleryCollection', galleryCollectionSchema);
export const GalleryCategory = mongoose.models.GalleryCategory || mongoose.model('GalleryCategory', galleryCategorySchema);