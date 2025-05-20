import mongoose from 'mongoose';

const rescueSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Reporter information is required'],
    },
    animalType: {
      type: String,
      required: [true, 'Animal type is required'],
      trim: true,
      lowercase: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    estimatedAge: {
      type: String,
      enum: ['baby', 'young', 'adult', 'senior', 'unknown'],
      default: 'unknown',
    },
    condition: {
      type: String,
      enum: ['healthy', 'injured', 'critical', 'unknown'],
      required: [true, 'Condition is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
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
    location: {
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
        city: String,
        state: String,
        zipCode: String,
        country: String,
      },
      landmark: String,
    },
    status: {
      type: String,
      enum: ['reported', 'in-progress', 'rescued', 'closed'],
      default: 'reported',
    },
    urgencyLevel: {
      type: String,
      enum: ['low', 'medium', 'high', 'emergency'],
      default: 'medium',
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    notes: [
      {
        content: {
          type: String,
          required: true,
        },
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    contactInfo: {
      name: String,
      phone: String,
      email: String,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for location-based queries
rescueSchema.index({ location: '2dsphere' });

const Rescue = mongoose.model('Rescue', rescueSchema);

export default Rescue; 