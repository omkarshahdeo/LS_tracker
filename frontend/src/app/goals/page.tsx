'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { getGoals, createGoal, updateGoalDetails, deleteGoal } from '@/services/api';
import { Goal } from '@/types';
import { Target, PlusCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GoalsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  
  const [title, setTitle] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editTargetTime, setEditTargetTime] = useState('');

  const fetchGoals = useCallback(async () => {
    try {
      const data = await getGoals();
      setGoals(data);
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
      fetchGoals();
    }
  }, [user, fetchGoals]);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !targetTime) return;

    try {
      // time entered in hours, targetTime in seconds
      const targetTimeSecs = parseFloat(targetTime) * 3600;
      await createGoal({ title, targetTime: targetTimeSecs });
      
      setTitle('');
      setTargetTime('');
      setIsAdding(false);
      fetchGoals();
    } catch (err) {
      console.error('Failed to create goal', err);
    }
  };

  const openEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditTitle(goal.title);
    setEditTargetTime((goal.targetTime / 3600).toString());
  };

  const handleUpdateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGoal || !editTitle || !editTargetTime) return;

    try {
      const targetTimeSecs = parseFloat(editTargetTime) * 3600;
      await updateGoalDetails(editingGoal._id, { title: editTitle, targetTime: targetTimeSecs });
      setEditingGoal(null);
      setEditTitle('');
      setEditTargetTime('');
      fetchGoals();
    } catch (err) {
      console.error('Failed to update goal', err);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    try {
      await deleteGoal(goalId);
      setGoals(prev => prev.filter(g => g._id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal', err);
    }
  };

  if (loading || !user) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8 relative z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">Learning Goals</h1>
          <p className="text-gray-400 font-light">Set targets and track your milestones.</p>
        </div>
        <Button onClick={() => setIsAdding(!isAdding)} className="gap-2 bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] border-none">
          <PlusCircle className="h-5 w-5" /> New Goal
        </Button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: -20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            className="overflow-hidden"
          >
            <Card className="mb-8 border-indigo-500/30 bg-indigo-500/10 shadow-[0_0_30px_rgba(99,102,241,0.1)]">
              <form onSubmit={handleCreateGoal} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <Input 
                    label="Goal Title" 
                    placeholder="e.g. Master React Hooks"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                  />
                  <Input 
                    label="Target Time (Hours)" 
                    type="number"
                    min="1"
                    placeholder="10"
                    value={targetTime}
                    onChange={e => setTargetTime(e.target.value)}
                    required
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-white">Cancel</Button>
                  <Button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]">Save Goal</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {goals.map((goal, i) => {
          const progressPercent = Math.min(100, Math.round((goal.progressTime / goal.targetTime) * 100));
          
          return (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={goal._id}
            >
              <Card hoverEffect className="flex flex-col justify-between h-full border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Target className="h-5 w-5" />
                      </div>
                      <h3 className="font-semibold text-white text-lg">{goal.title}</h3>
                    </div>
                    <div className="flex items-center space-x-3">
                      {goal.completed && <CheckCircle2 className="h-6 w-6 text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-400 hover:text-white px-2 py-1"
                        onClick={() => openEditGoal(goal)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1"
                        onClick={() => handleDeleteGoal(goal._id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="font-medium text-gray-300 bg-white/5 px-2 py-1 rounded-md border border-white/10">{progressPercent}%</span>
                      <span className="text-gray-400 font-mono text-xs tracking-wider">
                        {(goal.progressTime / 3600).toFixed(1)}H / {(goal.targetTime / 3600).toFixed(1)}H
                      </span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/5 border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${progressPercent}%` }}
                        transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                        className={`h-full rounded-full relative ${goal.completed ? 'bg-gradient-to-r from-emerald-400 to-teal-400' : 'bg-gradient-to-r from-indigo-500 to-fuchsia-500'}`} 
                      >
                        <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}

        {goals.length === 0 && !isAdding && (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center text-gray-500 border border-dashed border-white/10 rounded-2xl bg-white/[0.02]">
            <Target className="mb-4 h-12 w-12 text-white/10" />
            <h3 className="text-xl font-medium text-white mb-2">No goals found</h3>
            <p className="text-gray-400">Get started by setting your first learning milestone.</p>
            <Button onClick={() => setIsAdding(true)} className="mt-6 bg-white/5 hover:bg-white/10 text-white border border-white/10">Create Goal</Button>
          </div>
        )}
      </div>

      {editingGoal && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <Card className="w-full max-w-lg border-indigo-500/40 bg-[#050317]">
              <h2 className="text-xl font-semibold text-white mb-4">Edit Goal</h2>
              <form onSubmit={handleUpdateGoal} className="space-y-6">
                <Input
                  label="Goal Title"
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  required
                />
                <Input
                  label="Target Time (Hours)"
                  type="number"
                  min="1"
                  value={editTargetTime}
                  onChange={e => setEditTargetTime(e.target.value)}
                  required
                />
                <div className="flex justify-end gap-3">
                  <Button
                    variant="ghost"
                    className="text-gray-400 hover:text-white"
                    type="button"
                    onClick={() => setEditingGoal(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_10px_rgba(99,102,241,0.4)]"
                  >
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}
