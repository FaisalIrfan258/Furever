import User from '../models/User.js';
import { ErrorResponse } from '../middleware/error.js';
import generateToken from '../utils/generateToken.js';
import { validationResult } from 'express-validator';

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password, role } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create user with the specified role (default to 'user' if not provided)
    // Valid roles are 'user', 'shelter', and 'admin'
    const validRoles = ['user', 'shelter', 'admin'];
    const userRole = validRoles.includes(role) ? role : 'user';

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return next(new ErrorResponse('Invalid user data', 400));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new shelter account
// @route   POST /api/auth/register/shelter
// @access  Public
export const registerShelter = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create shelter user with additional required fields
    const user = await User.create({
      name,
      email,
      password,
      role: 'shelter',
      phone,
      address,
      // Shelters require verification before full functionality
      isVerified: false,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
        },
      });
    } else {
      return next(new ErrorResponse('Invalid user data', 400));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register a new admin account
// @route   POST /api/auth/register/admin
// @access  Private/Admin
export const registerAdmin = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Only existing admins can create other admin accounts
    if (req.user.role !== 'admin') {
      return next(new ErrorResponse('Not authorized to create admin accounts', 403));
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true, // Admins are verified by default since they're created by other admins
    });

    if (user) {
      res.status(201).json({
        success: true,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return next(new ErrorResponse('Invalid user data', 400));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Register the first admin account (only works if no admin exists)
// @route   POST /api/auth/register/first-admin
// @access  Public
export const registerFirstAdmin = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Check if any admin already exists
    const adminExists = await User.exists({ role: 'admin' });
    if (adminExists) {
      return next(new ErrorResponse('Admin account already exists, use regular admin registration', 400));
    }

    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return next(new ErrorResponse('User already exists', 400));
    }

    // Create first admin user
    const user = await User.create({
      name,
      email,
      password,
      role: 'admin',
      isVerified: true,
    });

    if (user) {
      // Generate token
      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    } else {
      return next(new ErrorResponse('Invalid user data', 400));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    
    if (!user) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return next(new ErrorResponse('Invalid credentials', 401));
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
export const logoutUser = (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/auth/me
// @access  Private
export const updateUserProfile = async (req, res, next) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    // Fields to update
    const fieldsToUpdate = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      address: req.body.address,
    };

    // If password is included, it will be hashed by the pre-save middleware
    if (req.body.password) {
      fieldsToUpdate.password = req.body.password;
    }

    // Update user
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return next(new ErrorResponse('User not found', 404));
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
}; 