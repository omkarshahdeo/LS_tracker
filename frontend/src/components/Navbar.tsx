'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from './ui/Button';
import { BrainCircuitIcon } from 'lucide-react';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 border-b ${isScrolled ? 'border-white/10 bg-[#030014]/60 backdrop-blur-xl py-2' : 'border-transparent bg-transparent py-4'}`}>
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-2 group">
          <BrainCircuitIcon className="h-8 w-8 text-indigo-400 group-hover:text-fuchsia-400 transition-colors" />
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
            LS-Tracker
          </span>
        </Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <div className="hidden md:flex items-center space-x-6 mr-4 border-r pr-6 border-white/10">
                <Link href="/dashboard" className="text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors">Dashboard</Link>
                <Link href="/goals" className="text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors">Goals</Link>
                <Link href="/learn" className="text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors">Learn</Link>
                <Link href="/leaderboard" className="text-sm font-semibold text-gray-300 hover:text-indigo-400 transition-colors">Leaderboard</Link>
              </div>
              <span className="text-sm font-medium text-gray-200 line-clamp-1 max-w-[120px]">
                Welcome, {user.name}
              </span>
              <Button variant="ghost" onClick={logout} className="text-gray-400 hover:text-white">
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" className="text-gray-300 hover:text-white">Login</Button>
              </Link>
              <Link href="/signup">
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)]">Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};
