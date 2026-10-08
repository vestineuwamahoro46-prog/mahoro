import React, { useState } from 'react';
import { Search, Menu, X, Shield, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.js';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate, onOpenSearch }) => {
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Research', path: '/research' },
    { label: 'Surveys', path: '/surveys' },
    { label: 'News', path: '/news' },
    { label: 'Blog', path: '/blog' },
    { label: 'About', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const handleNav = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element brand wordmark */}
        <button
          onClick={() => handleNav('/')}
          className="text-xl font-serif font-semibold tracking-tight text-stone-900 hover:text-stone-700 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 rounded-sm"
        >
          AcuityResearch
        </button>

        {/* Zone 2: 4–6 nav links, 1–2 word labels, single-line text */}
        <nav className="hidden lg:flex items-center space-x-7 text-sm font-medium text-stone-600">
          {navLinks.map((item) => {
            const isActive =
              currentPath === item.path ||
              (item.path !== '/' && currentPath.startsWith(item.path));
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`transition-colors whitespace-nowrap py-1 cursor-pointer relative ${
                  isActive
                    ? 'text-stone-950 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1–2 primary actions */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenSearch}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer border border-stone-200"
            aria-label="Search research and articles"
          >
            <Search className="w-3.5 h-3.5 text-stone-500" />
            <span className="hidden sm:inline">Search</span>
            <kbd className="hidden sm:inline-block ml-1 px-1 py-0.5 text-[10px] bg-stone-100 text-stone-500 rounded border border-stone-300 font-mono">⌘K</kbd>
          </button>

          {user ? (
            <button
              onClick={() => handleNav('/admin/dashboard')}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors whitespace-nowrap cursor-pointer shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-stone-300" />
              <span>Admin Console</span>
              <span className="hidden md:inline text-[10px] bg-stone-800 text-stone-300 px-1.5 py-0.5 rounded">
                {user.role === 'SUPER_ADMIN' ? 'Super Admin' : user.role.replace('_', ' ')}
              </span>
            </button>
          ) : (
            <button
              onClick={() => handleNav('/admin/login')}
              className="px-3.5 py-1.5 text-xs font-medium text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors whitespace-nowrap cursor-pointer border border-stone-300"
            >
              Admin Sign In
            </button>
          )}

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium rounded-md text-left ${
                  currentPath === item.path
                    ? 'bg-stone-100 text-stone-900 font-semibold'
                    : 'text-stone-600 hover:bg-stone-50'
                }`}
              >
                <span>{item.label}</span>
                <ChevronRight className="w-4 h-4 text-stone-400" />
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
            {user ? (
              <button
                onClick={() => handleNav('/admin/dashboard')}
                className="w-full text-center py-2 text-sm font-medium text-white bg-stone-900 rounded-md"
              >
                Dashboard ({user.name})
              </button>
            ) : (
              <button
                onClick={() => handleNav('/admin/login')}
                className="w-full text-center py-2 text-sm font-medium text-stone-800 bg-stone-100 rounded-md"
              >
                Admin Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
