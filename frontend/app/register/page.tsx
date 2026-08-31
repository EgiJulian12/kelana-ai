'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { register, login } from '@/services/authService';
import Navbar from '@/components/Navbar';

// SVG Icons
const UserIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const LockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      setLoading(false);
      return;
    }

    try {
      // Register user
      await register(name, email, password);
      
      // Auto-login after registration
      const loginResult = await login(email, password);
      localStorage.setItem('auth_token', loginResult.access_token);
      
      // Redirect to home page (destinasi) instead of /trips
      router.push('/');
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      
      // Check if email already registered
      if (errorMessage.toLowerCase().includes('already registered')) {
        setError('This email is already registered. Please login instead or use a different email.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="bg-grid absolute inset-0 opacity-70" />
        <div className="bg-orb-1 absolute w-[70vw] h-[70vw] -top-[20%] -left-[15%] rounded-full blur-[100px] opacity-40" />
        <div className="bg-orb-2 absolute w-[60vw] h-[60vw] -top-[10%] -right-[15%] rounded-full blur-[120px] opacity-35" />
        <div className="bg-orb-3 absolute w-[45vw] h-[45vw] top-[40%] left-[25%] rounded-full blur-[130px] opacity-25" />
      </div>

      <Navbar />

      {/* Register Form Container */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              Create Account
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Start planning your dream trips with AI
            </p>
          </div>

          {/* Register Card */}
          <div className="glass-card rounded-3xl p-8 border border-purple-500/20 shadow-2xl">
            
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <UserIcon />
                  <span>Full Name</span>
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="glass-input w-full px-4 py-3.5"
                  required
                  disabled={loading}
                />
              </div>

              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <EmailIcon />
                  <span>Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="glass-input w-full px-4 py-3.5"
                  required
                  disabled={loading}
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <LockIcon />
                  <span>Password</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full px-4 py-3.5"
                  required
                  disabled={loading}
                  minLength={6}
                />
                <p className="text-xs text-slate-500">Minimum 6 characters</p>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                  <LockIcon />
                  <span>Confirm Password</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="glass-input w-full px-4 py-3.5"
                  required
                  disabled={loading}
                />
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-lg">⚠️</span>
                    <div className="flex-1">
                      <p>{error}</p>
                      {error.toLowerCase().includes('already registered') && (
                        <Link 
                          href="/login" 
                          className="inline-block mt-2 text-purple-400 hover:text-purple-300 font-semibold underline"
                        >
                          Go to Login →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-full font-bold text-sm sm:text-base transition-all ${
                  loading
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    : 'btn-glow text-white cursor-pointer'
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="spinner" />
                    <span>Creating account...</span>
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-slate-500 uppercase font-semibold">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Login Link */}
            <div className="text-center">
              <p className="text-sm text-slate-400">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>

          {/* Back to Home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-sm text-slate-400 hover:text-slate-300 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
