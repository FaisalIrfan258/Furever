import mongoose from 'mongoose';

const petSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Pet name is required'],
      trim: true,
    },
    type: {
      type: String,
      required: [true, 'Pet type is required'],
      trim: true,
      lowercase: true,
    },
    breed: {
      type: String,
      required: [true, 'Pet breed is required'],
      trim: true,
    },
    age: {
      value: {
        type: Number,
        required: [true, 'Age value is required'],
      },
      unit: {
        type: String,
        enum: ['days', 'months', 'years'],
        default: 'years',
      },
    },
    gender: {
      type: String,
      enum: ['male', 'female', 'unknown'],
      required: [true, 'Gender is required'],
    },
    size: {
      type: String,
      enum: ['small', 'medium', 'large', 'extra-large'],
      required: [true, 'Size is required'],
    },
    color: {
      type: String,
      required: [true, 'Color is required'],
      trim: true,
    },
    health: {
      vaccinated: {
        type: Boolean,
        default: false,
      },
      neutered: {
        type: Boolean,
        default: false,
      },
      medicalConditions: {
        type: [String],
        default: [],
      },
      specialNeeds: {
        type: Boolean,
        default: false,
      },
      specialNeedsDescription: {
        type: String,
        trim: true,
      },
    },
    behavior: {
      temperament: {
        type: String,
        trim: true,
      },
      goodWith: {
        children: {
          type: Boolean,
          default: false,
        },
        dogs: {
          type: Boolean,
          default: false,
        },
        cats: {
          type: Boolean,
          default: false,
        },
      },
      trained: {
        type: Boolean,
        default: false,
      },
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
        isMain: {
          type: Boolean,
          default: false,
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
        default: [0, 0],
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
        zipCode: {
          type: String,
          required: [true, 'Zip code is required'],
        },
        country: {
          type: String,
          required: [true, 'Country is required'],
        },
      },
    },
    availability: {
      status: {
        type: String,
        enum: ['available', 'pending', 'adopted'],
        default: 'available',
      },
      adoptionFee: {
        type: Number,
        default: 0,
      },
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Shelter information is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Create index for location-based queries
petSchema.index({ location: '2dsphere' });

// Create index for searching
petSchema.index({
  name: 'text',
  type: 'text',
  breed: 'text',
  description: 'text',
  'location.address.city': 'text',
  'location.address.state': 'text',
});

const Pet = mongoose.model('Pet', petSchema);

export default Pet; 