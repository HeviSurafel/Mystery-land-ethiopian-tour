import mongoose from 'mongoose';

// Define role type for better TypeScript support
const UserRole = 'client' | 'admin' ;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  role: {
    type: String,
    enum: {
      values: ['client', 'admin', 'owner'],
      message: '{VALUE} is not a valid role'
    },
    default: 'client',
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otp: {
    type: String,
  },
  avatar:{
    type: String
  },
  otpExpiry: {
    type: Date,
  },
   resetToken: {
    type: String,
    unique: true,
    sparse: true, // Allows multiple null values
  },
  resetTokenExpiry: {
    type: Date,
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

// Update timestamps on save
userSchema.pre('save', function(next) {
  this.updatedAt = new Date();
 
});


// Check if model exists before creating new one
const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;