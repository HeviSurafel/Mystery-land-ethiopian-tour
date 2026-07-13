import mongoose from 'mongoose';

const blogCommentSchema = new mongoose.Schema({
  id: {
    type: String,
    unique: true,
  },
  articleId: {
    type: String,
    required: [true, 'Article ID is required'],
    index: true,
  },
  author: {
    id: String,
    name: {
      type: String,
      required: [true, 'Author name is required'],
    },
    email: {
      type: String,
      required: [true, 'Author email is required'],
    },
    avatar: String,
  },
  content: {
    type: String,
    required: [true, 'Comment content is required'],
    maxlength: [1000, 'Comment cannot exceed 1000 characters'],
  },
  likes: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'spam', 'deleted'],
    default: 'pending',
  },
  parentId: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Add indexes for better query performance
blogCommentSchema.index({ articleId: 1, createdAt: -1 });
blogCommentSchema.index({ parentId: 1 });

// Pre-save hook to generate ID if not provided
blogCommentSchema.pre('save', function() {
  if (!this.id) {
    this.id = `comment_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`;
  }
});

const BlogComment = mongoose.models.BlogComment || mongoose.model('BlogComment', blogCommentSchema);

export default BlogComment;