// src/app/admin/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, signIn } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      router.push('/admin/dashboard');
    } catch (err: any) {
      setError('Invalid email or password');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#0D5C63' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <LogIn size={64} className="mx-auto mb-4" style={{ color: '#D4AF37' }} />
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#D4AF37' }}>
            Admin Login
          </h1>
          <p className="opacity-75">Manage church content</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 rounded-lg shadow-2xl" style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)' }}>
          {error && (
            <div className="p-4 mb-4 rounded-lg bg-red-500 bg-opacity-20 border border-red-500 text-red-200">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50 transition-all"
              placeholder="admin@church.com"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-semibold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg bg-white bg-opacity-10 border border-white border-opacity-20 focus:outline-none focus:border-opacity-50 transition-all"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: '#D4AF37',
              color: '#0D5C63',
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="text-center text-sm opacity-75 mt-6">
          For authorized personnel only
        </p>
      </div>
    </div>
  );
}
