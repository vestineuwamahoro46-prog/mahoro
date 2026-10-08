import React from 'react';
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  Newspaper,
  FileText,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface AdminLayoutProps {
  currentPath: string;
  navigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ currentPath, navigate, children }) => {
  const { user, logout, hasRole } = useAuth();

  if (!user) {
    return (
      <div className="py-24 text-center space-y-4">
        <h2 className="text-xl font-serif font-semibold text-stone-900">Sign In Required</h2>
        <p className="text-xs text-stone-600">Please sign in to access the administrator panel.</p>
        <button
          onClick={() => navigate('/admin/login')}
          className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-md"
        >
          Go to Sign In
        </button>
      </div>
    );
  }

  const menuItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Research Studies', path: '/admin/research', icon: BookOpen },
    { label: 'Results & Analytics', path: '/admin/results', icon: BarChart3 },
    { label: 'Regulatory News', path: '/admin/news', icon: Newspaper },
    { label: 'Research Blog', path: '/admin/blog', icon: FileText },
    { label: 'Users & Permissions', path: '/admin/users', icon: Users, roles: ['SUPER_ADMIN', 'ADMIN'] },
    { label: 'Settings & Data', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-stone-900 text-stone-300 flex flex-col shrink-0 border-r border-stone-800">
        {/* Brand */}
        <div className="p-5 border-b border-stone-800 flex items-center justify-between">
          <button
            onClick={() => navigate('/')}
            className="text-left group cursor-pointer"
          >
            <span className="text-lg font-serif font-semibold text-white block">AcuityResearch</span>
            <span className="text-[10px] text-stone-400 font-mono tracking-wider uppercase block">Directorate Admin</span>
          </button>
          <button
            onClick={() => navigate('/')}
            title="View public website"
            className="p-1 text-stone-400 hover:text-white rounded cursor-pointer"
          >
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPath === item.path || (item.path !== '/admin/dashboard' && currentPath.startsWith(item.path));
            if (item.roles && !item.roles.includes(user.role) && user.role !== 'SUPER_ADMIN') {
              return null;
            }

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-stone-800 text-white font-semibold shadow-xs'
                    : 'text-stone-400 hover:bg-stone-800/60 hover:text-stone-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* User profile & logout footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950/60">
          <div className="flex items-center gap-3 mb-3">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-9 h-9 rounded-full object-cover border border-stone-700"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-stone-800 text-stone-300 flex items-center justify-center font-bold text-xs">
                {user.name.slice(0, 2)}
              </div>
            )}
            <div className="overflow-hidden">
              <span className="text-xs font-semibold text-white block truncate">{user.name}</span>
              <span className="text-[10px] text-stone-400 font-mono block">
                {user.role}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={() => navigate('/')}
              className="text-stone-400 hover:text-white transition-colors"
            >
              Public Home
            </button>
            <button
              onClick={() => {
                logout();
                navigate('/admin/login');
              }}
              className="text-stone-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content body */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
