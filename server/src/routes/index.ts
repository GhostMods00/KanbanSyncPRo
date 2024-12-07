import { Router } from 'express';
import authRoutes from './auth-routes';
import boardRoutes from './board-routes';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Public routes
router.use('/auth', authRoutes);

// Protected routes
router.use('/board', authenticateToken, boardRoutes);
// Add other protected routes here
router.use('/tasks', authenticateToken, taskRoutes);
router.use('/users', authenticateToken, userRoutes);

export default router;