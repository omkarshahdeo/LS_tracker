'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getLeaderboard } from '@/services/api';
import { LeaderboardUser } from '@/types';
import { Trophy, Clock, Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [sortBy, setSortBy] = useState<'time'|'streak'>('time');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchLeaderboard(sortBy);
    }
  }, [user, sortBy]);

  const fetchLeaderboard = async (sortMode: 'time'|'streak') => {
    setIsLoading(true);
    try {
      const data = await getLeaderboard(sortMode);
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  };

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-500 drop-shadow-[0_0_15px_rgba(234,179,8,0.5)]" /> Leaderboard
          </h1>
          <p className="text-gray-400 font-light mt-2 mb-1">See how you rank against other learners.</p>
        </div>

        <div className="flex space-x-3 bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          <Button 
            variant="ghost"
            onClick={() => setSortBy('time')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${sortBy === 'time' ? 'bg-indigo-500/20 text-indigo-300 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'text-gray-400 hover:text-white'}`}
          >
            <Clock className="w-4 h-4" /> By Total Time
          </Button>
          <Button 
            variant="ghost"
            onClick={() => setSortBy('streak')}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 transition-all ${sortBy === 'streak' ? 'bg-orange-500/20 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.2)]' : 'text-gray-400 hover:text-white'}`}
          >
            <Flame className="w-4 h-4" /> By Streak
          </Button>
        </div>
      </div>

      <Card className="p-0 overflow-hidden border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        {isLoading ? (
          <div className="p-16 flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
          </div>
        ) : users.length === 0 ? (
          <div className="p-16 text-center text-gray-500">No data available for leaderboard.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#030014]/50 border-b border-white/10">
                <tr>
                  <th className="px-6 py-5 text-sm font-semibold text-gray-400 uppercase tracking-wider w-24 text-center">Rank</th>
                  <th className="px-6 py-5 text-sm font-semibold text-gray-400 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-5 text-sm font-semibold text-gray-400 uppercase tracking-wider text-right">
                    {sortBy === 'time' ? 'Total Time' : 'Streak Days'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u, i) => (
                  <motion.tr 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={u.id}
                    className={`transition-colors hover:bg-white/[0.04] ${u.id === user?._id ? 'bg-indigo-500/10' : ''}`}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-center w-10 h-10 mx-auto rounded-xl bg-white/5 border border-white/10 shadow-inner">
                        <span className={`text-base font-bold ${i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-300' : i === 2 ? 'text-amber-600' : 'text-gray-500'}`}>
                          {u.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-start items-center gap-3">
                         <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                           {u.name.charAt(0).toUpperCase()}
                         </div>
                         <div className="flex flex-col">
                           <span className="font-semibold text-white text-base">
                             {u.name} 
                           </span>
                           {u.id === user?._id && <span className="text-xs text-indigo-400 tracking-wide uppercase mt-0.5">Current User</span>}
                         </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-right font-mono text-lg text-white font-medium">
                      {sortBy === 'time' ? (
                         <span className="bg-white/5 px-3 py-1.5 rounded-lg border border-white/5">{formatTime(u.score)}</span>
                      ) : (
                         <span className="flex items-center justify-end gap-2 text-orange-400 bg-orange-500/10 px-3 py-1.5 rounded-lg border border-orange-500/20 w-max ml-auto">
                           {u.score} <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
                         </span>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
