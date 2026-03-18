import express from 'express';
import { createGoal, getGoals, updateGoalProgress } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, createGoal);
router.route('/:id').put(protect, updateGoalProgress);

export default router;
