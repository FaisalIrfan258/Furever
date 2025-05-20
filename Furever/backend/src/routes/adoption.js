import express from 'express';
import { check } from 'express-validator';
import {
  getAdoptions,
  getUserAdoptions,
  getAdoption,
  createAdoption,
  updateAdoptionStatus,
} from '../controllers/adoptionController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Adoption:
 *       type: object
 *       required:
 *         - pet
 *         - user
 *         - applicationDetails
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the adoption application
 *         pet:
 *           type: string
 *           description: ID of the pet being adopted
 *         user:
 *           type: string
 *           description: ID of the user applying for adoption
 *         status:
 *           type: string
 *           enum: [pending, approved, rejected]
 *           default: pending
 *           description: Status of the adoption application
 *         applicationDetails:
 *           type: object
 *           properties:
 *             housingType:
 *               type: string
 *               enum: [apartment, house, townhouse, other]
 *               description: Type of housing
 *             hasYard:
 *               type: boolean
 *               description: Whether the applicant has a yard
 *             hasChildren:
 *               type: boolean
 *               description: Whether the applicant has children
 *             hasOtherPets:
 *               type: boolean
 *               description: Whether the applicant has other pets
 *             workSchedule:
 *               type: string
 *               description: Applicant's work schedule
 *             experienceWithPets:
 *               type: string
 *               description: Applicant's experience with pets
 *             reasonForAdoption:
 *               type: string
 *               description: Reason for wanting to adopt
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the adoption application was submitted
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the adoption application was last updated
 */

/**
 * @swagger
 * /api/adoption:
 *   get:
 *     summary: Get all adoption applications (admin/shelter only)
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all adoption applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  [protect, authorize('admin', 'shelter')],
  getAdoptions
);

/**
 * @swagger
 * /api/adoption/my-applications:
 *   get:
 *     summary: Get current user's adoption applications
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's adoption applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Adoption'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-applications', protect, getUserAdoptions);

/**
 * @swagger
 * /api/adoption/{id}:
 *   get:
 *     summary: Get a specific adoption application
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the adoption application
 *     responses:
 *       200:
 *         description: Adoption application details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Adoption'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Adoption application not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getAdoption);

/**
 * @swagger
 * /api/adoption:
 *   post:
 *     summary: Submit a new adoption application
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pet
 *               - applicationDetails
 *             properties:
 *               pet:
 *                 type: string
 *                 description: ID of the pet to adopt
 *               applicationDetails:
 *                 type: object
 *                 required:
 *                   - housingType
 *                   - hasYard
 *                   - hasChildren
 *                   - hasOtherPets
 *                   - workSchedule
 *                   - experienceWithPets
 *                   - reasonForAdoption
 *                 properties:
 *                   housingType:
 *                     type: string
 *                     enum: [apartment, house, townhouse, other]
 *                   hasYard:
 *                     type: boolean
 *                   hasChildren:
 *                     type: boolean
 *                   hasOtherPets:
 *                     type: boolean
 *                   workSchedule:
 *                     type: string
 *                   experienceWithPets:
 *                     type: string
 *                   reasonForAdoption:
 *                     type: string
 *     responses:
 *       201:
 *         description: Adoption application submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Adoption'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  [
    protect,
    [
      check('pet', 'Pet ID is required').not().isEmpty().isMongoId(),
      check('applicationDetails.housingType', 'Housing type is required')
        .isIn(['apartment', 'house', 'townhouse', 'other']),
      check('applicationDetails.hasYard', 'Yard information is required').isBoolean(),
      check('applicationDetails.hasChildren', 'Children information is required').isBoolean(),
      check('applicationDetails.hasOtherPets', 'Other pets information is required').isBoolean(),
      check('applicationDetails.workSchedule', 'Work schedule is required').not().isEmpty(),
      check('applicationDetails.experienceWithPets', 'Experience with pets is required').not().isEmpty(),
      check('applicationDetails.reasonForAdoption', 'Reason for adoption is required').not().isEmpty(),
    ],
  ],
  createAdoption
);

/**
 * @swagger
 * /api/adoption/{id}:
 *   put:
 *     summary: Update adoption application status (admin/shelter only)
 *     tags: [Adoptions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the adoption application
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [approved, rejected]
 *     responses:
 *       200:
 *         description: Adoption application status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Adoption'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Adoption application not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'shelter'),
    [
      check('status', 'Status is required').isIn(['approved', 'rejected']),
    ],
  ],
  updateAdoptionStatus
);

export default router; 