import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    species: {
      type: String,
      required: [true, 'Species is required'],
      enum: ['Dog', 'Cat', 'Bird', 'Small Animal', 'Reptile', 'Other'],
      trim: true,
    },
    breed: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      min: 0,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Unknown'],
      required: true,
    },
    size: {
      type: String,
      enum: ['Small', 'Medium', 'Large', 'Extra Large'],
    },
    color: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
    },
    healthStatus: {
      type: String,
      trim: true,
    },
    adoptionStatus: {
      type: String,
      enum: ['Available', 'Pending', 'Adopted', 'Fostered', 'Not Available'],
      default: 'Available',
    },
    images: [String],
    location: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
    specialNeeds: {
      type: Boolean,
      default: false,
    },
    specialNeedsDetails: {
      type: String,
    },
    goodWith: {
      type: [String],
      enum: ['children', 'dogs', 'cats', 'seniors', 'adults'],
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    adoptionFee: {
      type: Number,
      default: 0,
    },
    microchipId: {
      type: String,
    },
    intakeDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Add text index for search functionality
petSchema.index({
  name: 'text',
  species: 'text',
  breed: 'text',
  description: 'text',
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet; 