'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LIVE_STREAMS } from '@/lib/learnContent';
import { Radio, Users, Clock, ChevronLeft, Circle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveRecordingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

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
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">Live recordings</h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          Sessions happening now or starting soon. Replace the join URLs with your Zoom, Meet, or embedded player.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {LIVE_STREAMS.map((stream, i) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Card className="relative overflow-hidden border-white/10">
              {stream.status === 'live' && (
                <div className="absolute right-4 top-4 flex items-center gap-2 rounded-full bg-rose-500/20 px-3 py-1 text-xs font-semibold text-rose-200 ring-1 ring-rose-500/40">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
                  </span>
                  LIVE
                </div>
              )}
              <div className="flex items-start gap-4">
                <div className="rounded-2xl bg-gradient-to-br from-rose-500/20 to-orange-500/10 p-4 border border-rose-500/20">
                  <Radio className="h-8 w-8 text-rose-300" />
                </div>
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg font-semibold text-white pr-24 lg:pr-32">{stream.title}</h2>
                  <p className="mt-1 text-sm text-gray-500">{stream.instructor}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-400">
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-400" />
                      {stream.startsAt}
                    </span>
                    {stream.viewerCount != null && (
                      <span className="inline-flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-indigo-400" />
                        {stream.viewerCount} watching
                      </span>
                    )}
                    {stream.status === 'starting_soon' && (
                      <span className="inline-flex items-center gap-1.5 text-amber-300/90">
                        <Circle className="h-2 w-2 fill-current" />
                        Starting soon
                      </span>
                    )}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-gray-400">{stream.description}</p>
                  <div className="mt-6 flex flex-wrap gap-3">
                    <Button
                      className="bg-rose-600 hover:bg-rose-500 border-none shadow-[0_0_20px_rgba(244,63,94,0.25)]"
                      onClick={() => {
                        // Placeholder — wire to your stream URL
                        window.alert('Connect this button to your live stream URL (Zoom, Meet, etc.).');
                      }}
                    >
                      {stream.status === 'live' ? 'Join live' : 'Remind me'}
                    </Button>
                    <Button variant="ghost" className="text-gray-400 hover:text-white">
                      Add to calendar
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
