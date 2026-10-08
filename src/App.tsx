import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Header } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { SearchModal } from './components/common/SearchModal.js';

// Public pages
import { HomePage } from './pages/HomePage.js';
import { ResearchListingPage } from './pages/ResearchListingPage.js';
import { ResearchDetailPage } from './pages/ResearchDetailPage.js';
import { SurveyRunnerPage } from './pages/SurveyRunnerPage.js';
import { NewsPage } from './pages/NewsPage.js';
import { NewsDetailPage } from './pages/NewsDetailPage.js';
import { BlogPage } from './pages/BlogPage.js';
import { BlogDetailPage } from './pages/BlogDetailPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';

// Admin pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage.js';
import { AdminLayout } from './components/admin/AdminLayout.js';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage.js';
import { AdminResearchListPage } from './pages/admin/AdminResearchListPage.js';
import { AdminResearchBuilderPage } from './pages/admin/AdminResearchBuilderPage.js';
import { AdminResultsPage } from './pages/admin/AdminResultsPage.js';
import { AdminNewsPage } from './pages/admin/AdminNewsPage.js';
import { AdminBlogPage } from './pages/admin/AdminBlogPage.js';
import { AdminUsersPage } from './pages/admin/AdminUsersPage.js';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage.js';

function AppContent() {
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname || '/');
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (path !== currentPath) {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isAdminRoute = currentPath.startsWith('/admin') && currentPath !== '/admin/login';

  const renderContent = () => {
    // 1. Home
    if (currentPath === '/' || currentPath === '') {
      return <HomePage navigate={navigate} />;
    }

    // 2. Research listing
    if (currentPath === '/research') {
      return <ResearchListingPage navigate={navigate} />;
    }

    // 3. Surveys listing
    if (currentPath === '/surveys') {
      return <ResearchListingPage navigate={navigate} surveyModeOnly={true} />;
    }

    // 4. Research Detail: /research/:idOrSlug
    if (currentPath.startsWith('/research/')) {
      const idOrSlug = currentPath.replace('/research/', '');
      return <ResearchDetailPage idOrSlug={idOrSlug} navigate={navigate} />;
    }

    // 5. Survey Runner: /survey/:id
    if (currentPath.startsWith('/survey/')) {
      const projectId = currentPath.replace('/survey/', '');
      return <SurveyRunnerPage projectId={projectId} navigate={navigate} />;
    }

    // 6. News
    if (currentPath === '/news') {
      return <NewsPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/news/')) {
      const idOrSlug = currentPath.replace('/news/', '');
      return <NewsDetailPage idOrSlug={idOrSlug} navigate={navigate} />;
    }

    // 7. Blog
    if (currentPath === '/blog') {
      return <BlogPage navigate={navigate} />;
    }
    if (currentPath.startsWith('/blog/')) {
      const idOrSlug = currentPath.replace('/blog/', '');
      return <BlogDetailPage idOrSlug={idOrSlug} navigate={navigate} />;
    }

    // 8. About & Contact
    if (currentPath === '/about') {
      return <AboutPage navigate={navigate} />;
    }
    if (currentPath === '/contact') {
      return <ContactPage navigate={navigate} />;
    }

    // 9. Admin Login
    if (currentPath === '/admin/login') {
      return <AdminLoginPage navigate={navigate} />;
    }

    // 10. Admin Routes (Wrapped in AdminLayout)
    if (currentPath === '/admin' || currentPath === '/admin/dashboard') {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminDashboardPage navigate={navigate} />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/research') {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminResearchListPage navigate={navigate} />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/research/new') {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminResearchBuilderPage id="new" navigate={navigate} />
        </AdminLayout>
      );
    }

    if (currentPath.startsWith('/admin/research/')) {
      const id = currentPath.replace('/admin/research/', '');
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminResearchBuilderPage id={id} navigate={navigate} />
        </AdminLayout>
      );
    }

    if (currentPath.startsWith('/admin/results')) {
      const id = currentPath.replace('/admin/results', '').replace('/', '') || 'proj-aml-cft-rwanda-001';
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminResultsPage id={id} navigate={navigate} />
        </AdminLayout>
      );
    }

    if (currentPath.startsWith('/admin/news')) {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminNewsPage />
        </AdminLayout>
      );
    }

    if (currentPath.startsWith('/admin/blog')) {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminBlogPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/users') {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminUsersPage />
        </AdminLayout>
      );
    }

    if (currentPath === '/admin/settings') {
      return (
        <AdminLayout currentPath={currentPath} navigate={navigate}>
          <AdminSettingsPage />
        </AdminLayout>
      );
    }

    // Default Fallback
    return <HomePage navigate={navigate} />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans selection:bg-stone-200">
      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        navigate={navigate}
      />

      {/* Header (Only on public views) */}
      {!isAdminRoute && (
        <Header
          currentPath={currentPath}
          navigate={navigate}
          onOpenSearch={() => setSearchOpen(true)}
        />
      )}

      {/* Main View */}
      <main className="flex-1">
        {renderContent()}
      </main>

      {/* Footer (Only on public views) */}
      {!isAdminRoute && (
        <Footer navigate={navigate} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
