import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';
import connectDB from './config/db.js';
import swaggerDocs from './config/swagger.js';
// Import routes
import authRoutes from './routes/auth.js';
import petRoutes from './routes/pet.js';
import adoptionRoutes from './routes/adoption.js';
import rescueRoutes from './routes/rescue.js';
import lostFoundRoutes from './routes/lostFound.js';
import donationRoutes from './routes/donation.js';
import chatbotRoutes from './routes/chatbotRoutes.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize app
const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/adoption', adoptionRoutes);
app.use('/api/rescue', rescueRoutes);
app.use('/api/lost-found', lostFoundRoutes);
app.use('/api/donate', donationRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Initialize Swagger
swaggerDocs(app);

// Base route
app.get('/', (req, res) => {
  res.send('Welcome to FurEver Home API');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 