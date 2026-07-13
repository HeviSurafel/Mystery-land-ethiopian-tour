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
  // Item details snapshot - define as a nested object, not a string
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
      required: false
    },
    discount: {
      type: String,
      required: false
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
    numberOfRooms: Number
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
    }
  }
}, {
  timestamps: true
});

// Update timestamps on save
bookingSchema.pre('save', function() {
  this.updatedAt = new Date();
});

// Indexes
bookingSchema.index({ bookingNumber: 1 });
bookingSchema.index({ user: 1 });
bookingSchema.index({ itemRef: 1 });
bookingSchema.index({ itemType: 1 });
bookingSchema.index({ bookingStatus: 1 });
bookingSchema.index({ 'travelers.email': 1 });

const Booking = mongoose.models.Booking || mongoose.model('Booking', bookingSchema);

export default Booking;