import Donation from '../models/Donation.js';
import Pet from '../models/Pet.js';
import User from '../models/User.js';
import { ErrorResponse } from '../middleware/error.js';
import { validationResult } from 'express-validator';

// @desc    Get all donations
// @route   GET /api/donate
// @access  Private (Admin)
export const getDonations = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    // Filter by type if provided
    if (req.query.type && ['general', 'pet-specific', 'emergency-fund', 'shelter-support'].includes(req.query.type)) {
      query.type = req.query.type;
    }
    
    // Filter by status if provided
    if (req.query.status && ['pending', 'completed', 'failed', 'refunded'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Filter by donor if provided
    if (req.query.donor) {
      query.donor = req.query.donor;
    }
    
    // Filter by pet if provided
    if (req.query.pet) {
      query.pet = req.query.pet;
    }
    
    // Filter by shelter if provided
    if (req.query.shelter) {
      query.shelter = req.query.shelter;
    }
    
    // Filter by recurring status if provided
    if (req.query.isRecurring === 'true') {
      query.isRecurring = true;
    } else if (req.query.isRecurring === 'false') {
      query.isRecurring = false;
    }
    
    // Filter by date range
    if (req.query.startDate && req.query.endDate) {
      query.createdAt = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      query.createdAt = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query.createdAt = { $lte: new Date(req.query.endDate) };
    }
    
    const total = await Donation.countDocuments(query);
    
    const donations = await Donation.find(query)
      .populate('donor', 'name email')
      .populate('pet', 'name type breed')
      .populate('shelter', 'name')
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    // Pagination result
    const pagination = {
      total,
      pages: Math.ceil(total / limit),
      page,
      limit,
    };
    
    if (startIndex > 0) {
      pagination.prev = page - 1;
    }
    
    if (startIndex + limit < total) {
      pagination.next = page + 1;
    }
    
    res.json({
      success: true,
      count: donations.length,
      pagination,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's donations
// @route   GET /api/donate/my-donations
// @access  Private
export const getUserDonations = async (req, res, next) => {
  try {
    const donations = await Donation.find({ donor: req.user.id })
      .populate('pet', 'name type breed photos')
      .populate('shelter', 'name')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single donation
// @route   GET /api/donate/:id
// @access  Private
export const getDonation = async (req, res, next) => {
  try {
    const donation = await Donation.findById(req.params.id)
      .populate('donor', 'name email')
      .populate('pet', 'name type breed photos')
      .populate('shelter', 'name');
    
    if (!donation) {
      return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to view this donation
    if (
      req.user.role !== 'admin' &&
      donation.donor.toString() !== req.user.id &&
      !(req.user.role === 'shelter' && donation.shelter && donation.shelter._id.toString() === req.user.id)
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this donation`,
          403
        )
      );
    }
    
    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new donation
// @route   POST /api/donate
// @access  Private
export const createDonation = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    // Add donor from req
    req.body.donor = req.user.id;
    
    // Validate pet if provided
    if (req.body.pet) {
      const pet = await Pet.findById(req.body.pet);
      
      if (!pet) {
        return next(new ErrorResponse(`Pet not found with id of ${req.body.pet}`, 404));
      }
      
      // If pet-specific donation, set the shelter to the pet's shelter
      req.body.shelter = pet.shelter;
      req.body.type = 'pet-specific';
    }
    
    // Validate shelter if provided
    if (req.body.shelter && !req.body.pet) {
      const shelter = await User.findById(req.body.shelter);
      
      if (!shelter || shelter.role !== 'shelter') {
        return next(new ErrorResponse(`Shelter not found with id of ${req.body.shelter}`, 404));
      }
      
      req.body.type = 'shelter-support';
    }
    
    // Set recurring details if isRecurring is true
    if (req.body.isRecurring) {
      if (!req.body.recurringDetails || !req.body.recurringDetails.frequency) {
        return next(new ErrorResponse('Recurring frequency is required for recurring donations', 400));
      }
      
      // Set next payment date based on frequency
      const nextPaymentDate = new Date();
      switch (req.body.recurringDetails.frequency) {
        case 'weekly':
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
          break;
        case 'monthly':
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          break;
        case 'quarterly':
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
          break;
        case 'annually':
          nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
          break;
        default:
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1); // Default to monthly
      }
      
      req.body.recurringDetails.nextPaymentDate = nextPaymentDate;
    }
    
    // In a real application, this would integrate with a payment gateway
    // For now, we'll simulate a successful payment
    req.body.status = 'completed';
    req.body.transactionId = `TR-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const donation = await Donation.create(req.body);
    
    res.status(201).json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update donation status (admin only)
// @route   PUT /api/donate/:id
// @access  Private (Admin)
export const updateDonationStatus = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    let donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
    }
    
    // Only admin can update donation status
    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this donation`,
          403
        )
      );
    }
    
    // Update status
    donation.status = req.body.status;
    
    // If refunded, add refund details
    if (req.body.status === 'refunded') {
      donation.refundDetails = {
        refundedAt: Date.now(),
        refundReason: req.body.refundReason || 'Administrative decision',
      };
    }
    
    await donation.save();
    
    res.json({
      success: true,
      data: donation,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel recurring donation
// @route   PUT /api/donate/:id/cancel-recurring
// @access  Private
export const cancelRecurringDonation = async (req, res, next) => {
  try {
    let donation = await Donation.findById(req.params.id);
    
    if (!donation) {
      return next(new ErrorResponse(`Donation not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to cancel this recurring donation
    if (
      req.user.role !== 'admin' &&
      donation.donor.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to cancel this recurring donation`,
          403
        )
      );
    }
    
    // Check if donation is recurring
    if (!donation.isRecurring) {
      return next(new ErrorResponse('This is not a recurring donation', 400));
    }
    
    // Cancel recurring donation
    donation.isRecurring = false;
    donation.recurringDetails.endDate = Date.now();
    
    await donation.save();
    
    res.json({
      success: true,
      data: donation,
      message: 'Recurring donation cancelled successfully',
    });
  } catch (error) {
    next(error);
  }
}; 