import express from 'express';
import { check } from 'express-validator';
import {
  getPets,
  getPet,
  createPet,
  updatePet,
  deletePet,
} from '../controllers/petController.js';
import { protect, authorize } from '../middleware/auth.js';
import { uploadFiles } from '../middleware/upload.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Pet:
 *       type: object
 *       required:
 *         - name
 *         - type
 *         - breed
 *         - age
 *         - gender
 *         - size
 *         - color
 *         - description
 *         - location
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the pet
 *         name:
 *           type: string
 *           description: Name of the pet
 *         type:
 *           type: string
 *           description: Type of pet (dog, cat, etc.)
 *         breed:
 *           type: string
 *           description: Breed of the pet
 *         age:
 *           type: object
 *           properties:
 *             value:
 *               type: number
 *               description: Age value
 *             unit:
 *               type: string
 *               description: Age unit (years, months)
 *         gender:
 *           type: string
 *           enum: [male, female, unknown]
 *           description: Gender of the pet
 *         size:
 *           type: string
 *           enum: [small, medium, large, extra-large]
 *           description: Size of the pet
 *         color:
 *           type: string
 *           description: Color of the pet
 *         description:
 *           type: string
 *           description: Detailed description of the pet
 *         photos:
 *           type: array
 *           items:
 *             type: string
 *           description: URLs to pet photos
 *         location:
 *           type: object
 *           properties:
 *             address:
 *               type: object
 *               properties:
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 zipCode:
 *                   type: string
 *                 country:
 *                   type: string
 *         adoptionStatus:
 *           type: string
 *           enum: [available, pending, adopted]
 *           default: available
 *           description: Current adoption status
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the pet was added
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the pet was last updated
 */

/**
 * @swagger
 * /api/pets:
 *   get:
 *     summary: Get all pets
 *     tags: [Pets]
 *     parameters:
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: Filter by pet type
 *       - in: query
 *         name: breed
 *         schema:
 *           type: string
 *         description: Filter by breed
 *       - in: query
 *         name: adoptionStatus
 *         schema:
 *           type: string
 *         description: Filter by adoption status
 *     responses:
 *       200:
 *         description: List of pets
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
 *                     $ref: '#/components/schemas/Pet'
 *       500:
 *         description: Server error
 */
router.get('/', getPets);

/**
 * @swagger
 * /api/pets/{id}:
 *   get:
 *     summary: Get a pet by ID
 *     tags: [Pets]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the pet
 *     responses:
 *       200:
 *         description: Pet details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       404:
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.get('/:id', getPet);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Create a new pet listing
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - breed
 *               - age.value
 *               - gender
 *               - size
 *               - color
 *               - description
 *               - location.address.city
 *               - location.address.state
 *               - location.address.zipCode
 *               - location.address.country
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               breed:
 *                 type: string
 *               age.value:
 *                 type: number
 *               age.unit:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, unknown]
 *               size:
 *                 type: string
 *                 enum: [small, medium, large, extra-large]
 *               color:
 *                 type: string
 *               description:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               location.address.city:
 *                 type: string
 *               location.address.state:
 *                 type: string
 *               location.address.zipCode:
 *                 type: string
 *               location.address.country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.post(
  '/',
  [
    protect,
    authorize('admin', 'shelter'),
    uploadFiles('photos', 5),
    [
      check('name', 'Pet name is required').not().isEmpty(),
      check('type', 'Pet type is required').not().isEmpty(),
      check('breed', 'Pet breed is required').not().isEmpty(),
      check('age.value', 'Age value is required').isNumeric(),
      check('gender', 'Gender is required').isIn(['male', 'female', 'unknown']),
      check('size', 'Size is required').isIn(['small', 'medium', 'large', 'extra-large']),
      check('color', 'Color is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('location.address.city', 'City is required').not().isEmpty(),
      check('location.address.state', 'State is required').not().isEmpty(),
      check('location.address.zipCode', 'Zip code is required').not().isEmpty(),
      check('location.address.country', 'Country is required').not().isEmpty(),
    ],
  ],
  createPet
);

/**
 * @swagger
 * /api/pets/{id}:
 *   put:
 *     summary: Update a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the pet
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *               breed:
 *                 type: string
 *               age.value:
 *                 type: number
 *               age.unit:
 *                 type: string
 *               gender:
 *                 type: string
 *                 enum: [male, female, unknown]
 *               size:
 *                 type: string
 *                 enum: [small, medium, large, extra-large]
 *               color:
 *                 type: string
 *               description:
 *                 type: string
 *               photos:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *               adoptionStatus:
 *                 type: string
 *                 enum: [available, pending, adopted]
 *     responses:
 *       200:
 *         description: Pet updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Pet not found
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
  updatePet
);

/**
 * @swagger
 * /api/pets/{id}:
 *   delete:
 *     summary: Delete a pet
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the pet
 *     responses:
 *       200:
 *         description: Pet deleted successfully
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
 *         description: Pet not found
 *       500:
 *         description: Server error
 */
router.delete(
  '/:id',
  [protect, authorize('admin', 'shelter')],
  deletePet
);

export default router; 