import LostFound from '../models/LostFound.js';
import { ErrorResponse } from '../middleware/error.js';
import { validationResult } from 'express-validator';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../utils/cloudinaryUpload.js';

// @desc    Get all lost and found reports
// @route   GET /api/lost-found
// @access  Public
export const getLostFoundReports = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    let query = {};
    
    // Filter by type if provided
    if (req.query.type && ['lost', 'found'].includes(req.query.type)) {
      query.type = req.query.type;
    }
    
    // Filter by status if provided
    if (req.query.status && ['active', 'resolved', 'expired'].includes(req.query.status)) {
      query.status = req.query.status;
    }
    
    // Filter by species if provided
    if (req.query.species) {
      query['petDetails.species'] = req.query.species.toLowerCase();
    }
    
    // Filter by breed if provided
    if (req.query.breed) {
      query['petDetails.breed'] = { $regex: req.query.breed, $options: 'i' };
    }
    
    // Filter by color if provided
    if (req.query.color) {
      query['petDetails.color'] = { $regex: req.query.color, $options: 'i' };
    }
    
    // Filter by gender if provided
    if (req.query.gender && ['male', 'female', 'unknown'].includes(req.query.gender)) {
      query['petDetails.gender'] = req.query.gender;
    }
    
    // Filter by size if provided
    if (req.query.size && ['small', 'medium', 'large', 'extra-large', 'unknown'].includes(req.query.size)) {
      query['petDetails.size'] = req.query.size;
    }
    
    // Filter by location (city, state)
    if (req.query.city) {
      query['lastSeenLocation.address.city'] = { $regex: req.query.city, $options: 'i' };
    }
    
    if (req.query.state) {
      query['lastSeenLocation.address.state'] = { $regex: req.query.state, $options: 'i' };
    }
    
    // Search by text
    if (req.query.search) {
      query.$text = { $search: req.query.search };
    }
    
    // Search by date range
    if (req.query.startDate && req.query.endDate) {
      query['lastSeenLocation.date'] = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    } else if (req.query.startDate) {
      query['lastSeenLocation.date'] = { $gte: new Date(req.query.startDate) };
    } else if (req.query.endDate) {
      query['lastSeenLocation.date'] = { $lte: new Date(req.query.endDate) };
    }
    
    // Search by location (near coordinates)
    if (req.query.lat && req.query.lng && req.query.maxDistance) {
      query.lastSeenLocation = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(req.query.lng), parseFloat(req.query.lat)],
          },
          $maxDistance: parseInt(req.query.maxDistance) * 1000, // Convert km to meters
        },
      };
    }
    
    const total = await LostFound.countDocuments(query);
    
    const lostFoundReports = await LostFound.find(query)
      .populate('user', 'name')
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
      count: lostFoundReports.length,
      pagination,
      data: lostFoundReports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's lost and found reports
