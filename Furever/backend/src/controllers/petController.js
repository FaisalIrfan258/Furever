import Pet from '../models/Pet.js';
import { ErrorResponse } from '../middleware/error.js';
import { validationResult } from 'express-validator';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all pets with filtering, sorting, and pagination
// @route   GET /api/pets
// @access  Public
export const getPets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    // Build query
    const query = {};
    
    // Filter by type
    if (req.query.type) {
      query.type = req.query.type.toLowerCase();
    }
    
    // Filter by breed
    if (req.query.breed) {
      query.breed = { $regex: req.query.breed, $options: 'i' };
    }
    
    // Filter by age
    if (req.query.minAge && req.query.maxAge) {
      query['age.value'] = { 
        $gte: parseInt(req.query.minAge),
        $lte: parseInt(req.query.maxAge)
      };
      if (req.query.ageUnit) {
        query['age.unit'] = req.query.ageUnit;
      }
    } else if (req.query.minAge) {
      query['age.value'] = { $gte: parseInt(req.query.minAge) };
      if (req.query.ageUnit) {
        query['age.unit'] = req.query.ageUnit;
      }
    } else if (req.query.maxAge) {
      query['age.value'] = { $lte: parseInt(req.query.maxAge) };
      if (req.query.ageUnit) {
        query['age.unit'] = req.query.ageUnit;
      }
    }
    
    // Filter by size
    if (req.query.size) {
      query.size = req.query.size;
    }
    
    // Filter by gender
    if (req.query.gender) {
      query.gender = req.query.gender;
    }
    
    // Filter by availability
    if (req.query.status) {
      query['availability.status'] = req.query.status;
    }
    
    // Filter by location (city, state)
    if (req.query.city) {
      query['location.address.city'] = { $regex: req.query.city, $options: 'i' };
    }
    
    if (req.query.state) {
      query['location.address.state'] = { $regex: req.query.state, $options: 'i' };
    }
    
    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortFields = req.query.sort.split(',');
      sortFields.forEach((field) => {
        if (field.startsWith('-')) {
          sort[field.substring(1)] = -1;
        } else {
          sort[field] = 1;
        }
      });
    } else {
      sort = { createdAt: -1 }; // Default sort by newest
    }
    
    // Executing query with pagination
    const total = await Pet.countDocuments(query);
    
    const pets = await Pet.find(query)
      .populate('shelter', 'name email phone')
      .sort(sort)
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
      count: pets.length,
      pagination,
      data: pets,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single pet
// @route   GET /api/pets/:id
// @access  Public
export const getPet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id).populate('shelter', 'name email phone');
    
    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }
    
    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new pet
// @route   POST /api/pets
// @access  Private (Admin/Shelter)
export const createPet = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    // Add shelter info from logged in user
    req.body.shelter = req.user.id;
    
    // Upload photos to cloudinary if files exist
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files.map((file) => file.path),
        'furever/pets'
      );
      
      // Format photo data
      req.body.photos = uploadResults.map((result, index) => ({
        url: result.url,
        publicId: result.publicId,
        isMain: index === 0, // First photo is main by default
      }));
    }
    
    const pet = await Pet.create(req.body);
    
    res.status(201).json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update pet
// @route   PUT /api/pets/:id
// @access  Private (Admin/Shelter)
export const updatePet = async (req, res, next) => {
  try {
    let pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user is pet owner or admin
    if (pet.shelter.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this pet`,
          403
        )
      );
    }
    
    // Upload new photos if provided
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files.map((file) => file.path),
        'furever/pets'
      );
      
      // Format and add new photos
      const newPhotos = uploadResults.map((result) => ({
        url: result.url,
        publicId: result.publicId,
        isMain: false,
      }));
      
      // Combine with existing photos or initialize if none
      if (req.body.photos) {
        req.body.photos = [...req.body.photos, ...newPhotos];
      } else {
        req.body.photos = newPhotos;
      }
    }
    
    pet = await Pet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.json({
      success: true,
      data: pet,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete pet
// @route   DELETE /api/pets/:id
// @access  Private (Admin/Shelter)
export const deletePet = async (req, res, next) => {
  try {
    const pet = await Pet.findById(req.params.id);
    
    if (!pet) {
      return next(new ErrorResponse(`Pet not found with id of ${req.params.id}`, 404));
    }
    
    // Make sure user is pet owner or admin
    if (pet.shelter.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this pet`,
          403
        )
      );
    }
    
    // Delete photos from cloudinary
    if (pet.photos && pet.photos.length > 0) {
      for (const photo of pet.photos) {
        await deleteFromCloudinary(photo.publicId);
      }
    }
    
    await pet.deleteOne();
    
    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}; 