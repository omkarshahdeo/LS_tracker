'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PAST_RECORDINGS } from '@/lib/learnContent';
import { Play, ChevronLeft, Clock, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const TOPICS = ['All', 'DSA', 'Web', 'Math'] as const;

export default function PastRecordingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [topic, setTopic] = useState<(typeof TOPICS)[number]>('All');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const filtered = useMemo(() => {
    if (topic === 'All') return PAST_RECORDINGS;
    return PAST_RECORDINGS.filter((r) => r.topic === topic);
  }, [topic]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          href="/learn"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-indigo-400 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Learn
        </Link>
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">Past recordings</h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          Watch replays anytime. Hook each card to your video host (YouTube, Vimeo, or private CDN).
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {TOPICS.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTopic(t)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              topic === t
                ? 'bg-indigo-600 text-white shadow-[0_0_16px_rgba(99,102,241,0.35)]'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((rec, i) => (
          <motion.div
            key={rec.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card hoverEffect className="overflow-hidden border-white/10 p-0">
              <div
                className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${rec.thumbnailGradient}`}
              >
                <div className="absolute inset-0 bg-black/20" />
                <button
                  type="button"
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-indigo-600 shadow-lg transition-transform hover:scale-105"
                  aria-label={`Play ${rec.title}`}
                  onClick={() => window.alert('Link this to your recorded video URL.')}
                >
                  <Play className="h-7 w-7 ml-1" fill="currentColor" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-md bg-black/50 px-2 py-0.5 text-xs font-mono text-white">
                  {rec.durationMin} min
                </span>
              </div>
              <div className="p-5">
                <span className="text-xs font-medium uppercase tracking-wider text-indigo-400">{rec.topic}</span>
                <h2 className="mt-1 text-lg font-semibold text-white line-clamp-2">{rec.title}</h2>
                <p className="mt-1 text-sm text-gray-500">{rec.instructor}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {rec.recordedAt}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {rec.durationMin} min
                  </span>
                </div>
                <Button
                  variant="ghost"
                  className="mt-4 w-full justify-center text-indigo-300 hover:text-white hover:bg-white/5"
                  onClick={() => window.alert('Link this to your recorded video URL.')}
                >
                  Watch recording
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No recordings in this category yet.</p>
      )}
    </div>
  );
}
