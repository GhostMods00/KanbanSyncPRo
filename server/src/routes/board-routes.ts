import { Router } from 'express';
import authRoutes from './auth-routes';
import boardRoutes from './board-routes';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes (no authentication required)
router.use('/auth', authRoutes);

// Protected routes (require authentication)
router.use('/board', authenticateToken, boardRoutes);

export default router;