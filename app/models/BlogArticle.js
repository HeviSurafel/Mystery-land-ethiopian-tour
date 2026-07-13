import mongoose from 'mongoose';

const blogArticleSchema = new mongoose.Schema({
  // BaseContent fields
  id: {
    type: String,
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Article title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Content is required'],
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

  // Blog specific fields
  category: {
    type: String,
    required: [true, 'Category is required'],
  },
  readTime: String,
  excerpt: String,
  featured: {
    type: Boolean,
    default: false,
  },
  title: String,
  author: String,
  publishedAt: Date,
  tags: [String],

  // Engagement fields
  views: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
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

// Update timestamps
blogArticleSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Add indexes
blogArticleSchema.index({ slug: 1 });
blogArticleSchema.index({ category: 1 });
blogArticleSchema.index({ featured: 1 });
blogArticleSchema.index({ createdAt: -1 });

const BlogArticle = mongoose.models.BlogArticle || mongoose.model('BlogArticle', blogArticleSchema);

export default BlogArticle;