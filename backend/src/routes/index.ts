import { Router } from 'express';
import authRoutes from './auth';
import userRoutes from './users';
import skillRoutes from './skills';
import tagRoutes from './tags';

const router = Router();

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/skills', skillRoutes);
router.use('/tags', tagRoutes);

export default router;
