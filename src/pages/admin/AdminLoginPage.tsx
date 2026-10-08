import React, { useState } from 'react';
import { Shield, Lock, Mail, ArrowRight, UserCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLoginPageProps {
  navigate: (path: string) => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ navigate }) => {
  const { login, user } = useAuth();
  const [email, setEmail] = useState('superadmin@acuityresearch.rw');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (user) {
    return (
      <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
        <Shield className="w-12 h-12 text-stone-800 mx-auto" />
        <h2 className="text-xl font-serif font-semibold text-stone-900">Signed In as {user.name}</h2>
        <p className="text-xs text-stone-500">Role: {user.role}</p>
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="w-full py-2.5 text-xs font-semibold text-white bg-stone-900 rounded-md"
        >
          Open Admin Dashboard
        </button>
      </div>
    );
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid administrator credentials.');
    } finally {
      setLoading(false);
    }
  };

  const quickLoginAs = async (demoEmail: string) => {
    setEmail(demoEmail);
    setLoading(true);
    setError(null);
    try {
      await login(demoEmail);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-stone-900 text-white flex items-center justify-center mx-auto shadow-sm">
          <Shield className="w-6 h-6" />
        </div>
        <h1 className="text-2xl font-serif font-bold text-stone-950">
          Admin Portal Authentication
        </h1>
        <p className="text-xs text-stone-500">
          Restricted access for authorized research investigators and editors.
        </p>
      </div>

      <div className="bg-white p-8 rounded-xl border border-stone-200 shadow-sm space-y-6">
        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignIn} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-700">Administrator Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                placeholder="admin@acuityresearch.rw"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-stone-700">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-stone-800"
                placeholder="••••••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to Admin Portal</span>}
          </button>
        </form>

        {/* Quick Role Tester Buttons (Requested in spec for evaluating 5 distinct roles!) */}
        <div className="pt-4 border-t border-stone-100 space-y-2">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
            One-Click Role Demonstration:
          </div>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <button
              type="button"
              onClick={() => quickLoginAs('superadmin@acuityresearch.rw')}
              className="w-full text-left p-2 rounded-md hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold block">MAHORO Cesar</span>
                <span className="text-[10px] text-stone-500">SUPER_ADMIN · Full Platform Control</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('admin@acuityresearch.rw')}
              className="w-full text-left p-2 rounded-md hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold block">Dr. Aline Uwera</span>
                <span className="text-[10px] text-stone-500">ADMIN · Research & Content Management</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('researcher@acuityresearch.rw')}
              className="w-full text-left p-2 rounded-md hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold block">Jean-Paul Mugisha</span>
                <span className="text-[10px] text-stone-500">RESEARCH_EDITOR · Studies & Questionnaires</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('editor@acuityresearch.rw')}
              className="w-full text-left p-2 rounded-md hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold block">Claire Mukamana</span>
                <span className="text-[10px] text-stone-500">CONTENT_EDITOR · News & Blog Articles</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>

            <button
              type="button"
              onClick={() => quickLoginAs('analyst@acuityresearch.rw')}
              className="w-full text-left p-2 rounded-md hover:bg-stone-50 border border-stone-200 text-stone-800 flex items-center justify-between cursor-pointer"
            >
              <div>
                <span className="font-semibold block">David Habimana</span>
                <span className="text-[10px] text-stone-500">ANALYST · Results & Data Exports</span>
              </div>
              <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
