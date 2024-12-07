import { Router } from 'express';
import authRoutes from './auth-routes';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes - add your board routes here
router.use('/api', authenticateToken);

export default router;