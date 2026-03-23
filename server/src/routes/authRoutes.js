import express from 'express';
import { body } from 'express-validator';
import { sendOtp, verifyOtp, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/send-otp', [
    body('phoneNumber', 'Valid phone number is required').not().isEmpty()
], sendOtp);

router.post('/verify-otp', [
    body('phoneNumber', 'Phone number is required').not().isEmpty(),
    body('otp', 'OTP is required').isLength({ min: 6, max: 6 })
], verifyOtp);

router.get('/me', protect, getMe);

export default router;
