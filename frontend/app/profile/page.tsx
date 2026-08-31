'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getMe, MeResponse } from '@/services/authService';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// SVG Icons
const UserIcon = () => (
  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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

const CalendarIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const MapIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<MeResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        
        if (!token) {
          router.push('/login');
          return;
        }

        const profile = await getMe(token);
        setUser(profile);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile');
        
        // If unauthorized, redirect to login
        if (err.message.includes('401') || err.message.includes('Unauthorized')) {
          localStorage.removeItem('auth_token');
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-70" />
          <div className="bg-orb-1 absolute w-[70vw] h-[70vw] -top-[20%] -left-[15%] rounded-full blur-[100px] opacity-40" />
          <div className="bg-orb-2 absolute w-[60vw] h-[60vw] -top-[10%] -right-[15%] rounded-full blur-[120px] opacity-35" />
        </div>
        <Navbar />
        <div className="relative z-10 flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="loader"></div>
            <p className="text-slate-400">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen bg-[#05061a] text-slate-100 flex flex-col">
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="bg-grid absolute inset-0 opacity-70" />
          <div className="bg-orb-1 absolute w-[70vw] h-[70vw] -top-[20%] -left-[15%] rounded-full blur-[100px] opacity-40" />
        </div>
        <Navbar />
        <div className="relative z-10 flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-4">⚠️ Error</h2>
            <p className="text-slate-400 mb-6">{error}</p>
            <Link href="/login" className="btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

      {/* Profile Container */}
      <div className="relative z-10 flex-1 px-4 py-12">
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">
              My Profile
            </h1>
            <p className="text-slate-400 text-sm sm:text-base">
              Manage your account and travel preferences
            </p>
          </div>

          {/* Profile Card */}
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-purple-500/20 shadow-2xl mb-6">
            
            {/* Avatar Section */}
            <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 pb-8 border-b border-white/10">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 to-cyan-400 flex items-center justify-center text-white shadow-lg">
                <UserIcon />
              </div>
              <div className="text-center sm:text-left flex-1">
                <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
                <p className="text-slate-400 text-sm">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 hover:text-red-300 text-sm font-semibold transition-all"
              >
                <LogoutIcon />
                Logout
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">
                  <EmailIcon />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 flex-shrink-0">
                  <MapIcon />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Total Trips</p>
                  <p className="text-white font-medium text-2xl">{user.total_trips}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10 sm:col-span-2">
                <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                  <CalendarIcon />
                </div>
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold mb-1">Member Since</p>
                  <p className="text-white font-medium">{formatDate(user.created_at)}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link 
              href="/trips" 
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold shadow-lg shadow-purple-600/30 transition-all hover:scale-[1.02]"
            >
              <MapIcon />
              View My Trips
            </Link>
            <Link 
              href="/#planner-form" 
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-purple-500/40 text-white font-semibold transition-all hover:scale-[1.02]"
            >
              ✨ Create New Trip
            </Link>
          </div>

        </div>
      </div>
      
      <Footer />
    </div>
  );
}
