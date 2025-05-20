import cloudinary from '../config/cloudinary.js';
import fs from 'fs';
import { ErrorResponse } from '../middleware/error.js';

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise<Object>} Cloudinary upload result
 */
export const uploadToCloudinary = async (filePath, folder = 'furever') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: folder,
      use_filename: true,
      unique_filename: true,
    });

    // Delete file from server after upload
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Delete file from server if upload failed
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new ErrorResponse(`Cloudinary upload failed: ${error.message}`, 500);
  }
};

/**
 * Upload multiple files to Cloudinary
 * @param {Array<string>} filePaths - Array of file paths to upload
 * @param {string} folder - Cloudinary folder to upload to
 * @returns {Promise<Array<Object>>} Array of Cloudinary upload results
 */
export const uploadMultipleToCloudinary = async (filePaths, folder = 'furever') => {
  try {
    const uploadPromises = filePaths.map((filePath) =>
      uploadToCloudinary(filePath, folder)
    );
    
    return await Promise.all(uploadPromises);
  } catch (error) {
    // Clean up any remaining files
    filePaths.forEach((filePath) => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });
    
    throw new ErrorResponse(`Multiple uploads failed: ${error.message}`, 500);
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - Cloudinary public ID of the file
 * @returns {Promise<Object>} Cloudinary deletion result
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    throw new ErrorResponse(`Cloudinary deletion failed: ${error.message}`, 500);
  }
}; 