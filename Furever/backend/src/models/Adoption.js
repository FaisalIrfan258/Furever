import mongoose from 'mongoose';

const adoptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      required: [true, 'Pet is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    applicationDetails: {
      housingType: {
        type: String,
        enum: ['apartment', 'house', 'townhouse', 'other'],
        required: [true, 'Housing type is required'],
      },
      hasYard: {
        type: Boolean,
        required: [true, 'Yard information is required'],
      },
      hasChildren: {
        type: Boolean,
        required: [true, 'Children information is required'],
      },
      hasOtherPets: {
        type: Boolean,
        required: [true, 'Other pets information is required'],
      },
      otherPetsDetails: {
        type: String,
      },
      workSchedule: {
        type: String,
        required: [true, 'Work schedule is required'],
      },
      experienceWithPets: {
        type: String,
        required: [true, 'Experience with pets is required'],
      },
      reasonForAdoption: {
        type: String,
        required: [true, 'Reason for adoption is required'],
      },
      references: [
        {
          name: String,
          relationship: String,
          phone: String,
          email: String,
        },
      ],
    },
    reviewNotes: {
      type: String,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Adoption = mongoose.model('Adoption', adoptionSchema);

export default Adoption; 