import express from 'express';
import { getDashboardAnalytics } from '../controllers/analyticsController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/dashboard', protect, getDashboardAnalytics);

export default router;
