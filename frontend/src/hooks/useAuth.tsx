'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { useRouter } from 'next/navigation';
import { getMe } from '@/services/api';

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      setLoading(false);
      return;
    }

    const parsed = JSON.parse(storedUser) as User;
    setUser(parsed);

    // Validate the token against the backend. With in-memory Mongo (dev), a restart can
    // invalidate the stored JWT because the user document no longer exists.
    const validate = async () => {
      try {
        const me = await getMe();
        setUser((prev) => {
          if (!prev) return me;
          // Preserve the token from localStorage (backend /me doesn't return it)
          return { ...me, token: prev.token };
        });
      } catch (err) {
        localStorage.removeItem('user');
        setUser(null);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    void validate();
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    router.push('/dashboard');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
