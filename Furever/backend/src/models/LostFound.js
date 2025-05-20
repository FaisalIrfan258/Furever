import mongoose from 'mongoose';

const lostFoundSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User information is required'],
    },
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: [true, 'Report type is required'],
    },
    petDetails: {
      name: {
        type: String,
        trim: true,
      },
      species: {
        type: String,
        required: [true, 'Animal species is required'],
        trim: true,
        lowercase: true,
      },
      breed: {
        type: String,
        trim: true,
      },
      color: {
        type: String,
        required: [true, 'Color is required'],
        trim: true,
      },
      age: {
        type: String,
        enum: ['baby', 'young', 'adult', 'senior', 'unknown'],
        default: 'unknown',
      },
      gender: {
        type: String,
        enum: ['male', 'female', 'unknown'],
        default: 'unknown',
      },
      size: {
        type: String,
        enum: ['small', 'medium', 'large', 'extra-large', 'unknown'],
        default: 'unknown',
      },
      distinctiveFeatures: {
        type: String,
        trim: true,
      },
      collarDetails: {
        hasCollar: {
          type: Boolean,
          default: false,
        },
        collarColor: String,
        hasTag: Boolean,
        tagInfo: String,
      },
      microchipped: {
        type: Boolean,
        default: false,
      },
    },
    photos: [
      {
        url: {
          type: String,
          required: true,
        },
        publicId: {
          type: String,
          required: true,
        },
      },
    ],
    lastSeenLocation: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
      },
      address: {
        street: String,
        city: {
          type: String,
          required: [true, 'City is required'],
        },
        state: {
          type: String,
          required: [true, 'State is required'],
        },
        zipCode: String,
        country: {
          type: String,
          required: [true, 'Country is required'],
        },
      },
      landmark: String,
      date: {
        type: Date,
        required: [true, 'Date last seen is required'],
      },
      time: String,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    contactInfo: {
      name: {
        type: String,
        required: [true, 'Contact name is required'],
      },
      phone: {
        type: String,
        required: [true, 'Contact phone is required'],
      },
      email: {
        type: String,
        required: [true, 'Contact email is required'],
      },
      preferredContactMethod: {
        type: String,
        enum: ['phone', 'email', 'both'],
        default: 'both',
      },
    },
    status: {
      type: String,
      enum: ['active', 'resolved', 'expired'],
      default: 'active',
    },
    reward: {
      offered: {
        type: Boolean,
        default: false,
      },
      amount: {
        type: Number,
        default: 0,
      },
    },
    expiryDate: {
      type: Date,
      default: function() {
        const date = new Date();
        date.setDate(date.getDate() + 30); // Default 30 days expiry
        return date;
      },
    },
    matchedWith: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LostFound',
    },
  },
  {
    timestamps: true,
  }
);

// Create index for location-based queries
lostFoundSchema.index({ 'lastSeenLocation': '2dsphere' });

// Create text index for searching
lostFoundSchema.index({
  'petDetails.name': 'text',
  'petDetails.species': 'text',
  'petDetails.breed': 'text',
  'petDetails.distinctiveFeatures': 'text',
  'description': 'text',
  'lastSeenLocation.address.city': 'text',
  'lastSeenLocation.address.state': 'text',
});

const LostFound = mongoose.model('LostFound', lostFoundSchema);

export default LostFound; 