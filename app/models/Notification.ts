// app/models/Notification.ts
import mongoose from 'mongoose';

export interface INotification extends mongoose.Document {
  // Core fields
  type: 'booking' | 'inquiry' | 'review' | 'feedback' | 'payment' | 'system' | 'alert';
  subtype?: string;
  
  // User related
  userId?: mongoose.Types.ObjectId;
  userEmail?: string;
  userName?: string;
  
  // Reference to related data
  reference: {
    model: 'Booking' | 'Inquiry' | 'Review' | 'Feedback' | 'User' | 'Tour';
    id: mongoose.Types.ObjectId | string;
    number?: string; // e.g., booking number, inquiry ID
  };
  
  // Notification content
  title: string;
  message: string;
  summary?: string;
  
  // Priority levels
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Status tracking
  status: 'unread' | 'read' | 'archived' | 'deleted';
  readAt?: Date;
  archivedAt?: Date;
  
  // Actions
  actions?: Array<{
    label: string;
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    icon?: string;
  }>;
  
  // Data payload (additional data for the notification)
  data?: Record<string, any>;
  
  // Recipients
  recipients: {
    type: 'all' | 'admins' | 'users' | 'specific';
    userIds?: mongoose.Types.ObjectId[];
    roles?: string[];
    emails?: string[];
  };
  
  // Delivery tracking
  delivery: {
    email?: {
      sent: boolean;
      sentAt?: Date;
      messageId?: string;
    };
    sms?: {
      sent: boolean;
      sentAt?: Date;
    };
    push?: {
      sent: boolean;
      sentAt?: Date;
    };
    inApp: {
      delivered: boolean;
      deliveredAt: Date;
    };
  };
  
  // Expiration
  expiresAt?: Date;
  
  // Metadata
  metadata?: {
    source?: string;
    ip?: string;
    userAgent?: string;
    tags?: string[];
  };
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new mongoose.Schema<INotification>({
  type: {
    type: String,
    enum: ['booking', 'inquiry', 'review', 'feedback', 'payment', 'system', 'alert'],
    required: [true, 'Notification type is required'],
    index: true
  },
  subtype: {
    type: String,
    index: true
  },
  
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  userEmail: String,
  userName: String,
  
  reference: {
    model: {
      type: String,
      enum: ['Booking', 'Inquiry', 'Review', 'Feedback', 'User', 'Tour'],
      required: true
    },
    id: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    number: String
  },
  
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  message: {
    type: String,
    required: [true, 'Message is required']
  },
  summary: String,
  
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  
  status: {
    type: String,
    enum: ['unread', 'read', 'archived', 'deleted'],
    default: 'unread',
    index: true
  },
  readAt: Date,
  archivedAt: Date,
  
  actions: [{
    label: String,
    url: String,
    method: {
      type: String,
      enum: ['GET', 'POST', 'PUT', 'DELETE'],
      default: 'GET'
    },
    icon: String
  }],
  
  data: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  },
  
  recipients: {
    type: {
      type: String,
      enum: ['all', 'admins', 'users', 'specific'],
      required: true
    },
    userIds: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    roles: [String],
    emails: [String]
  },
  
  delivery: {
    email: {
      sent: { type: Boolean, default: false },
      sentAt: Date,
      messageId: String
    },
    sms: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    push: {
      sent: { type: Boolean, default: false },
      sentAt: Date
    },
    inApp: {
      delivered: { type: Boolean, default: true },
      deliveredAt: { type: Date, default: Date.now }
    }
  },
  
  expiresAt: Date,
  
  metadata: {
    source: String,
    ip: String,
    userAgent: String,
    tags: [String]
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
NotificationSchema.index({ 'recipients.userIds': 1, status: 1, createdAt: -1 });
NotificationSchema.index({ userId: 1, status: 1, createdAt: -1 });
NotificationSchema.index({ type: 1, priority: 1, status: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema);