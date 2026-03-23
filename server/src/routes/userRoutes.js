import express from 'express';
import { register, login, getUsers, createGroup, updateProfile } from '../controllers/userController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/', protect, getUsers);
router.post('/group', protect, createGroup);
router.put('/profile', protect, updateProfile);

export default router;
