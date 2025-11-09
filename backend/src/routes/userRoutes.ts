import { Router } from 'express';
import { userController } from '../controllers/userController';

const router = Router();

// Authentication routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// User profile routes
router.get('/:id', userController.getProfile);
router.put('/:id', userController.updateProfile);
router.put('/:id/password', userController.changePassword);

export default router;