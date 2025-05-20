import express from 'express';
import { check } from 'express-validator';
import {
  getRescues,
  getUserRescues,
  getRescue,
  createRescue,
  updateRescue,
  deleteRescue,
} from '../controllers/rescueController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadFiles } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Rescue:
 *       type: object
 *       required:
 *         - animalType
 *         - condition
 *         - description
 *         - location
 *         - urgencyLevel
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the rescue report
 *         animalType:
 *           type: string
 *           description: Type of animal requiring rescue
 *         condition:
 *           type: string
 *           enum: [healthy, injured, critical, unknown]
 *           description: Condition of the animal
 *         description:
 *           type: string
 *           description: Detailed description of the situation
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to photos of the animal
 *         location:
 *           type: object
 *           properties:
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *               description: "Longitude and latitude coordinates"
 *             address:
 *               type: object
 *               properties:
 *                 street:
 *                   type: string
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zipCode:
 *                   type: string
 *                 country:
 *                   type: string
 *         urgencyLevel:
 *           type: string
 *           enum: [low, medium, high, emergency]
 *           description: Level of urgency for the rescue
 *         status:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *           default: pending
 *           description: Status of the rescue request
 *         assignedTo:
 *           type: string
 *           description: ID of the shelter/user assigned to the rescue
 *         user:
 *           type: string
 *           description: ID of the user who created the rescue request
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the rescue request was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the rescue request was last updated
 */

/**
 * @swagger
 * /api/rescue:
 *   get:
 *     summary: Get all rescue requests (admin/shelter only)
 *     tags: [Rescues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, in_progress, completed, cancelled]
 *         description: Filter by rescue status
 *       - in: query
 *         name: urgencyLevel
 *         schema:
 *           type: string
 *           enum: [low, medium, high, emergency]
 *         description: Filter by urgency level
 *     responses:
 *       200:
 *         description: List of rescue requests
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
 *                     $ref: '#/components/schemas/Rescue'
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
  getRescues
);

/**
 * @swagger
 * /api/rescue/my-reports:
 *   get:
 *     summary: Get current user's rescue requests
 *     tags: [Rescues]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's rescue requests
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
 *                     $ref: '#/components/schemas/Rescue'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-reports', protect, getUserRescues);

/**
 * @swagger
 * /api/rescue/{id}:
 *   get:
 *     summary: Get a specific rescue request
 *     tags: [Rescues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the rescue request
 *     responses:
 *       200:
 *         description: Rescue request details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Rescue'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Rescue request not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getRescue);

/**
 * @swagger
 * /api/rescue:
 *   post:
 *     summary: Create a new rescue request
 *     tags: [Rescues]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - animalType
 *               - condition
 *               - description
 *               - location.coordinates
 *               - urgencyLevel
 *             properties:
 *               animalType:
 *                 type: string
 *                 description: Type of animal requiring rescue
 *               condition:
 *                 type: string
 *                 enum: [healthy, injured, critical, unknown]
 *                 description: Condition of the animal
 *               description:
 *                 type: string
 *                 description: Detailed description of the situation
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Photos of the animal
 *               location.coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *                 description: "Longitude and latitude coordinates"
 *               location.address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *                   country:
 *                     type: string
 *               urgencyLevel:
 *                 type: string
 *                 enum: [low, medium, high, emergency]
 *                 description: Level of urgency for the rescue
 *     responses:
 *       201:
 *         description: Rescue request created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Rescue'
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
    uploadFiles('photos', 5),
    [
      check('animalType', 'Animal type is required').not().isEmpty(),
      check('condition', 'Condition is required').isIn(['healthy', 'injured', 'critical', 'unknown']),
      check('description', 'Description is required').not().isEmpty(),
      check('location.coordinates', 'Coordinates are required').isArray().notEmpty(),
      check('location.coordinates.0', 'Longitude is required').isFloat(),
      check('location.coordinates.1', 'Latitude is required').isFloat(),
      check('urgencyLevel', 'Urgency level is required').isIn(['low', 'medium', 'high', 'emergency']),
    ],
  ],
  createRescue
);

/**
 * @swagger
 * /api/rescue/{id}:
 *   put:
 *     summary: Update a rescue request (admin/shelter only)
 *     tags: [Rescues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the rescue request
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               animalType:
 *                 type: string
 *               condition:
 *                 type: string
 *                 enum: [healthy, injured, critical, unknown]
 *               description:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               location.coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               location.address:
 *                 type: object
 *               urgencyLevel:
 *                 type: string
 *                 enum: [low, medium, high, emergency]
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *               assignedTo:
 *                 type: string
 *                 description: ID of the shelter/user assigned to the rescue
 *     responses:
 *       200:
 *         description: Rescue request updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Rescue'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rescue request not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  [
    protect,
    authorize('admin', 'shelter'),
    uploadFiles('photos', 5),
  ],
  updateRescue
);

/**
 * @swagger
 * /api/rescue/{id}:
 *   delete:
 *     summary: Delete a rescue request (admin only)
 *     tags: [Rescues]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the rescue request
 *     responses:
 *       200:
 *         description: Rescue request deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Rescue request not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  [protect, authorize('admin')],
  deleteRescue
);

export default router; 