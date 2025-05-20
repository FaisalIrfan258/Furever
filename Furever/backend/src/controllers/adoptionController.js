import Adoption from '../models/Adoption.js';
import Pet from '../models/Pet.js';
import { ErrorResponse } from '../middleware/error.js';
import { validationResult } from 'express-validator';

// @desc    Get all adoption applications
// @route   GET /api/adoption
// @access  Private (Admin/Shelter)
export const getAdoptions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    // If shelter user, only show their pets' applications
    if (req.user.role === 'shelter') {
      // First get all pets owned by this shelter
      const shelterPets = await Pet.find({ shelter: req.user.id }).select('_id');
      const petIds = shelterPets.map(pet => pet._id);
      
      // Then find adoptions for these pets
      query.pet = { $in: petIds };
    }
    
    // Filter by status if provided
    if (req.query.status && ['pending', 'approved', 'rejected'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Filter by pet if provided
    if (req.query.pet) {
      query.pet = req.query.pet;
    }
    
    // Filter by user if provided
    if (req.query.user) {
      query.user = req.query.user;
    }
    
    const total = await Adoption.countDocuments(query);
    
    const adoptions = await Adoption.find(query)
      .populate('user', 'name email')
      .populate('pet', 'name type breed')
      .populate('reviewedBy', 'name')
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
      count: adoptions.length,
      pagination,
      data: adoptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's adoption applications
// @route   GET /api/adoption/my-applications
// @access  Private
export const getUserAdoptions = async (req, res, next) => {
  try {
    const adoptions = await Adoption.find({ user: req.user.id })
      .populate('pet', 'name type breed photos')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: adoptions.length,
      data: adoptions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single adoption application
// @route   GET /api/adoption/:id
// @access  Private
export const getAdoption = async (req, res, next) => {
  try {
    const adoption = await Adoption.findById(req.params.id)
      .populate('user', 'name email phone address')
      .populate({
        path: 'pet',
        populate: {
          path: 'shelter',
          select: 'name email phone',
        },
      })
      .populate('reviewedBy', 'name');
    
    if (!adoption) {
      return next(new ErrorResponse(`Adoption application not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to view this application
    if (
      req.user.role !== 'admin' &&
      req.user.id !== adoption.user._id.toString() &&
      !(
        req.user.role === 'shelter' &&
        adoption.pet.shelter._id.toString() === req.user.id
      )
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to view this application`,
          403
        )
      );
    }
    
    res.json({
      success: true,
      data: adoption,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new adoption application
// @route   POST /api/adoption
// @access  Private
export const createAdoption = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    // Add user from req
    req.body.user = req.user.id;
    
    // Check if pet exists and is available
    const pet = await Pet.findById(req.body.pet);
    
    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.body.pet}`, 404));
    }
    
    if (pet.availability.status !== 'available') {
      return next(
        new ErrorResponse(
          `Pet with id ${req.body.pet} is not available for adoption`,
          400
        )
      );
    }
    
    // Check if user already has pending application for this pet
    const existingApplication = await Adoption.findOne({
      user: req.user.id,
      pet: req.body.pet,
      status: 'pending',
    });
    
    if (existingApplication) {
      return next(
        new ErrorResponse(
          `You already have a pending application for this pet`,
          400
        )
      );
    }
    
    const adoption = await Adoption.create(req.body);
    
    // Update pet status to pending
    pet.availability.status = 'pending';
    await pet.save();
    
    res.status(201).json({
      success: true,
      data: adoption,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update adoption application status (approve/reject)
// @route   PUT /api/adoption/:id
// @access  Private (Admin/Shelter)
export const updateAdoptionStatus = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    let adoption = await Adoption.findById(req.params.id);
    
    if (!adoption) {
      return next(new ErrorResponse(`Adoption application not found with id of ${req.params.id}`, 404));
    }
    
    // Get pet to check if shelter user is authorized
    const pet = await Pet.findById(adoption.pet);
    
    // Check if user is authorized to update this application
    if (
      req.user.role !== 'admin' &&
      !(req.user.role === 'shelter' && pet.shelter.toString() === req.user.id)
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this application`,
          403
        )
      );
    }
    
    // Update status and review info
    adoption.status = req.body.status;
    adoption.reviewNotes = req.body.reviewNotes;
    adoption.reviewedBy = req.user.id;
    adoption.reviewedAt = Date.now();
    
    await adoption.save();
    
    // Update pet status based on adoption status
    if (req.body.status === 'approved') {
      pet.availability.status = 'adopted';
      
      // Reject all other pending applications for this pet
      await Adoption.updateMany(
        {
          pet: pet._id,
          _id: { $ne: adoption._id },
          status: 'pending',
        },
        {
          status: 'rejected',
          reviewNotes: 'Pet has been adopted by another applicant',
          reviewedBy: req.user.id,
          reviewedAt: Date.now(),
        }
      );
    } else if (req.body.status === 'rejected') {
      // If this is the only pending application, set pet back to available
      const pendingApplications = await Adoption.countDocuments({
        pet: pet._id,
        status: 'pending',
      });
      
      if (pendingApplications === 0) {
        pet.availability.status = 'available';
      }
    }
    
    await pet.save();
    
    res.json({
      success: true,
      data: adoption,
    });
  } catch (error) {
    next(error);
  }
}; 