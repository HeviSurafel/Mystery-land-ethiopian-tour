// app/services/NotificationService.ts
import Notification from '@/app/models/Notification';
import User from '@/app/models/User';
import { emailService } from '@/app/lib/email/emailService';
import { connectToDatabase } from '@/app/lib/seo/mongodb';

interface CreateNotificationParams {
  type: 'booking' | 'inquiry' | 'review' | 'feedback' | 'payment' | 'system' | 'alert';
  subtype?: string;
  title: string;
  message: string;
  summary?: string;
  priority?: 'low' | 'medium' | 'high' | 'urgent';
  reference: {
    model: 'Booking' | 'Inquiry' | 'Review' | 'Feedback' | 'User' | 'Tour';
    id: any;
    number?: string;
  };
  userId?: string;
  userEmail?: string;
  userName?: string;
  data?: Record<string, any>;
  actions?: Array<{
    label: string;
    url: string;
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    icon?: string;
  }>;
  recipients?: {
    type: 'all' | 'admins' | 'users' | 'specific';
    userIds?: string[];
    roles?: string[];
    emails?: string[];
  };
  sendEmail?: boolean;
  expiresIn?: number; // days
}

export class NotificationService {
  
  // Create a new notification
  static async create(params: CreateNotificationParams) {
    await connectToDatabase();
    
    const {
      type,
      subtype,
      title,
      message,
      summary,
      priority = 'medium',
      reference,
      userId,
      userEmail,
      userName,
      data,
      actions,
      recipients = { type: 'admins' },
      sendEmail = true,
      expiresIn
    } = params;

    // Calculate expiration date if provided
    let expiresAt;
    if (expiresIn) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresIn);
    }

    // Create notification
    const notification = await Notification.create({
      type,
      subtype,
      userId,
      userEmail,
      userName,
      reference,
      title,
      message,
      summary,
      priority,
      data,
      actions,
      recipients,
      expiresAt,
      status: 'unread',
      delivery: {
        inApp: {
          delivered: true,
          deliveredAt: new Date()
        }
      }
    });

    // Send email if requested and we have email addresses
    if (sendEmail) {
      await this.sendEmailNotification(notification);
    }

    return notification;
  }

  // Send email notification
  private static async sendEmailNotification(notification: any) {
    try {
      let recipientEmails: string[] = [];

      // Determine recipients based on type
      if (notification.recipients.type === 'admins') {
        const admins = await User.find({ role: 'admin' }).select('email');
        recipientEmails = admins.map(admin => admin.email);
      } else if (notification.recipients.type === 'specific') {
        recipientEmails = notification.recipients.emails || [];
        
        // Add emails from userIds
        if (notification.recipients.userIds?.length) {
          const users = await User.find({
            '_id': { $in: notification.recipients.userIds }
          }).select('email');
          recipientEmails.push(...users.map(u => u.email));
        }
      } else if (notification.userEmail) {
        recipientEmails = [notification.userEmail];
      }

      if (recipientEmails.length === 0) return;

      // Send email
      const emailResult = await emailService.sendEmail({
        to: recipientEmails,
        subject: notification.title,
        html: this.generateEmailTemplate(notification)
      });

      // Update delivery status
      if (emailResult.success) {
        notification.delivery.email = {
          sent: true,
          sentAt: new Date(),
          messageId: emailResult.messageId
        };
        await notification.save();
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  // Generate HTML email template
  private static generateEmailTemplate(notification: any): string {
    const priorityColors = {
      low: '#6b7280',
      medium: '#f59e0b',
      high: '#dc2626',
      urgent: '#b91c1c'
    };

    const typeIcons = {
      booking: '📅',
      inquiry: '❓',
      review: '⭐',
      feedback: '💬',
      payment: '💰',
      system: '⚙️',
      alert: '⚠️'
    };

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { 

            color: white; 
            padding: 20px; 
            border-radius: 10px 10px 0 0;
          }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .type-badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 600;
            background: white;
           
            margin-bottom: 10px;
          }
          .message-box {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid ;
          }
          .action-button {
            display: inline-block;
            padding: 10px 20px;
            background: ;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin-right: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            color: #999;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="type-badge">
             ${notification.type.toUpperCase()}
            </div>
            <h1 style="margin: 10px 0 0;">${notification.title}</h1>
          </div>
          <div class="content">
            <div class="message-box">
              <p style="margin:0; white-space: pre-wrap;">${notification.message}</p>
            </div>
            
            ${notification.summary ? `
              <p style="color: #6b7280; font-style: italic;">${notification.summary}</p>
            ` : ''}
            
            ${notification.actions?.length ? `
              <div style="margin: 20px 0;">
                ${notification.actions.map((action: any) => `
                  <a href="${action.url}" class="action-button">
                    ${action.icon || '→'} ${action.label}
                  </a>
                `).join('')}
              </div>
            ` : ''}
            
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            
            <p style="color: #6b7280; font-size: 12px;">
              Reference: ${notification.reference.model} - ${notification.reference.number || notification.reference.id}<br>
              ${notification.createdAt ? `Date: ${new Date(notification.createdAt).toLocaleString()}` : ''}
            </p>
          </div>
          <div class="footer">
            <p>We Travel Ethiopia Tours | Notification System</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Mark notification as read
  static async markAsRead(notificationId: string, userId: string) {
    await connectToDatabase();
    
    return Notification.findOneAndUpdate(
      { 
        _id: notificationId,
        $or: [
          { userId },
          { 'recipients.userIds': userId }
        ]
      },
      {
        status: 'read',
        readAt: new Date()
      },
      { new: true }
    );
  }

  // Mark all as read for user
  static async markAllAsRead(userId: string) {
    await connectToDatabase();
    
    return Notification.updateMany(
      {
        $or: [
          { userId },
          { 'recipients.userIds': userId }
        ],
        status: 'unread'
      },
      {
        status: 'read',
        readAt: new Date()
      }
    );
  }

  // Get user notifications
  static async getUserNotifications(userId: string, options: {
    limit?: number;
    offset?: number;
    status?: 'unread' | 'read' | 'archived';
    type?: string;
  } = {}) {
    await connectToDatabase();
    
    const {
      limit = 20,
      offset = 0,
      status,
      type
    } = options;

    const query: any = {
      $or: [
        { userId },
        { 'recipients.userIds': userId },
        { 'recipients.type': 'all' },
        { 
          'recipients.type': 'admins',
          userId: { $exists: true } // Will be filtered by role in next step
        }
      ]
    };

    if (status) query.status = status;
    if (type) query.type = type;

    // Get user role if they're admin
    const user = await User.findById(userId).select('role');
    if (user?.role !== 'admin') {
      // Remove admin notifications for non-admins
      query.$or.push({
        'recipients.type': 'admins',
        userId
      });
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .lean();

    const total = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      ...query,
      status: 'unread'
    });

    return {
      notifications,
      total,
      unreadCount,
      limit,
      offset
    };
  }
}