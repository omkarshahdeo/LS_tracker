export interface User {
  _id: string;
  name: string;
  email: string;
  token?: string;
}

export interface StudySession {
  _id: string;
  user: string;
  startTime: string;
  endTime: string;
  duration: number;
  subject?: string;
  category?: string;
}

export interface Goal {
  _id: string;
  user: string;
  title: string;
  targetTime: number; // in hours
  progress: number;
}

export interface Skill {
  _id: string;
  user: string;
  name: string;
  proficiency: number;
}

export interface AnalyticsData {
  totalStudyTime: number;
  dailyStudyTime: number;
  weeklyStudyTime: number;
  currentStreak: number;
  goalsCompleted: number;
  totalGoals: number;
}

export interface LeaderboardUser {
  rank: number;
  id: string;
  name: string;
  score: number;
}
