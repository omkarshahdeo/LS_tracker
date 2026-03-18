import express from 'express';
import { startSession, endSession, getHistory } from '../controllers/sessionController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').get(protect, getHistory).post(protect, startSession);
router.route('/:id').put(protect, endSession);

export default router;
