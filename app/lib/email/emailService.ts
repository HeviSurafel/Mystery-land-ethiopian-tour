// lib/email/emailService.ts
import nodemailer from 'nodemailer';

export interface EmailData {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content?: string | Buffer;
    path?: string;
  }>;
}

export interface InquiryEmailData {
  name: string;
  email: string;
  phone?: string;
  inquiryType: string;
  message: string;
  tourInterest?: string;
  travelDate?: string;
  groupSize?: number;
  budget?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private fromEmail: string;
  private isConfigured: boolean = false;

  constructor() {
    // Use the Gmail address as the from email
    this.fromEmail = 'surafelwondu5647@gmail.com';
    this.initializeTransporter();
  }

  private initializeTransporter() {
    const emailUser = 'surafelwondu5647@gmail.com';
    const emailPassword = 'pcabecdzduafwxzv';
    
    if (!emailUser || !emailPassword) {
      console.warn('⚠️ Email credentials not configured. Email sending will be disabled.');
      this.transporter = null;
      this.isConfigured = false;
      return;
    }

    try {
      console.log('📧 Initializing email transporter with Gmail...');
      console.log(`📧 Email user: ${emailUser}`);

      // Create transporter with Gmail settings
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: emailUser,
          pass: emailPassword,
        },
        // These settings help with Gmail
        tls: {
          rejectUnauthorized: false
        },
        connectionTimeout: 10000,
        greetingTimeout: 10000,
        socketTimeout: 10000,
      });

      // Mark as configured (we'll verify asynchronously)
      this.isConfigured = true;
      console.log('✅ Email transporter initialized');

      // Verify connection asynchronously
      this.verifyConnection();

    } catch (error) {
      console.error('❌ Failed to create email transporter:', error);
      this.transporter = null;
      this.isConfigured = false;
    }
  }

  private async verifyConnection() {
    if (!this.transporter) return;

    try {
      await this.transporter.verify();
      console.log('✅ Email transporter verified successfully for Mystery Ethiopia Tours');
    } catch (error: any) {
      console.error('❌ Email transporter verification failed:', error.message);
      console.error('💡 Please check:');
      console.error('   1. Your Gmail app password is correct');
      console.error('   2. 2-Step Verification is enabled on your Gmail account');
      console.error('   3. The app password was generated for "Mail" app');
      console.error('   4. Using app password: pcabecdzduafwxzv');
      this.transporter = null;
      this.isConfigured = false;
    }
  }

  async sendEmail(data: EmailData) {
    // If not configured or no transporter, log and return success (dev mode)
    if (!this.isConfigured || !this.transporter) {
      console.log('📧 [DEV MODE] Email would be sent:', {
        to: data.to,
        subject: data.subject,
        from: data.from || this.fromEmail,
      });
      return { success: true, messageId: 'dev-mode', devMode: true };
    }

    try {
      const mailOptions = {
        from: data.from || this.fromEmail,
        to: Array.isArray(data.to) ? data.to.join(', ') : data.to,
        subject: data.subject,
        html: data.html,
        cc: data.cc?.join(', '),
        bcc: data.bcc?.join(', '),
        attachments: data.attachments,
      };

      console.log(`📧 Sending email to ${data.to}...`);
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`✅ Email sent successfully to ${data.to}`);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('❌ Email sending failed:', error.message);
      return { 
        success: false, 
        error: error.message || 'Unknown error' 
      };
    }
  }

