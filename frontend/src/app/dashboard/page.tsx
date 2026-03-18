'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { startSession, endSession, getSessions, getAnalytics } from '@/services/api';
import { StudySession, AnalyticsData } from '@/types';
import { PlayCircle, StopCircle, Clock, BookOpen, Calendar, Flame, Target } from 'lucide-react';
import { motion } from 'framer-motion';

const CATEGORIES = ['DSA', 'Web Dev', 'College', 'Reading', 'Other'];

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  
  const [activeSession, setActiveSession] = useState<StudySession | null>(null);
  const [timer, setTimer] = useState(0); // seconds
  const [isTracking, setIsTracking] = useState(false);
  
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [sessionsData, analyticsData] = await Promise.all([
        getSessions(),
        getAnalytics()
      ]);
      setSessions(sessionsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [user, fetchData]);

  const handleStartSession = async () => {
    try {
      const newSession = await startSession(subject || 'General Study', category);
      setActiveSession(newSession);
      setIsTracking(true);
      
      timerRef.current = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } catch (err) {
      console.error('Failed to start session', err);
    }
  };

  const handleStopSession = async () => {
    if (!activeSession) return;
    
    try {
      if (timerRef.current) clearInterval(timerRef.current);
      const endTime = new Date().toISOString();
      await endSession(activeSession._id, endTime, timer);
      
      setActiveSession(null);
      setIsTracking(false);
      setTimer(0);
      setSubject('');
      fetchData();
    } catch (err) {
      console.error('Failed to end session', err);
    }
  };

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  const formatTimer = (time: number) => {
    const h = Math.floor(time / 3600).toString().padStart(2, '0');
    const m = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
    const s = (time % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const formatHoursMins = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header section */}
      <div className="relative z-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Dashboard</h1>
        <p className="text-gray-400 font-light">Track your progress and stay on top of your learning goals.</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 relative z-10">
        <Card hoverEffect className="flex items-center space-x-4 border-indigo-500/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="rounded-2xl bg-indigo-500/20 p-4 border border-indigo-500/30">
            <Clock className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Total Study Time</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {analytics ? formatHoursMins(analytics.totalStudyTime) : '0h 0m'}
            </h3>
          </div>
        </Card>

        <Card hoverEffect className="flex items-center space-x-4 border-fuchsia-500/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="rounded-2xl bg-fuchsia-500/20 p-4 border border-fuchsia-500/30">
            <BookOpen className="h-6 w-6 text-fuchsia-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Today</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {analytics ? formatHoursMins(analytics.dailyStudyTime) : '0h 0m'}
            </h3>
          </div>
        </Card>
        
        <Card hoverEffect className="flex items-center space-x-4 border-orange-500/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="rounded-2xl bg-orange-500/20 p-4 border border-orange-500/30">
            <Flame className="h-6 w-6 text-orange-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Current Streak</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {analytics ? analytics.currentStreak : 0} Days
            </h3>
          </div>
        </Card>

        <Card hoverEffect className="flex items-center space-x-4 border-emerald-500/20 overflow-hidden relative group">
          <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="rounded-2xl bg-emerald-500/20 p-4 border border-emerald-500/30">
            <Target className="h-6 w-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Goals Completed</p>
            <h3 className="text-3xl font-bold text-white mt-1">
              {analytics ? analytics.goalsCompleted : 0}
            </h3>
          </div>
        </Card>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 relative z-10">
        {/* Timer Section */}
        <div className="lg:col-span-1">
          <Card className={`relative overflow-hidden ${isTracking ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : ''}`}>
            {isTracking && (
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-500 animate-pulse" />
            )}
            <h3 className="text-lg font-semibold text-white">Live Tracker</h3>
            
            <div className="my-8 flex flex-col items-center justify-center">
              <motion.div 
                className={`text-7xl font-mono tracking-tighter ${isTracking ? 'text-transparent bg-clip-text bg-gradient-to-b from-emerald-300 to-emerald-600 drop-shadow-md' : 'text-gray-400'}`}
                animate={isTracking ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                {formatTimer(timer)}
              </motion.div>
              <p className="mt-4 text-sm text-gray-400 uppercase tracking-widest font-medium">
                {isTracking ? `Studying ${category}...` : 'Ready to focus?'}
              </p>
            </div>

            {!isTracking && (
              <div className="mb-6 space-y-4">
                <div>
                  <label htmlFor="category-select" className="text-sm font-medium text-gray-400 mb-1 block">Category</label>
                  <select 
                    id="category-select"
                    title="Select Category"
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 px-4 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#030014]">{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="subject-input" className="text-sm font-medium text-gray-400 mb-1 block">Subject (Optional)</label>
                  <input
                    id="subject-input"
                    type="text"
                    placeholder="E.g. Dynamic Programming"
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder:text-gray-600"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center">
              {!isTracking ? (
                <Button onClick={handleStartSession} size="lg" className="w-full gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] bg-indigo-600 hover:bg-indigo-500 border-none items-center justify-center">
                  <PlayCircle className="h-5 w-5" /> Start Studying
                </Button>
              ) : (
                <Button onClick={handleStopSession} variant="danger" size="lg" className="w-full gap-2 shadow-[0_0_20px_rgba(239,68,68,0.3)] items-center justify-center">
                  <StopCircle className="h-5 w-5" /> End Session
                </Button>
              )}
            </div>
          </Card>
        </div>

        {/* History Section */}
        <div className="lg:col-span-2">
          <Card className="h-full border-white/5">
            <h3 className="mb-6 text-lg font-semibold text-white">Recent Sessions</h3>
            {sessions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500">
                <Calendar className="mb-4 h-12 w-12 text-white/10" />
                <p className="text-lg">No study sessions yet.</p>
                <p className="text-sm mt-1 text-gray-600">Start the tracker to record your first session!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={session._id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-white/5 bg-white/[0.02] p-5 transition-all hover:bg-white/[0.05] hover:border-indigo-500/30"
                  >
                    <div>
                      <h4 className="font-medium text-white flex items-center">
                        {session.subject || 'General Study'}
                        {session.category && (
                          <span className="ml-3 rounded-full bg-indigo-500/20 border border-indigo-500/30 px-3 py-0.5 text-xs font-medium text-indigo-300">
                            {session.category}
                          </span>
                        )}
                      </h4>
                      <p className="text-sm text-gray-500 mt-2">
                        {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div className="mt-4 sm:mt-0 font-mono text-xl text-fuchsia-400 font-bold bg-fuchsia-400/10 px-4 py-2 rounded-xl border border-fuchsia-400/20 shadow-[0_0_10px_rgba(232,121,249,0.1)]">
                      {formatTimer(session.duration)}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            
            {sessions.length > 5 && (
              <div className="mt-6 text-center">
                <Button variant="ghost" className="text-sm text-gray-400 hover:text-white">View All History</Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
