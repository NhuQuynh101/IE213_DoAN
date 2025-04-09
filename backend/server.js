import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import initializeAdmin from './config/initAdmin.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Import routes
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

// Connect to database
connectDB();

// Initialize admin account
initializeAdmin();

// Routes
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 