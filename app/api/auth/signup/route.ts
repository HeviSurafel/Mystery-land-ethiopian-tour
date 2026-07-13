// app/api/auth/signup/route.ts
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/seo/mongodb';
import User from '@/models/User';
import { generateOTP, getOTPExpiry } from '@/lib/seo/otp';
import { emailService } from '@/lib/email/emailService';

export async function POST(req: Request) {
  try {
    console.log('🟢 Signup API called - Mystery Ethiopia Tours');
    
    const { name, email, password } = await req.json();
    console.log('📝 Received data:', { name, email, password: '***' });

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Validation failed: Missing fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      console.log('❌ Validation failed: Password too short');
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Connect to database
    console.log('🔄 Connecting to database...');
    await connectToDatabase();
    console.log('✅ Connected to database');

    // Check if user exists
    console.log('🔍 Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('❌ User already exists:', email);
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }
    console.log('✅ User does not exist');

    // Hash password
    console.log('🔒 Hashing password...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('✅ Password hashed');

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();
    console.log('📧 Generated OTP:', otp);

    // Create user
    console.log('💾 Creating user in database...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      isVerified: false,
      role: 'client'
    });
    console.log('✅ User created successfully:', user._id);

    // Send OTP email using emailService
    try {
      console.log('📧 Sending OTP email via emailService...');
      const result = await emailService.sendOTPEmail(email, otp, name);
      
      if (result.success) {
        console.log('✅ OTP email sent successfully');
        if (result.devMode) {
          console.log('📧 [DEV MODE] OTP would be sent to:', email);
          console.log('📧 [DEV MODE] OTP:', otp);
        }
      } else {
        console.log('⚠️ OTP email sending failed:', result.error);
        console.log('📧 [DEV MODE] OTP for testing:', otp);
      }
    } catch (emailError) {
      console.error('❌ Failed to send OTP email (non-critical):', emailError);
      console.log('📧 [DEV MODE] OTP for testing:', otp);
    }

    // Return success response
    return NextResponse.json(
      { 
        message: 'User created successfully. Please verify your email with OTP.',
        userId: user._id,
        // Include OTP in development for testing
        ...(process.env.NODE_ENV === 'development' && { otp })
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('❌ Signup error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}