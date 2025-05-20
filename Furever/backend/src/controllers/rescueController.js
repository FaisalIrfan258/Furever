import Rescue from '../models/Rescue.js';
import { ErrorResponse } from '../middleware/error.js';
import { validationResult } from 'express-validator';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all rescue reports
// @route   GET /api/rescue
// @access  Private (Admin/Shelter)
export const getRescues = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    // Filter by status if provided
    if (req.query.status && ['reported', 'in-progress', 'rescued', 'closed'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Filter by urgency level if provided
    if (req.query.urgencyLevel && ['low', 'medium', 'high', 'emergency'].includes(req.query.urgencyLevel)) {
      query.urgencyLevel = req.query.urgencyLevel;
    }
    
    // Filter by animal type if provided
    if (req.query.animalType) {
      query.animalType = req.query.animalType.toLowerCase();
    }
    
    // Filter by assigned user if provided
    if (req.query.assignedTo) {
      query.assignedTo = req.query.assignedTo;
    } else if (req.query.unassigned === 'true') {
      query.assignedTo = { $exists: false };
    }
    
    // Filter by reporter if provided
    if (req.query.reporter) {
      query.reporter = req.query.reporter;
    }
    
    // Search by location (near coordinates)
    if (req.query.lat && req.query.lng && req.query.maxDistance) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          $maxDistance: parseInt(req.query.maxDistance) * 1000, // Convert km to meters
        },
      };
    }
    
    const total = await Rescue.countDocuments(query);
    
    const rescues = await Rescue.find(query)
      .populate('reporter', 'name')
      .populate('assignedTo', 'name')
      .sort({ urgencyLevel: -1, createdAt: -1 }) // Sort by urgency and then by date
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
      count: rescues.length,
      pagination,
      data: rescues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's rescue reports
// @route   GET /api/rescue/my-reports
// @access  Private
export const getUserRescues = async (req, res, next) => {
  try {
    const rescues = await Rescue.find({ reporter: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: rescues.length,
      data: rescues,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single rescue report
// @route   GET /api/rescue/:id
// @access  Private
export const getRescue = async (req, res, next) => {
  try {
    const rescue = await Rescue.findById(req.params.id)
      .populate('reporter', 'name email phone')
      .populate('assignedTo', 'name email phone')
      .populate('notes.addedBy', 'name');
    
    if (!rescue) {
      return next(new ErrorResponse(`Rescue report not found with id of ${req.params.id}`, 404));
    }
    
    res.json({
      success: true,
      data: rescue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new rescue report
// @route   POST /api/rescue
// @access  Private
export const createRescue = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    // Add reporter from req
    req.body.reporter = req.user.id;
    
    // Upload photos to cloudinary if files exist
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files.map((file) => file.path),
        'furever/rescues'
      );
      
      // Format photo data
      req.body.photos = uploadResults.map((result) => ({
        url: result.url,
        publicId: result.publicId,
      }));
    }
    
    const rescue = await Rescue.create(req.body);
    
    res.status(201).json({
      success: true,
      data: rescue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update rescue report
// @route   PUT /api/rescue/:id
// @access  Private (Admin/Shelter)
export const updateRescue = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    let rescue = await Rescue.findById(req.params.id);
    
    if (!rescue) {
      return next(new ErrorResponse(`Rescue report not found with id of ${req.params.id}`, 404));
    }
    
    // Upload new photos if provided
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files.map((file) => file.path),
        'furever/rescues'
      );
      
      // Format and add new photos
      const newPhotos = uploadResults.map((result) => ({
        url: result.url,
        publicId: result.publicId,
      }));
      
      // Combine with existing photos or initialize if none
      if (rescue.photos && rescue.photos.length > 0) {
        req.body.photos = [...rescue.photos, ...newPhotos];
      } else {
        req.body.photos = newPhotos;
      }
    }
    
    // Add note if provided
    if (req.body.noteContent) {
      const newNote = {
        content: req.body.noteContent,
        addedBy: req.user.id,
        addedAt: Date.now(),
      };
      
      if (rescue.notes && rescue.notes.length > 0) {
        rescue.notes.push(newNote);
      } else {
        rescue.notes = [newNote];
      }
      
      // Save notes to req.body for update
      req.body.notes = rescue.notes;
      
      // Remove noteContent from req.body as it's not part of the schema
      delete req.body.noteContent;
    }
    
    rescue = await Rescue.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.json({
      success: true,
      data: rescue,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete rescue report
// @route   DELETE /api/rescue/:id
// @access  Private (Admin)
export const deleteRescue = async (req, res, next) => {
  try {
    const rescue = await Rescue.findById(req.params.id);
    
    if (!rescue) {
      return next(new ErrorResponse(`Rescue report not found with id of ${req.params.id}`, 404));
    }
    
    // Only admin can delete rescue reports
    if (req.user.role !== 'admin') {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this rescue report`,
          403
        )
      );
    }
    
    // Delete photos from cloudinary
    if (rescue.photos && rescue.photos.length > 0) {
      for (const photo of rescue.photos) {
        await deleteFromCloudinary(photo.publicId);
      }
    }
    
    await rescue.deleteOne();
    
    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
}; 