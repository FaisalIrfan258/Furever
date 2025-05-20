import express from 'express';
import { getChatResponse } from '../controllers/chatbotController.js';

const router = express.Router();

/**
 * @swagger
 * /api/chatbot/chat:
 *   post:
 *     summary: Get a response from the AI chatbot
 *     description: Send a message to the AI chatbot and receive a response
 *     tags: [Chatbot]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - message
 *             properties:
 *               message:
 *                 type: string
 *                 description: The user's message to the chatbot
 *                 example: "What pets are available for adoption?"
 *     responses:
 *       200:
 *         description: Successful response from the chatbot
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 response:
 *                   type: string
 *                   description: The chatbot's response
 *                   example: "We have several dogs and cats looking for their forever homes. Would you like to know more about any specific type of pet?"
 *       400:
 *         description: Bad request - message is missing
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Message is required"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Failed to get response from chatbot"
 */
router.post('/chat', getChatResponse);

export default router; 