'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Radio, Video, Library, Code2, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const sections = [
  {
    href: '/learn/live',
    title: 'Live recordings',
    description: 'Join scheduled classes, workshops, and Q&A sessions in real time.',
    icon: Radio,
    gradient: 'from-rose-500/20 to-orange-500/10 border-rose-500/30',
    accent: 'text-rose-300',
  },
  {
    href: '/learn/past',
    title: 'Past recordings',
    description: 'Replay lectures and tutorials on your own schedule.',
    icon: Library,
    gradient: 'from-indigo-500/20 to-violet-500/10 border-indigo-500/30',
    accent: 'text-indigo-300',
  },
  {
    href: '/learn/dsa',
    title: 'DSA practice',
    description: 'Curated problems, hints, and a workspace to build interview muscle.',
    icon: Code2,
    gradient: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/30',
    accent: 'text-emerald-300',
  },
];

export default function LearnHubPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center text-gray-400">Loading…</div>;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-wider text-indigo-400/90">Education</p>
          <h1 className="mt-1 text-4xl font-extrabold tracking-tight text-white">Learn</h1>
          <p className="mt-2 max-w-xl text-gray-400">
            Live classes, on-demand recordings, and structured DSA practice — all in one place.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-400">
          <Video className="h-4 w-4 text-indigo-400" />
          Content below is sample data; plug in your video provider or CMS when ready.
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {sections.map((s, i) => (
          <motion.div
            key={s.href}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <Link href={s.href} className="block h-full">
              <Card
                hoverEffect
                className={`h-full border bg-gradient-to-br ${s.gradient} p-6 transition-colors hover:border-white/20`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className={`rounded-xl border border-white/10 bg-black/20 p-3 ${s.accent}`}>
                    <s.icon className="h-6 w-6" />
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-gray-500" />
                </div>
                <h2 className="mt-5 text-xl font-semibold text-white">{s.title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{s.description}</p>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
