import type { Request, Response } from 'express';
import { StudySession } from '../models/studySessionModel';

export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const { sortBy = 'time' } = req.query; // 'time' or 'streak'
    
    if (sortBy === 'time') {
      const startOfWeek = new Date();
      startOfWeek.setDate(startOfWeek.getDate() - 7);

      const topUsers = await StudySession.aggregate([
        { $match: { startTime: { $gte: startOfWeek } } },
        { $group: { _id: '$user', totalDuration: { $sum: '$duration' } } },
        { $sort: { totalDuration: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: '$userInfo' },
        {
          $project: {
            _id: 1,
            name: '$userInfo.name',
            totalDuration: 1
          }
        }
      ]);

      res.status(200).json(topUsers.map((u, i) => ({ rank: i + 1, id: u._id, name: u.name, score: u.totalDuration })));
    } else {
      // For MVP streak ranking, we can aggregate the count of distinct days per user over the last 30 days as a proxy
      const startOfMonth = new Date();
      startOfMonth.setDate(startOfMonth.getDate() - 30);
      
      const topStreaks = await StudySession.aggregate([
        { $match: { startTime: { $gte: startOfMonth } } },
        {
          $group: {
            _id: {
              user: '$user',
              day: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } }
            }
          }
        },
        {
          $group: {
            _id: '$_id.user',
            streakDays: { $sum: 1 }
          }
        },
        { $sort: { streakDays: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userInfo'
          }
        },
        { $unwind: '$userInfo' },
        {
          $project: {
            _id: 1,
            name: '$userInfo.name',
            streakDays: 1
          }
        }
      ]);

      res.status(200).json(topStreaks.map((u, i) => ({ rank: i + 1, id: u._id, name: u.name, score: u.streakDays })));
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching leaderboard' });
  }
};
