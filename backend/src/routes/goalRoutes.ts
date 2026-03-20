import express from 'express';
import { createGoal, getGoals, updateGoalDetails, deleteGoal, updateGoalProgress } from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getGoals).post(protect, createGoal);
router.route('/:id').delete(protect, deleteGoal);
router.route('/:id/details').put(protect, updateGoalDetails);
router.route('/:id/progress').put(protect, updateGoalProgress);

export default router;
