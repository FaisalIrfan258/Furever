import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema(
  {
    donor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor information is required'],
    },
    type: {
      type: String,
      enum: ['general', 'pet-specific', 'emergency-fund', 'shelter-support'],
      default: 'general',
    },
    amount: {
      type: Number,
      required: [true, 'Donation amount is required'],
      min: [1, 'Donation amount must be at least 1'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'paypal', 'bank_transfer', 'other'],
      required: [true, 'Payment method is required'],
    },
    transactionId: {
      type: String,
    },
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
    },
    shelter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringDetails: {
      frequency: {
        type: String,
        enum: ['weekly', 'monthly', 'quarterly', 'annually'],
      },
      nextPaymentDate: {
        type: Date,
      },
      endDate: {
        type: Date,
      },
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      trim: true,
    },
    receiptSent: {
      type: Boolean,
      default: false,
    },
    receiptDetails: {
      sentAt: Date,
      receiptNumber: String,
    },
  },
  {
    timestamps: true,
  }
);

const Donation = mongoose.model('Donation', donationSchema);

export default Donation; 