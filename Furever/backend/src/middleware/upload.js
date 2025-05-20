import multer from 'multer';
import path from 'path';
import { ErrorResponse } from './error.js';

// Set storage engine
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Check file type
const fileFilter = (req, file, cb) => {
  // Allow images only
  const filetypes = /jpeg|jpg|png|gif/;
  // Check extension
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new ErrorResponse('Only image files are allowed!', 400));
  }
};

// Initialize multer upload
export const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter,
});

// Middleware for handling multiple file uploads
export const uploadFiles = (fieldName, maxCount = 5) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.array(fieldName, maxCount);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ErrorResponse('File too large. Max size is 5MB', 400));
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
          return next(new ErrorResponse(`Too many files. Max is ${maxCount}`, 400));
        }
        return next(new ErrorResponse(err.message, 400));
      } else if (err) {
        // An unknown error occurred
        return next(err);
      }
      
      // Everything went fine
      next();
    });
  };
};

// Middleware for handling single file upload
export const uploadFile = (fieldName) => {
  return (req, res, next) => {
    const uploadMiddleware = upload.single(fieldName);
    
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        if (err.code === 'LIMIT_FILE_SIZE') {
          return next(new ErrorResponse('File too large. Max size is 5MB', 400));
        }
        return next(new ErrorResponse(err.message, 400));
      } else if (err) {
        // An unknown error occurred
        return next(err);
      }
      
      // Everything went fine
      next();
    });
  };
}; 