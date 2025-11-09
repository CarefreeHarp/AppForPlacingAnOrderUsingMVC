import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { config } from './config/config';
import restaurantRoutes from './routes/restaurantRoutes';
import userRoutes from './routes/userRoutes';
import menuRoutes from './routes/menuRoutes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/users', userRoutes);
app.use('/api/menu', menuRoutes);

// Connect to MongoDB
mongoose.connect(config.mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start server
const PORT = config.port || 5000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});