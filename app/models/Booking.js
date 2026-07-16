// app/models/Booking.ts
import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  bookingNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  // Multiple item type references
  itemType: {
    type: String,
    required: true,
    enum: ['tour', 'destination', 'festival', 'experience', 'offer']
  },
  itemRef: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'itemType',
    required: false
  },
  // Keep individual fields for backward compatibility - make them ALL optional
  tour: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tour',
    required: false,
    default: null
  },
  destination: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Destination',
    required: false,
    default: null
  },
  festival: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Festival',
    required: false,
    default: null
  },
  experience: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Experience',
    required: false,
    default: null
  },
  // Item details snapshot
  itemSnapshot: {
    name: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    duration: {
      type: String,
      required: false
    },
    location: {
      type: String,
      required: false
    },
    image: {
      type: String,
      required: false
    },
    price: {
      type: Number,
      required: true,
      default: 0,
      min: 0
    },
    discount: {
      type: String,
      required: false
    },
    // Additional pricing details
    pricePerPerson: {
      type: Number,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    },
    totalPrice: {
      type: Number,
      default: 0
    },
    deposit: {
      type: Number,
      default: 0
    },
    depositPercentage: {
      type: Number,
      default: 20 // 20% deposit by default
    }
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  travelDate: {
    start: {
      type: Date,
      required: true
    },
    end: {
      type: Date,
      required: true
    }
  },
  numberOfTravelers: {
    adults: {
      type: Number,
      required: true,
      min: 1
    },
    children: {
      type: Number,
      default: 0,
      min: 0
    },
    infants: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  pricing: {
    subtotal: {
      type: Number,
      required: true,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    serviceFee: {
      type: Number,
      default: 0
    },
    discountAmount: {
      type: Number,
      default: 0
    },
    discountType: {
      type: String,
      enum: ['percentage', 'fixed', 'early_bird', 'group', 'seasonal'],
      default: null
    },
    discountCode: {
      type: String,
      default: null
    },
    depositAmount: {
      type: Number,
      default: 0
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0
    },
    currency: {
      type: String,
      default: 'USD'
    }
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid', 'refunded', 'cancelled'],
    default: 'pending'
  },
  paymentMethod: {
    type: String,
    enum: ['credit_card', 'debit_card', 'bank_transfer', 'cash', 'mobile_money'],
    default: 'bank_transfer'
  },
  bookingStatus: {
    type: String,
    enum: ['confirmed', 'pending', 'cancelled', 'completed', 'no-show'],
    default: 'pending'
  },
  specialRequests: {
    type: String,
    maxlength: 500
  },
  accommodations: [{
    type: {
      type: String,
      enum: ['hotel', 'lodge', 'camping', 'resort']
    },
    name: String,
    checkIn: Date,
    checkOut: Date,
    roomType: String,
    numberOfRooms: Number,
    pricePerNight: Number
  }],
  inclusions: [String],
  exclusions: [String],
  travelers: [{
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    dateOfBirth: Date,
    nationality: String,
    passportNumber: String,
    passportExpiry: Date,
    email: String,
    phone: String,
    dietaryRestrictions: String,
    medicalConditions: String
  }],
  emergencyContact: {
    name: {
      type: String,
      required: true
    },
    relationship: String,
    phone: {
      type: String,
      required: true
    },
    email: String
  },
  cancellationPolicy: {
    type: String,
    enum: ['flexible', 'moderate', 'strict'],
    default: 'moderate'
  },
  metadata: {
    ipAddress: String,
    userAgent: String,
    source: {
      type: String,
      enum: ['website', 'mobile_app', 'admin_panel', 'api'],
      default: 'website'
    },
    promoCode: String,
    affiliateId: String
  },
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Update timestamps on save
bookingSchema.pre('save', function() {
  this.updatedAt = new Date();

});

// Calculate total price before saving
bookingSchema.pre('save', function() {
  if (this.pricing) {
    // Calculate total from subtotal + tax + serviceFee - discount
    const subtotal = this.pricing.subtotal || 0;
    const tax = this.pricing.tax || 0;
    const serviceFee = this.pricing.serviceFee || 0;
    const discountAmount = this.pricing.discountAmount || 0;
    
    this.pricing.totalAmount = subtotal + tax + serviceFee - discountAmount;
    
    // Calculate deposit (20% of total by default)
    const depositPercentage = this.itemSnapshot?.depositPercentage || 20;
    this.pricing.depositAmount = (this.pricing.totalAmount * depositPercentage) / 100;
  }
  
});

// Indexes
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ itemRef: 1 });
bookingSchema.index({ itemType: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ 'travelers.email': 1 });
bookingSchema.index({ 'pricing.totalAmount': 1 });
bookingSchema.index({ 'travelDate.start': 1 });
bookingSchema.index({ 'travelDate.end': 1 });

// Compound indexes for common queries
bookingSchema.index({ user: 1, bookingStatus: 1 });
bookingSchema.index({ itemRef: 1, itemType: 1 });
bookingSchema.index({ bookingDate: -1, bookingStatus: 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;