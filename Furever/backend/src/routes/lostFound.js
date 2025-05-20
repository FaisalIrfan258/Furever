import express from 'express';
import { check } from 'express-validator';
import {
  getLostFoundReports,
  getUserLostFoundReports,
  getLostFoundReport,
  createLostFoundReport,
  updateLostFoundReport,
  deleteLostFoundReport,
} from '../controllers/lostFoundController.js';
import { protect } from '../middleware/auth.js';
import { uploadFiles } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     LostFoundReport:
 *       type: object
 *       required:
 *         - type
 *         - petDetails
 *         - lastSeenLocation
 *         - description
 *         - contactInfo
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the report
 *         type:
 *           type: string
 *           enum: [lost, found]
 *           description: Type of report (lost pet or found pet)
 *         petDetails:
 *           type: object
 *           properties:
 *             species:
 *               type: string
 *               description: Species of the pet (dog, cat, etc.)
 *             breed:
 *               type: string
 *               description: Breed of the pet
 *             name:
 *               type: string
 *               description: Name of the pet (if known)
 *             color:
 *               type: string
 *               description: Color of the pet
 *             size:
 *               type: string
 *               enum: [small, medium, large, extra-large]
 *               description: Size of the pet
 *             gender:
 *               type: string
 *               enum: [male, female, unknown]
 *               description: Gender of the pet
 *             age:
 *               type: string
 *               description: Approximate age of the pet
 *             identifiers:
 *               type: string
 *               description: Any identifying features (collar, microchip, etc.)
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to photos of the pet
 *         lastSeenLocation:
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
 *             date:
 *               type: string
 *               format: date-time
 *               description: Date and time when the pet was last seen
 *         description:
 *           type: string
 *           description: Detailed description of the circumstances
 *         contactInfo:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Contact person's name
 *             phone:
 *               type: string
 *               description: Contact phone number
 *             email:
 *               type: string
 *               format: email
 *               description: Contact email address
 *         status:
 *           type: string
 *           enum: [open, resolved]
 *           default: open
 *           description: Status of the report
 *         user:
 *           type: string
 *           description: ID of the user who created the report
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the report was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the report was last updated
 */

/**
 * @swagger
 * /api/lost-found:
 *   get:
 *     summary: Get all lost and found reports
 *     tags: [Lost & Found]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [lost, found]
 *         description: Filter by report type
 *       - in: query
 *         name: species
 *         schema:
 *           type: string
 *         description: Filter by pet species
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, resolved]
 *         description: Filter by report status
 *     responses:
 *       200:
 *         description: List of lost and found reports
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
 *                     $ref: '#/components/schemas/LostFoundReport'
 *       500:
 *         description: Server error
 */
router.get('/', getLostFoundReports);

/**
 * @swagger
 * /api/lost-found/my-reports:
 *   get:
 *     summary: Get current user's lost and found reports
 *     tags: [Lost & Found]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's reports
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
 *                     $ref: '#/components/schemas/LostFoundReport'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-reports', protect, getUserLostFoundReports);

/**
 * @swagger
 * /api/lost-found/{id}:
 *   get:
 *     summary: Get a specific lost or found report
 *     tags: [Lost & Found]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the report
 *     responses:
 *       200:
 *         description: Report details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LostFoundReport'
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getLostFoundReport);

/**
 * @swagger
 * /api/lost-found:
 *   post:
 *     summary: Create a new lost or found pet report
 *     tags: [Lost & Found]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - type
 *               - petDetails.species
 *               - petDetails.color
 *               - lastSeenLocation.coordinates
 *               - lastSeenLocation.address.city
 *               - lastSeenLocation.address.state
 *               - lastSeenLocation.address.country
 *               - lastSeenLocation.date
 *               - description
 *               - contactInfo.name
 *               - contactInfo.phone
 *               - contactInfo.email
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [lost, found]
 *               petDetails.species:
 *                 type: string
 *               petDetails.breed:
 *                 type: string
 *               petDetails.name:
 *                 type: string
 *               petDetails.color:
 *                 type: string
 *               petDetails.size:
 *                 type: string
 *                 enum: [small, medium, large, extra-large]
 *               petDetails.gender:
 *                 type: string
 *                 enum: [male, female, unknown]
 *               petDetails.age:
 *                 type: string
 *               petDetails.identifiers:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               lastSeenLocation.coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               lastSeenLocation.address.street:
 *                 type: string
 *               lastSeenLocation.address.city:
 *                 type: string
 *               lastSeenLocation.address.state:
 *                 type: string
 *               lastSeenLocation.address.zipCode:
 *                 type: string
 *               lastSeenLocation.address.country:
 *                 type: string
 *               lastSeenLocation.date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               contactInfo.name:
 *                 type: string
 *               contactInfo.phone:
 *                 type: string
 *               contactInfo.email:
 *                 type: string
 *                 format: email
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LostFoundReport'
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
      check('type', 'Report type is required').isIn(['lost', 'found']),
      check('petDetails.species', 'Animal species is required').not().isEmpty(),
      check('petDetails.color', 'Color is required').not().isEmpty(),
      check('lastSeenLocation.coordinates', 'Coordinates are required').isArray().notEmpty(),
      check('lastSeenLocation.coordinates.0', 'Longitude is required').isFloat(),
      check('lastSeenLocation.coordinates.1', 'Latitude is required').isFloat(),
      check('lastSeenLocation.address.city', 'City is required').not().isEmpty(),
      check('lastSeenLocation.address.state', 'State is required').not().isEmpty(),
      check('lastSeenLocation.address.country', 'Country is required').not().isEmpty(),
      check('lastSeenLocation.date', 'Date is required').isISO8601(),
      check('description', 'Description is required').not().isEmpty(),
      check('contactInfo.name', 'Contact name is required').not().isEmpty(),
      check('contactInfo.phone', 'Contact phone is required').not().isEmpty(),
      check('contactInfo.email', 'Contact email is required').isEmail(),
    ],
  ],
  createLostFoundReport
);

/**
 * @swagger
 * /api/lost-found/{id}:
 *   put:
 *     summary: Update a lost or found report
 *     tags: [Lost & Found]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the report
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               petDetails.species:
 *                 type: string
 *               petDetails.breed:
 *                 type: string
 *               petDetails.name:
 *                 type: string
 *               petDetails.color:
 *                 type: string
 *               petDetails.size:
 *                 type: string
 *                 enum: [small, medium, large, extra-large]
 *               petDetails.gender:
 *                 type: string
 *                 enum: [male, female, unknown]
 *               petDetails.age:
 *                 type: string
 *               petDetails.identifiers:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               lastSeenLocation.coordinates:
 *                 type: array
 *                 items:
 *                   type: number
 *               lastSeenLocation.address:
 *                 type: object
 *               lastSeenLocation.date:
 *                 type: string
 *                 format: date-time
 *               description:
 *                 type: string
 *               contactInfo:
 *                 type: object
 *               status:
 *                 type: string
 *                 enum: [open, resolved]
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/LostFoundReport'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  [
    protect,
    uploadFiles('photos', 5),
  ],
  updateLostFoundReport
);

/**
 * @swagger
 * /api/lost-found/{id}:
 *   delete:
 *     summary: Delete a lost or found report
 *     tags: [Lost & Found]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the report
 *     responses:
 *       200:
 *         description: Report deleted successfully
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
 *       404:
 *         description: Report not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  protect,
  deleteLostFoundReport
);

export default router;