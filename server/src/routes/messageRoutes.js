import express from 'express';
import { sendMessage, sendMediaMessage, getMessages, updateMessageStatus, markAllDelivered } from '../controllers/messageController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.put('/mark-delivered', protect, markAllDelivered);
router.put('/status', protect, updateMessageStatus);
router.post('/upload', protect, upload.single('file'), sendMediaMessage); // Safely maps via MultiPart FormData constraints
router.post('/', protect, sendMessage);
router.get('/:userId', protect, getMessages);

export default router;
