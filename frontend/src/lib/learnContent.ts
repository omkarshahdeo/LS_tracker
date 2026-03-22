/** Mock content for Learn hub — replace with API/CMS later */

export type LiveStream = {
  id: string;
  title: string;
  instructor: string;
  startsAt: string; // ISO or display string
  description: string;
  status: 'live' | 'starting_soon';
  viewerCount?: number;
};

export type PastRecording = {
  id: string;
  title: string;
  instructor: string;
  durationMin: number;
  recordedAt: string;
  topic: string;
  thumbnailGradient: string; // tailwind gradient classes
};

export type DSAProblem = {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topics: string[];
  statement: string;
  examples: { input: string; output: string; explanation?: string }[];
  hints?: string[];
};

export const LIVE_STREAMS: LiveStream[] = [
  {
    id: 'live-1',
    title: 'Graphs & BFS — Live problem walkthrough',
    instructor: 'Dr. A. Sharma',
    startsAt: 'Today · 6:00 PM',
    description: 'We solve a multi-source BFS grid problem and discuss time complexity.',
    status: 'live',
    viewerCount: 128,
  },
  {
    id: 'live-2',
    title: 'System design for coding interviews',
    instructor: 'Prof. K. Mehta',
    startsAt: 'Tomorrow · 4:30 PM',
    description: 'Intro to scalable APIs, caching, and trade-offs — Q&A at the end.',
    status: 'starting_soon',
  },
  {
    id: 'live-3',
    title: 'Dynamic programming patterns',
    instructor: 'Dr. A. Sharma',
    startsAt: 'Sat · 11:00 AM',
    description: 'Knapsack variants, LCS, and how to recognize DP states.',
    status: 'starting_soon',
  },
];

export const PAST_RECORDINGS: PastRecording[] = [
  {
    id: 'rec-1',
    title: 'Binary Trees — Traversals & reconstruction',
    instructor: 'Dr. A. Sharma',
    durationMin: 62,
    recordedAt: 'Mar 12, 2026',
    topic: 'DSA',
    thumbnailGradient: 'from-indigo-600/40 to-violet-600/30',
  },
  {
    id: 'rec-2',
    title: 'React Server Components deep dive',
    instructor: 'Prof. K. Mehta',
    durationMin: 48,
    recordedAt: 'Mar 10, 2026',
    topic: 'Web',
    thumbnailGradient: 'from-cyan-600/40 to-blue-600/30',
  },
  {
    id: 'rec-3',
    title: 'Calculus II — Series convergence',
    instructor: 'Dr. R. Iyer',
    durationMin: 55,
    recordedAt: 'Mar 8, 2026',
    topic: 'Math',
    thumbnailGradient: 'from-emerald-600/40 to-teal-600/30',
  },
  {
    id: 'rec-4',
    title: 'Greedy algorithms & proofs',
    instructor: 'Dr. A. Sharma',
    durationMin: 71,
    recordedAt: 'Mar 5, 2026',
    topic: 'DSA',
    thumbnailGradient: 'from-fuchsia-600/40 to-pink-600/30',
  },
];

export const DSA_PROBLEMS: DSAProblem[] = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    topics: ['Array', 'Hash Table'],
    statement:
      'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9.' },
    ],
    hints: ['Try storing seen values in a map while scanning once.'],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    topics: ['String', 'Stack'],
    statement:
      'Given a string `s` containing just `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Open brackets must be closed by the same type in the correct order.',
    examples: [{ input: 's = "()[]{}"', output: 'true' }],
  },
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    topics: ['String', 'Sliding Window'],
    statement:
      'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: [{ input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc".' }],
  },
  {
    id: 'merge-k-lists',
    title: 'Merge k Sorted Lists',
    difficulty: 'Hard',
    topics: ['Linked List', 'Heap'],
    statement:
      'You are given an array of `k` linked lists, each sorted in ascending order. Merge all linked lists into one sorted linked list.',
    examples: [{ input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' }],
  },
];

export function getProblemById(id: string): DSAProblem | undefined {
  return DSA_PROBLEMS.find((p) => p.id === id);
}
