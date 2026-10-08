import React, { useState } from 'react';
import { Settings, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Database, Loader2 } from 'lucide-react';
import { api } from '../../lib/api.js';
import { useAuth } from '../../context/AuthContext.js';

export const AdminSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResetData = async () => {
    if (!confirm('Are you sure you want to restore default seed data? This will reinitialize the database with the core AML/CFT Rwanda study, 5 news articles, and 5 blog posts.')) {
      return;
    }

    setResetting(true);
    setMessage(null);
    try {
      const res = await api.resetSeedData();
      setMessage(res.message);
    } catch (err: any) {
      alert(err.message || 'Failed to reset seed data.');
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="border-b border-stone-200 pb-5">
        <h1 className="text-2xl font-serif font-bold text-stone-900">
          Platform Configuration & Database Controls
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Manage system parameters, persistence configuration, and deployment demo seed data.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Database State Card */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 text-stone-900 font-semibold text-sm">
          <Database className="w-4 h-4 text-stone-700" />
          <span>Storage Engine & Database Architecture</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-stone-600">
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="font-semibold text-stone-800 block">Persistence Type</span>
            <span>Relational Normalized JSON Data Store with Atomic Sync</span>
          </div>
          <div className="p-3 bg-stone-50 rounded-lg border border-stone-200">
            <span className="font-semibold text-stone-800 block">Respondent Protection</span>
            <span>Zero public exposure, encrypted submission hashes</span>
          </div>
        </div>
      </div>

      {/* Demo Seed Reset Card (Section 27 Requirement!) */}
      <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5 text-stone-900 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          <span>Seed Data & Pre-Production Clean Reset</span>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          The system comes seeded with 3 realistic research studies (including the full Rwanda AML/CFT empirical survey led by MAHORO Cesar), 32 realistic survey responses, 5 regulatory news articles, and 5 blog posts.
          You can restore this standard baseline anytime to test questionnaire branching, chart aggregations, and CSV exports.
        </p>

        <div className="pt-2">
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
          >
            {resetting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Reinitializing Database...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset Database to Default Seed Data</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