// lib/email/emailService.ts (partial - the sendOTPEmail method)
async sendOTPEmail(email: string, otp: string, name: string) {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #004525; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
        .otp-code { font-size: 36px; font-weight: bold; color: #004525; text-align: center; padding: 20px; background: white; border-radius: 10px; margin: 20px 0; letter-spacing: 10px; }
        .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        .warning { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0;">Welcome to Mystery Ethiopia Tours!</h1>
        </div>
        <div class="content">
          <p>Hello <strong>${name}</strong>,</p>
          <p>Thank you for signing up! Please verify your email address using the OTP below:</p>
          <div class="otp-code">${otp}</div>
          <p>This OTP will expire in 10 minutes.</p>
          <div class="warning">
            <p style="margin:0;">⚠️ If you didn't create an account with us, please ignore this email.</p>
          </div>
          <p>Safe travels,<br><strong>The Mystery Ethiopia Tours Team</strong></p>
          <div class="footer">
            <p>Mystery Ethiopia Tours | Addis Ababa, Ethiopia<br>
            📧 surafelwondu5647@gmail.com | 📞+251916712096</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  return this.sendEmail({
    to: email,
    subject: '🔐 Verify Your Email - Mystery Ethiopia Tours',
    html,
  });
}
  async sendAdminNotification(inquiryData: InquiryEmailData) {
    const adminEmail = 'surafelwondu5647@gmail.com';
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #004525; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; padding: 15px; background: white; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .label { font-weight: bold; color: #555; display: block; margin-bottom: 5px; font-size: 12px; text-transform: uppercase; }
          .value { color: #333; font-size: 16px; }
          .badge { display: inline-block; padding: 5px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; }
          .badge-urgent { background: #fee; color: #c00; }
          .badge-new { background: #e3f2fd; color: #1565c0; }
          .button { display: inline-block; padding: 12px 30px; background: #004525; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">🔔 New Inquiry Received</h1>
            <p style="margin:10px 0 0; opacity:0.9;">${new Date().toLocaleString()}</p>
          </div>
          <div class="content">
            <div class="field">
              <span class="label">Priority</span>
              <span class="badge ${inquiryData.inquiryType === 'urgent' ? 'badge-urgent' : 'badge-new'}">
                ${inquiryData.inquiryType.toUpperCase()}
              </span>
            </div>
            
            <div class="field">
              <span class="label">From</span>
              <div class="value">
                <strong>${inquiryData.name}</strong><br>
                📧 <a href="mailto:${inquiryData.email}">${inquiryData.email}</a><br>
                ${inquiryData.phone ? `📞 ${inquiryData.phone}` : ''}
              </div>
            </div>

            ${inquiryData.tourInterest ? `
            <div class="field">
              <span class="label">Tour Interest</span>
              <div class="value">${inquiryData.tourInterest}</div>
            </div>
            ` : ''}

            ${inquiryData.travelDate ? `
            <div class="field">
              <span class="label">Travel Date</span>
              <div class="value">📅 ${inquiryData.travelDate}</div>
            </div>
            ` : ''}

            ${inquiryData.groupSize ? `
            <div class="field">
              <span class="label">Group Size</span>
              <div class="value">👥 ${inquiryData.groupSize} people</div>
            </div>
            ` : ''}

            ${inquiryData.budget ? `
            <div class="field">
              <span class="label">Budget Range</span>
              <div class="value">💰 ${inquiryData.budget}</div>
            </div>
            ` : ''}

            <div class="field">
              <span class="label">Message</span>
              <div class="value" style="white-space: pre-wrap; background: #f5f5f5; padding: 15px; border-radius: 5px;">
                ${inquiryData.message}
              </div>
            </div>

            <div style="text-align: center;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard/admin/inquiries" class="button">
                View in Dashboard →
              </a>
            </div>
          </div>
          <div class="footer">
            <p>Mystery Ethiopia Tours | Admin Notification System</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: adminEmail,
      subject: `[${inquiryData.inquiryType.toUpperCase()}] New inquiry from ${inquiryData.name}`,
      html,
    });
  }

  async sendAutoReply(inquiryData: InquiryEmailData) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #004525; color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .summary { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #004525; }
          .signature { margin-top: 40px; padding: 20px; background: white; border-radius: 8px; text-align: center; }
          .social-links { margin: 20px 0; }
          .social-links a { display: inline-block; margin: 0 10px; color: #004525; text-decoration: none; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">Thank You for Contacting Us! 🎉</h1>
          </div>
          <div class="content">
            <p>Dear <strong>${inquiryData.name}</strong>,</p>
            
            <p>Thank you for reaching out to Mystery Ethiopia Tours. We're thrilled to help you plan your Ethiopian adventure!</p>

            <div class="summary">
              <h3 style="margin-top:0; color:#004525;">📋 Inquiry Summary</h3>
              <p><strong>Type:</strong> ${inquiryData.inquiryType.replace('-', ' ').toUpperCase()}</p>
              ${inquiryData.tourInterest ? `<p><strong>Tour Interest:</strong> ${inquiryData.tourInterest}</p>` : ''}
              ${inquiryData.travelDate ? `<p><strong>Travel Date:</strong> ${inquiryData.travelDate}</p>` : ''}
              ${inquiryData.groupSize ? `<p><strong>Group Size:</strong> ${inquiryData.groupSize} people</p>` : ''}
              ${inquiryData.budget ? `<p><strong>Budget:</strong> ${inquiryData.budget}</p>` : ''}
            </div>

            <p><strong>⏰ We'll respond within 24 hours.</strong></p>

            <div class="signature">
              <p style="margin:0;"><strong>While you wait:</strong></p>
              <div class="social-links">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/tours">Browse Tours</a> |
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/reviews">Read Reviews</a> |
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/blog">Travel Blog</a>
              </div>
            </div>

            <p>Safe travels,<br>
            <strong>The Mystery Ethiopia Tours Team</strong></p>

            <div class="footer">
              <p>Mystery Ethiopia Tours | Addis Ababa, Ethiopia<br>
              📧 surafelwondu5647@gmail.com | 📞 +251916712096</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: inquiryData.email,
      subject: `✨ Thank you for contacting Mystery Ethiopia Tours`,
      html,
    });
  }

  async sendResetPasswordEmail(email: string, name: string, resetToken: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #004525; color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 15px 40px; background: #004525; color: white; text-decoration: none; border-radius: 8px; font-weight: bold; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
          .warning { background: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            
            <p>We received a request to reset your password for your Mystery Ethiopia Tours account.</p>

            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Your Password</a>
            </div>

            <div class="warning">
              <p style="margin:0;"><strong>⚠️ This link will expire in 1 hour</strong></p>
            </div>

            <p>If the button doesn't work, copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px;">${resetUrl}</p>

            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>

            <p>Safe travels,<br>
            <strong>The Mystery Ethiopia Tours Team</strong></p>

            <div class="footer">
              <p>Mystery Ethiopia Tours | Addis Ababa, Ethiopia<br>
              📧 surafelwondu5647@gmail.com | 📞+251916712096</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '🔐 Password Reset Request - Mystery Ethiopia Tours',
      html,
    });
  }

  async sendPasswordResetConfirmation(email: string, name: string) {
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #004525; color: white; padding: 40px 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
          .success { background: #d4edda; border: 1px solid #c3e6cb; color: #155724; padding: 15px; border-radius: 8px; margin: 20px 0; text-align: center; }
          .button { display: inline-block; padding: 12px 30px; background: #004525; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; }
          .footer { text-align: center; margin-top: 30px; color: #999; font-size: 12px; border-top: 1px solid #eee; padding-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="margin:0;">✅ Password Reset Successful</h1>
          </div>
          <div class="content">
            <p>Hello <strong>${name}</strong>,</p>
            
            <div class="success">
              <p style="margin:0; font-size: 18px;">Your password has been successfully reset!</p>
            </div>

            <p>You can now log in to your account with your new password.</p>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/login" class="button">Go to Login</a>
            </div>

            <p>If you didn't make this change, please contact us immediately.</p>

            <p>Safe travels,<br>
            <strong>The Mystery Ethiopia Tours Team</strong></p>

            <div class="footer">
              <p>Mystery Ethiopia Tours | Addis Ababa, Ethiopia<br>
              📧 surafelwondu5647@gmail.com | 📞 +251916712096</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;

    return this.sendEmail({
      to: email,
      subject: '✅ Password Reset Successful - Mystery Ethiopia Tours',
      html,
    });
  }
}

export const emailService = new EmailService();