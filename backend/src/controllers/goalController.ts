import type { Request, Response } from 'express';
import { Goal } from '../models/goalModel';

export const createGoal = async (req: any, res: Response): Promise<void> => {
  const { title, targetTime, dueDate } = req.body;

  if (!title || !targetTime) {
    res.status(400).json({ message: 'Please add title and targetTime' });
    return;
  }

  const goal = await Goal.create({
    user: req.user.id,
    title,
    targetTime,
    dueDate,
  });

  res.status(201).json(goal);
};

export const getGoals = async (req: any, res: Response): Promise<void> => {
  const goals = await Goal.find({ user: req.user.id });
  res.status(200).json(goals);
};

export const updateGoalDetails = async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;
  const { title, targetTime, dueDate } = req.body;

  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(404).json({ message: 'Goal not found' });
    return;
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  if (title !== undefined) goal.title = title;
  if (targetTime !== undefined) goal.targetTime = targetTime;
  if (dueDate !== undefined) goal.dueDate = dueDate;

  const updatedGoal = await goal.save();
  res.status(200).json(updatedGoal);
};

export const deleteGoal = async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;

  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(404).json({ message: 'Goal not found' });
    return;
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  await goal.deleteOne();
  res.status(200).json({ message: 'Goal removed' });
};

export const updateGoalProgress = async (req: any, res: Response): Promise<void> => {
  const { id } = req.params;
  const { progressTime } = req.body;

  const goal = await Goal.findById(id);

  if (!goal) {
    res.status(404).json({ message: 'Goal not found' });
    return;
  }

  if (goal.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
    return;
  }

  goal.progressTime += progressTime;
  if (goal.progressTime >= goal.targetTime) {
    goal.completed = true;
  }

  const updatedGoal = await goal.save();
  res.status(200).json(updatedGoal);
};
