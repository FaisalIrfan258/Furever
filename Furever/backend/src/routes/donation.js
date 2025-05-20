import express from 'express';
import { check } from 'express-validator';
import {
  getDonations,
  getUserDonations,
  getDonation,
  createDonation,
  updateDonationStatus,
  cancelRecurringDonation,
} from '../controllers/donationController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Donation:
 *       type: object
 *       required:
 *         - amount
 *         - user
 *         - paymentMethod
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID of the donation
 *         amount:
 *           type: number
 *           description: Donation amount
 *         user:
 *           type: string
 *           description: ID of the user making the donation
 *         paymentMethod:
 *           type: string
 *           enum: [credit_card, paypal, bank_transfer, other]
 *           description: Method of payment
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, refunded]
 *           default: pending
 *           description: Status of the donation
 *         isRecurring:
 *           type: boolean
 *           default: false
 *           description: Whether the donation is recurring
 *         recurringDetails:
 *           type: object
 *           properties:
 *             frequency:
 *               type: string
 *               enum: [weekly, monthly, quarterly, annually]
 *               description: Frequency of recurring donation
 *             nextBillingDate:
 *               type: string
 *               format: date-time
 *               description: Next billing date for recurring donation
 *             isCancelled:
 *               type: boolean
 *               default: false
 *               description: Whether recurring donation is cancelled
 *         isAnonymous:
 *           type: boolean
 *           default: false
 *           description: Whether the donation is anonymous
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date when the donation was made
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date when the donation was last updated
 */

/**
 * @swagger
 * /api/donate:
 *   get:
 *     summary: Get all donations (admin only)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all donations
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
 *                     $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Server error
 */
router.get(
  '/',
  [protect, authorize('admin')],
  getDonations
);

/**
 * @swagger
 * /api/donate/my-donations:
 *   get:
 *     summary: Get current user's donations
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's donations
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
 *                     $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/my-donations', protect, getUserDonations);

/**
 * @swagger
 * /api/donate/{id}:
 *   get:
 *     summary: Get a specific donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the donation
 *     responses:
 *       200:
 *         description: Donation details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Donation not found
 *       500:
 *         description: Server error
 */
router.get('/:id', protect, getDonation);

/**
 * @swagger
 * /api/donate:
 *   post:
 *     summary: Make a new donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - paymentMethod
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 1
 *                 description: Donation amount
 *               paymentMethod:
 *                 type: string
 *                 enum: [credit_card, paypal, bank_transfer, other]
 *                 description: Method of payment
 *               isRecurring:
 *                 type: boolean
 *                 description: Whether the donation is recurring
 *               recurringDetails:
 *                 type: object
 *                 properties:
 *                   frequency:
 *                     type: string
 *                     enum: [weekly, monthly, quarterly, annually]
 *                     description: Frequency of recurring donation
 *               isAnonymous:
 *                 type: boolean
 *                 description: Whether the donation is anonymous
 *     responses:
 *       201:
 *         description: Donation made successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
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
      check('amount', 'Donation amount is required').isNumeric().isFloat({ min: 1 }),
      check('paymentMethod', 'Payment method is required').isIn(['credit_card', 'paypal', 'bank_transfer', 'other']),
      check('isRecurring', 'Recurring status must be a boolean').optional().isBoolean(),
      check('recurringDetails.frequency', 'Invalid recurring frequency')
        .if((value, { req }) => req.body.isRecurring)
        .isIn(['weekly', 'monthly', 'quarterly', 'annually']),
      check('isAnonymous', 'Anonymous status must be a boolean').optional().isBoolean(),
    ],
  ],
  createDonation
);

/**
 * @swagger
 * /api/donate/{id}:
 *   put:
 *     summary: Update donation status (admin only)
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the donation
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
 *                 enum: [pending, completed, failed, refunded]
 *     responses:
 *       200:
 *         description: Donation status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Invalid input data
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Donation not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id',
  [
    protect,
    authorize('admin'),
    [
      check('status', 'Status is required').isIn(['pending', 'completed', 'failed', 'refunded']),
    ],
  ],
  updateDonationStatus
);

/**
 * @swagger
 * /api/donate/{id}/cancel-recurring:
 *   put:
 *     summary: Cancel a recurring donation
 *     tags: [Donations]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the recurring donation
 *     responses:
 *       200:
 *         description: Recurring donation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Donation'
 *       400:
 *         description: Not a recurring donation
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Donation not found
 *       500:
 *         description: Server error
 */
router.put(
  '/:id/cancel-recurring',
  protect,
  cancelRecurringDonation
);

export default router; 