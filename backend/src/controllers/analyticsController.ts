import type { Request, Response } from 'express';
import { StudySession } from '../models/studySessionModel';
import { Goal } from '../models/goalModel';
import mongoose from 'mongoose';

export const getDashboardAnalytics = async (req: any, res: Response): Promise<void> => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    
    // Total Study Time
    const totalResult = await StudySession.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
    ]);
    const totalStudyTime = totalResult.length > 0 ? totalResult[0].totalDuration : 0;

    // Today's Study Time
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const todayResult = await StudySession.aggregate([
      { $match: { user: userId, startTime: { $gte: startOfToday } } },
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
    ]);
    const dailyStudyTime = todayResult.length > 0 ? todayResult[0].totalDuration : 0;

    // Weekly Study Time (Last 7 days)
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - 7);
    const weekResult = await StudySession.aggregate([
      { $match: { user: userId, startTime: { $gte: startOfWeek } } },
      { $group: { _id: null, totalDuration: { $sum: '$duration' } } }
    ]);
    const weeklyStudyTime = weekResult.length > 0 ? weekResult[0].totalDuration : 0;

    // Streak Calculation
    const sessions = await StudySession.find({ user: userId })
      .sort({ startTime: -1 })
      .select('startTime');
    
    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0);

    const uniqueDates = [...new Set(sessions.map(s => {
      const d = new Date(s.startTime);
      d.setHours(0, 0, 0, 0);
      return d.getTime();
    }))];

    let hasStudiedToday = uniqueDates.includes(checkDate.getTime());
    
    if (!hasStudiedToday) {
      // If haven't studied today, check if streak continued from yesterday
      checkDate.setDate(checkDate.getDate() - 1);
      if (!uniqueDates.includes(checkDate.getTime())) {
        currentStreak = 0; // Streak broken
      } else {
        currentStreak = 1;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    } else {
      currentStreak = 1;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    if (currentStreak > 0) {
      while (uniqueDates.includes(checkDate.getTime())) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      }
    }

    // Active Goals
    const completedGoals = await Goal.countDocuments({ user: userId, completed: true });
    const totalGoals = await Goal.countDocuments({ user: userId });

    res.status(200).json({
      totalStudyTime,
      dailyStudyTime,
      weeklyStudyTime,
      currentStreak,
      goalsCompleted: completedGoals,
      totalGoals,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error calculating analytics' });
  }
};
