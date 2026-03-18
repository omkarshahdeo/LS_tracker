import { User, StudySession, Goal, AnalyticsData, LeaderboardUser } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (typeof window !== 'undefined') {
    const userString = localStorage.getItem('user');
    if (userString) {
      const user: User = JSON.parse(userString);
      if (user.token) {
        headers['Authorization'] = `Bearer ${user.token}`;
      }
    }
  }
  return headers;
};

// Auth
export const registerUser = async (userData: Record<string, unknown>) => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Failed to register');
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

export const loginUser = async (userData: Record<string, unknown>) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  if (!response.ok) throw new Error('Invalid credentials');
  const data = await response.json();
  if (data.token) {
    localStorage.setItem('user', JSON.stringify(data));
  }
  return data;
};

export const logoutUser = () => {
  localStorage.removeItem('user');
};

// Sessions
export const startSession = async (subject?: string, category?: string): Promise<StudySession> => {
  const response = await fetch(`${API_URL}/sessions`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({ subject, category }),
  });
  if (!response.ok) throw new Error('Failed to start session');
  return response.json();
};

export const endSession = async (id: string, endTime: string, duration: number): Promise<StudySession> => {
  const response = await fetch(`${API_URL}/sessions/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ endTime, duration }),
  });
  if (!response.ok) throw new Error('Failed to end session');
  return response.json();
};

export const getSessions = async (): Promise<StudySession[]> => {
  const response = await fetch(`${API_URL}/sessions`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to get sessions');
  return response.json();
};

// Goals
export const getGoals = async (): Promise<Goal[]> => {
  const response = await fetch(`${API_URL}/goals`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to get goals');
  return response.json();
};

export const createGoal = async (goalData: { title: string; targetTime: number }): Promise<Goal> => {
  const response = await fetch(`${API_URL}/goals`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(goalData),
  });
  if (!response.ok) throw new Error('Failed to create goal');
  return response.json();
};

export const updateGoalProgress = async (id: string, progressTime: number): Promise<Goal> => {
  const response = await fetch(`${API_URL}/goals/${id}`, {
    method: 'PUT',
    headers: getHeaders(),
    body: JSON.stringify({ progressTime }),
  });
  if (!response.ok) throw new Error('Failed to update goal');
  return response.json();
};

// Analytics
export const getAnalytics = async (): Promise<AnalyticsData> => {
  const response = await fetch(`${API_URL}/analytics/dashboard`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to get analytics');
  return response.json();
};

// Leaderboard
export const getLeaderboard = async (sortBy: 'time' | 'streak' = 'time'): Promise<LeaderboardUser[]> => {
  const response = await fetch(`${API_URL}/leaderboard?sortBy=${sortBy}`, {
    headers: getHeaders(),
  });
  if (!response.ok) throw new Error('Failed to get leaderboard');
  return response.json();
};
