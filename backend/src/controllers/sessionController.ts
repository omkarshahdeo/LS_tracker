import type { Request, Response } from 'express';
import { StudySession } from '../models/studySessionModel';
import { Goal } from '../models/goalModel';

export const startSession = async (req: any, res: Response): Promise<void> => {
  const { subject, category } = req.body;
  const session = await StudySession.create({
    user: req.user.id,
    startTime: new Date(),
    endTime: new Date(), // Placeholders waiting for endSession
    duration: 0,
    subject,
    category,
  });
  res.status(201).json(session);
};

export const endSession = async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;
  const { endTime, duration } = req.body;

  const session = await StudySession.findById(id);

  if (!session) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  // Make sure the logged in user matches the session user
  if (session.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  session.endTime = new Date(endTime);
  session.duration = duration;

  const updatedSession = await session.save();

  // Progress all goals by the session duration.
  // This makes the goal tracker bars fill as you study.
  const goals = await Goal.find({ user: req.user.id, completed: false });
  for (const goal of goals) {
    goal.progressTime += duration;
    if (goal.progressTime >= goal.targetTime) {
      goal.completed = true;
    }
    await goal.save();
  }

  res.status(200).json(updatedSession);
};

export const getHistory = async (req: any, res: Response): Promise<void> => {
  const sessions = await StudySession.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(sessions);
};