// @route   GET /api/lost-found/my-reports
// @access  Private
export const getUserLostFoundReports = async (req, res, next) => {
  try {
    const lostFoundReports = await LostFound.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: lostFoundReports.length,
      data: lostFoundReports,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single lost and found report
// @route   GET /api/lost-found/:id
// @access  Public
export const getLostFoundReport = async (req, res, next) => {
  try {
    const lostFoundReport = await LostFound.findById(req.params.id)
      .populate('user', 'name');
    
    if (!lostFoundReport) {
      return next(new ErrorResponse(`Lost and found report not found with id of ${req.params.id}`, 404));
    }
    
    res.json({
      success: true,
      data: lostFoundReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new lost and found report
// @route   POST /api/lost-found
// @access  Private
export const createLostFoundReport = async (req, res, next) => {
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
    
    // Upload photos to cloudinary if files exist
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files.map((file) => file.path),
        'furever/lostfound'
      );
      
      // Format photo data
      req.body.photos = uploadResults.map((result) => ({
        url: result.url,
        publicId: result.publicId,
      }));
    }
    
    // Check for potential matches
    const matchType = req.body.type === 'lost' ? 'found' : 'lost';
    const potentialMatches = await findPotentialMatches(req.body, matchType);
    
    const lostFoundReport = await LostFound.create(req.body);
    
    res.status(201).json({
      success: true,
      data: lostFoundReport,
      potentialMatches: potentialMatches.length > 0 ? potentialMatches : null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update lost and found report
// @route   PUT /api/lost-found/:id
// @access  Private
export const updateLostFoundReport = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    
    let lostFoundReport = await LostFound.findById(req.params.id);
    
    if (!lostFoundReport) {
      return next(new ErrorResponse(`Lost and found report not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to update this report
    if (
      req.user.role !== 'admin' &&
      lostFoundReport.user.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to update this report`,
          403
        )
      );
    }
    
    // Upload new photos if provided
    if (req.files && req.files.length > 0) {
      const uploadResults = await uploadMultipleToCloudinary(
        req.files.map((file) => file.path),
        'furever/lostfound'
      );
      
      // Format and add new photos
      const newPhotos = uploadResults.map((result) => ({
        url: result.url,
        publicId: result.publicId,
      }));
      
      // Combine with existing photos or initialize if none
      if (lostFoundReport.photos && lostFoundReport.photos.length > 0) {
        req.body.photos = [...lostFoundReport.photos, ...newPhotos];
      } else {
        req.body.photos = newPhotos;
      }
    }
    
    // If status is being updated to resolved, update matchedWith if provided
    if (
      req.body.status === 'resolved' &&
      req.body.matchedWith &&
      lostFoundReport.status !== 'resolved'
    ) {
      // Update the matched report as well
      const matchedReport = await LostFound.findById(req.body.matchedWith);
      
      if (matchedReport) {
        matchedReport.status = 'resolved';
        matchedReport.matchedWith = lostFoundReport._id;
        await matchedReport.save();
      }
    }
    
    lostFoundReport = await LostFound.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    
    res.json({
      success: true,
      data: lostFoundReport,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete lost and found report
// @route   DELETE /api/lost-found/:id
// @access  Private
export const deleteLostFoundReport = async (req, res, next) => {
  try {
    const lostFoundReport = await LostFound.findById(req.params.id);
    
    if (!lostFoundReport) {
      return next(new ErrorResponse(`Lost and found report not found with id of ${req.params.id}`, 404));
    }
    
    // Check if user is authorized to delete this report
    if (
      req.user.role !== 'admin' &&
      lostFoundReport.user.toString() !== req.user.id
    ) {
      return next(
        new ErrorResponse(
          `User ${req.user.id} is not authorized to delete this report`,
          403
        )
      );
    }
    
    // Delete photos from cloudinary
    if (lostFoundReport.photos && lostFoundReport.photos.length > 0) {
      for (const photo of lostFoundReport.photos) {
        await deleteFromCloudinary(photo.publicId);
      }
    }
    
    await lostFoundReport.deleteOne();
    
    res.json({
      success: true,
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

// Helper function to find potential matches for a lost/found report
const findPotentialMatches = async (report, matchType) => {
  const query = {
    type: matchType,
    status: 'active',
    'petDetails.species': report.petDetails.species,
  };
  
  // Match by breed if provided
  if (report.petDetails.breed) {
    query['petDetails.breed'] = { $regex: report.petDetails.breed, $options: 'i' };
  }
  
  // Match by color
  if (report.petDetails.color) {
    query['petDetails.color'] = { $regex: report.petDetails.color, $options: 'i' };
  }
  
  // Match by gender if known
  if (report.petDetails.gender && report.petDetails.gender !== 'unknown') {
    query['petDetails.gender'] = report.petDetails.gender;
  }
  
  // Match by size if known
  if (report.petDetails.size && report.petDetails.size !== 'unknown') {
    query['petDetails.size'] = report.petDetails.size;
  }
  
  // Match by location (within a reasonable distance)
  if (report.lastSeenLocation && report.lastSeenLocation.coordinates) {
    query.lastSeenLocation = {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: report.lastSeenLocation.coordinates,
        },
        $maxDistance: 10000, // 10km radius
      },
    };
  }
  
  // Match by date range (within 30 days)
  const reportDate = new Date(report.lastSeenLocation.date);
  const thirtyDaysBefore = new Date(reportDate);
  thirtyDaysBefore.setDate(reportDate.getDate() - 30);
  
  const thirtyDaysAfter = new Date(reportDate);
  thirtyDaysAfter.setDate(reportDate.getDate() + 30);
  
  query['lastSeenLocation.date'] = {
    $gte: thirtyDaysBefore,
    $lte: thirtyDaysAfter,
  };
  
  return await LostFound.find(query)
    .limit(5)
    .select('petDetails photos lastSeenLocation type')
    .sort({ createdAt: -1 });
}; 