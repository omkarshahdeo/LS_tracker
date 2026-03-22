'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DSA_PROBLEMS, type DSAProblem } from '@/lib/learnContent';
import { ChevronLeft, Code2, Lightbulb, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function difficultyStyle(d: DSAProblem['difficulty']) {
  switch (d) {
    case 'Easy':
      return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30';
    case 'Medium':
      return 'bg-amber-500/15 text-amber-300 border-amber-500/30';
    case 'Hard':
      return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
    default:
      return 'bg-white/10 text-gray-300 border-white/20';
  }
}

export default function DSAPracticePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string>(DSA_PROBLEMS[0]?.id ?? '');
  const [code, setCode] = useState(`function solve(nums, target) {\n  // Your code here\n}\n`);
  const [filter, setFilter] = useState<string>('All');

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const topics = useMemo(() => {
    const set = new Set<string>();
    DSA_PROBLEMS.forEach((p) => p.topics.forEach((t) => set.add(t)));
    return ['All', ...Array.from(set).sort()];
  }, []);

  const filteredProblems = useMemo(() => {
    if (filter === 'All') return DSA_PROBLEMS;
    return DSA_PROBLEMS.filter((p) => p.topics.includes(filter));
  }, [filter]);

  const selected = useMemo(() => {
    if (filteredProblems.length === 0) return undefined;
    const match = filteredProblems.find((p) => p.id === selectedId);
    return match ?? filteredProblems[0];
  }, [selectedId, filteredProblems]);

  useEffect(() => {
    if (!selected) return;
    const stillInFilter = filteredProblems.some((p) => p.id === selectedId);
    if (!stillInFilter) setSelectedId(selected.id);
  }, [filteredProblems, selected, selectedId]);

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
        <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">DSA practice</h1>
        <p className="mt-2 text-gray-400 max-w-2xl">
          Pick a problem, read the statement, and sketch a solution. Connect the Run button to a judge API (e.g. Piston,
          custom backend) when you&apos;re ready.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {topics.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => {
              setFilter(t);
              const next = t === 'All' ? DSA_PROBLEMS[0] : DSA_PROBLEMS.find((p) => p.topics.includes(t));
              if (next) setSelectedId(next.id);
            }}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              filter === t
                ? 'bg-emerald-600/80 text-white border border-emerald-400/40'
                : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-4 border-white/10 p-0 overflow-hidden max-h-[70vh] flex flex-col min-h-[320px]">
          <div className="border-b border-white/10 px-4 py-3 flex items-center gap-2 bg-white/[0.03]">
            <Code2 className="h-4 w-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">Problems</span>
          </div>
          <ul className="overflow-y-auto flex-1 p-2 space-y-1">
            {filteredProblems.map((p) => (
              <li key={p.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(p.id)}
                  className={`w-full text-left rounded-xl px-3 py-3 text-sm transition-colors ${
                    selected?.id === p.id
                      ? 'bg-emerald-500/15 text-white ring-1 ring-emerald-500/40'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium truncate">{p.title}</span>
                    <span
                      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase ${difficultyStyle(p.difficulty)}`}
                    >
                      {p.difficulty}
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {p.topics.map((t) => (
                      <span key={t} className="text-[10px] text-gray-500">
                        {t}
                      </span>
                    ))}
                  </div>
                </button>
              </li>
            ))}
            {filteredProblems.length === 0 && (
              <li className="px-3 py-8 text-center text-sm text-gray-500">No problems for this topic.</li>
            )}
          </ul>
        </Card>

        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="border-white/10">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selected.title}</h2>
                      <div className="mt-2 flex flex-wrap gap-2">
                        <span
                          className={`rounded-full border px-3 py-0.5 text-xs font-semibold ${difficultyStyle(selected.difficulty)}`}
                        >
                          {selected.difficulty}
                        </span>
                        {selected.topics.map((t) => (
                          <span
                            key={t}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-xs text-gray-300"
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 prose prose-invert prose-sm max-w-none">
                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{selected.statement}</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <h3 className="text-sm font-semibold text-white">Examples</h3>
                    {selected.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-xs text-gray-300 space-y-2"
                      >
                        <div>
                          <span className="text-gray-500">Input: </span>
                          {ex.input}
                        </div>
                        <div>
                          <span className="text-gray-500">Output: </span>
                          {ex.output}
                        </div>
                        {ex.explanation && (
                          <div className="text-gray-500 pt-1 border-t border-white/5">{ex.explanation}</div>
                        )}
                      </div>
                    ))}
                  </div>
                  {selected.hints && selected.hints.length > 0 && (
                    <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
                      <div className="flex items-center gap-2 text-amber-200 text-sm font-semibold">
                        <Lightbulb className="h-4 w-4" />
                        Hints
                      </div>
                      <ul className="mt-2 list-disc list-inside text-sm text-amber-100/80 space-y-1">
                        {selected.hints.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </Card>

                <Card className="mt-4 border-white/10">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <span className="text-sm font-semibold text-white">Workspace</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 border-none"
                        onClick={() => window.alert('Wire this to your code execution API.')}
                      >
                        <Play className="h-3.5 w-3.5" />
                        Run (stub)
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400" onClick={() => setCode('')}>
                        Clear
                      </Button>
                    </div>
                  </div>
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    spellCheck={false}
                    className="w-full min-h-[220px] rounded-xl border border-white/10 bg-[#0a0a12] p-4 font-mono text-sm text-emerald-100/90 focus:border-emerald-500/50 focus:outline-none focus:ring-1 focus:ring-emerald-500/30"
                  />
                  <p className="mt-2 text-xs text-gray-500">
                    Monaco / CodeMirror can replace this textarea for syntax highlighting and test cases.
                  </p>
                </Card>
              </motion.div>
            ) : (
              <Card className="border-white/10 py-16 text-center text-gray-500">
                Select a topic filter with at least one problem.
              </Card>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
