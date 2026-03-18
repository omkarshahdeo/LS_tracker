'use client';

import React from 'react';
import Link from 'next/link';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ArrowRight, BrainCircuit, Target, Zap, Clock, Sparkles } from 'lucide-react';

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  // 3D Tilt Effect State
  const x = useMotionValue(200);
  const y = useMotionValue(200);
  const rotateX = useTransform(y, [0, 400], [15, -15]);
  const rotateY = useTransform(x, [0, 400], [-15, 15]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(200);
    y.set(200);
  };

  return (
    <div className="relative isolate overflow-hidden bg-[#030014] min-h-screen text-white selection:bg-indigo-500/30">
      {/* Background Glowing Orbs */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/30 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-600/20 blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[30%] h-[30%] rounded-full bg-fuchsia-600/20 blur-[120px] -translate-x-1/2" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-16 z-10 py-20">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl lg:flex-shrink-0 lg:pt-8 text-center lg:text-left z-10">
          <motion.div variants={itemVariants} className="mt-24 sm:mt-32 lg:mt-16">
            <span className="inline-flex space-x-6 items-center">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-sm font-semibold leading-6 text-indigo-400 ring-1 ring-inset ring-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-4 h-4" /> LS-Tracker v2.0
              </span>
            </span>
          </motion.div>
          <motion.h1 variants={itemVariants} className="mt-10 text-5xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-6xl drop-shadow-xl">
            Supercharge your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              learning journey
            </span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-6 text-lg leading-8 text-gray-300 max-w-xl mx-auto lg:mx-0 font-light">
            Stay phenomenally focused, set meaningful targets, and measure your exact productivity with the ultimate premium toolkit built specially for students.
          </motion.p>
          <motion.div variants={itemVariants} className="mt-10 flex items-center justify-center lg:justify-start gap-x-6">
            <Link href="/signup">
              <Button size="lg" className="px-8 bg-white/10 text-white backdrop-blur-md border border-white/10 hover:bg-white/20 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all duration-300">
                Get started <Zap className="ml-2 h-4 w-4 text-indigo-400" />
              </Button>
            </Link>
            <Link href="/login" className="text-sm font-semibold leading-6 text-gray-300 hover:text-white transition-colors group flex items-center gap-1">
              Log in <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>

          {/* 3D Hero Visual */}
          <motion.div 
            variants={itemVariants} 
            className="flex-1 flex justify-center lg:justify-end perspective-[1000px]"
          >
            <motion.div 
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="w-full max-w-[32rem] aspect-[4/3] rounded-3xl relative group cursor-pointer"
            >
              {/* 3D Floating Layer */}
              <div 
                className="absolute inset-0 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10 shadow-2xl overflow-hidden transition-colors duration-500 group-hover:border-indigo-500/50"
                style={{ transform: "translateZ(40px)" }}
              >
                {/* Inner content */}
                <div className="p-8 h-full flex flex-col justify-between">
                   <div className="flex items-center justify-between">
                     <h3 className="text-lg font-medium text-gray-200">Current Session</h3>
                     <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                       <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" /> Live
                     </span>
                   </div>
                   <div className="mt-6 flex justify-center py-2">
                     <div className="text-7xl font-mono font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-md">
                       01:42:35
                     </div>
                   </div>
                   <div className="mt-6 grid grid-cols-2 gap-4">
                     <div className="rounded-2xl bg-white/5 border border-white/5 p-4 backdrop-blur-md">
                       <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Subject</p>
                       <p className="text-base font-medium text-gray-100">Advanced Systems</p>
                     </div>
                     <div className="rounded-2xl bg-white/5 border border-white/5 p-4 backdrop-blur-md">
                       <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Focus Score</p>
                       <p className="text-base font-medium text-emerald-400">98.5%</p>
                     </div>
                   </div>
                </div>

                {/* Decorative dynamic gradient overlay inside the card */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-fuchsia-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ transform: "translateZ(1px)" }}
                />
              </div>

              {/* Backglow for the card */}
              <div className="absolute -inset-4 bg-indigo-500/20 blur-3xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            </motion.div>
          </motion.div>
        </div>

        {/* Social Proof Section */}
        <motion.div 
          variants={itemVariants}
          className="w-full max-w-7xl px-6 lg:px-8 pb-10 border-t border-white/5 pt-10 mt-auto flex flex-col items-center gap-6"
        >
          <p className="text-sm font-medium text-gray-500 uppercase tracking-widest">Trusted by 20,000+ students worldwide</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-bold text-xl"><BrainCircuit className="w-6 h-6"/> LEARNHUB</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Target className="w-6 h-6"/> FOCUS.IO</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Zap className="w-6 h-6"/> STDY.AI</div>
             <div className="flex items-center gap-2 font-bold text-xl"><Sparkles className="w-6 h-6"/> FUTURE</div>
          </div>
        </motion.div>
      </motion.div>

      {/* Modern Feature Section */}
      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 py-24 sm:py-32 z-10">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-indigo-400 tracking-wider uppercase">Study Smarter</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">State of the art productivity</p>
          <p className="mt-6 text-lg leading-8 text-gray-400 font-light">
            A premium dashboard completely designed from scratch to eliminate distractions and provide beautiful insights into your workflow.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
            {[
              {
                name: 'Precision Timers',
                description: 'Start a session and focus. Our timer ensures every minute of your study time is accurately logged.',
                icon: Clock,
              },
              {
                name: 'Milestone Tracking',
                description: 'Set hourly study goals for your subjects and watch your progress bar fill up dynamically as you work.',
                icon: Target,
              },
              {
                name: 'Smart Analytics',
                description: 'Understand your true learning patterns over time with detailed session history and streak tracking.',
                icon: BrainCircuit,
              },
            ].map((feature, i) => (
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                key={feature.name} 
                className="flex flex-col relative rounded-3xl bg-white/[0.03] backdrop-blur-xl p-8 border border-white/10 transition-all hover:bg-white/[0.08] hover:border-indigo-500/30 overflow-hidden group"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <dt className="flex items-center gap-x-4 text-lg font-medium leading-7 text-white relative z-10">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/20 border border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <feature.icon className="h-6 w-6 text-indigo-300" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-400 font-light relative z-10">
                  <p className="flex-auto">{feature.description}</p>
                </dd>
              </motion.div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
