import express from 'express';
import { registerUser, loginUser, logoutUser, deleteAccount } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes (require authentication)
router.delete('/delete-account', authMiddleware, deleteAccount);

// Export router
export default router; 