import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { db } from './server/db.js';
import type { UserProfile } from './src/types/research.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Simple Bearer token / auth header resolution
function resolveUser(req: Request): UserProfile | null {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;

  // Format: "Bearer user-cesar-001" or email
  const token = authHeader.replace(/^Bearer\s+/i, '').trim();
  const users = db.getUsers();

  const byId = users.find((u) => u.id === token);
  if (byId) return byId;

  const byEmail = users.find((u) => u.email.toLowerCase() === token.toLowerCase());
  if (byEmail) return byEmail;

  return null;
}

function requireAuth(req: Request, res: Response, next: NextFunction) {
  const user = resolveUser(req);
  if (!user) {
    res.status(401).json({ error: 'Unauthorized. Please sign in.' });
    return;
  }
  (req as any).user = user;
  next();
}

function requireRoles(...allowedRoles: Array<UserProfile['role']>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = (req as any).user as UserProfile;
    if (!user) {
      res.status(401).json({ error: 'Authentication required.' });
      return;
    }
    if (user.role === 'SUPER_ADMIN' || allowedRoles.includes(user.role)) {
      next();
      return;
    }
    res.status(403).json({ error: `Forbidden: role ${user.role} lacks permission for this action.` });
  };
}

// ==========================================
// PUBLIC API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.get('/api/stats', (req, res) => {
  res.json(db.getStats());
});

app.get('/api/research', (req, res) => {
  const { status, category, search } = req.query as Record<string, string>;
  const list = db.getProjects({
    status: status || 'PUBLISHED',
    category,
    search,
  });
  res.json(list);
});

app.get('/api/research/:idOrSlug', (req, res) => {
  const project = db.getProjectById(req.params.idOrSlug, true);
  if (!project) {
    res.status(404).json({ error: 'Research project not found.' });
    return;
  }
  res.json(project);
});

app.post('/api/research/:id/consent', (req, res) => {
  res.json({ success: true, timestamp: new Date().toISOString() });
});

app.post('/api/research/:id/responses', (req, res) => {
  try {
    const { consentGiven, answers, durationSeconds, respondentEmail } = req.body;
    if (!consentGiven) {
      res.status(400).json({ error: 'Informed consent is required to participate in this study.' });
      return;
    }
    const response = db.submitResponse(req.params.id, {
      consentGiven: true,
      answers: answers || [],
      durationSeconds,
      respondentEmail,
    });
    res.status(201).json({
      success: true,
      responseId: response.id,
      message: 'Your research questionnaire response has been safely submitted. Thank you for contributing to empirical evidence in Rwanda.',
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message || 'Failed to submit response.' });
  }
});

app.get('/api/news', (req, res) => {
  res.json(db.getNews(true));
});

app.get('/api/news/:idOrSlug', (req, res) => {
  const article = db.getNewsById(req.params.idOrSlug);
  if (!article) {
    res.status(404).json({ error: 'News article not found.' });
    return;
  }
  res.json(article);
});

app.get('/api/blog', (req, res) => {
  res.json(db.getBlog(true));
});

app.get('/api/blog/:idOrSlug', (req, res) => {
  const post = db.getBlogById(req.params.idOrSlug);
  if (!post) {
    res.status(404).json({ error: 'Blog post not found.' });
    return;
  }
  res.json(post);
});

app.get('/api/search', (req, res) => {
  const q = String(req.query.q || '');
  res.json(db.globalSearch(q));
});

app.post('/api/contact', (req, res) => {
  const { name, email, subject, message, organization } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Name, email, and message are required.' });
    return;
  }
  res.json({
    success: true,
    message: 'Thank you for reaching out to AcuityResearch. A member of our research directorate will contact you shortly.',
  });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    res.status(400).json({ error: 'Email address is required.' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    res.status(401).json({ error: 'Invalid administrator credentials.' });
    return;
  }

  // Demo password check: any demo password or 'password123' accepted
  res.json({
    user,
    token: user.id,
  });
});

app.get('/api/auth/me', (req, res) => {
  const user = resolveUser(req);
  if (!user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }
  res.json({ user });
});

// ==========================================
// ADMIN MANAGEMENT ROUTES (Protected by RBAC)
// ==========================================

app.get('/api/admin/dashboard', requireAuth, (req, res) => {
  const stats = db.getStats();
  const auditLogs = db.getAuditLogs(10);
  const recentResearch = db.getProjects().slice(0, 5);
  res.json({
    stats,
    auditLogs,
    recentResearch,
  });
});

app.get('/api/admin/research', requireAuth, (req, res) => {
  const { status, category, search } = req.query as Record<string, string>;
  const list = db.getProjects({
    status: status || 'ALL',
    category,
    search,
  });
  res.json(list);
});

app.post('/api/admin/research', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const project = db.createProject(req.body, user);
  res.status(201).json(project);
});

app.put('/api/admin/research/:id', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const updated = db.updateProject(req.params.id, req.body, user);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/research/:id', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), (req, res) => {
  const user = (req as any).user;
  const ok = db.deleteProject(req.params.id, user);
  if (!ok) {
    res.status(404).json({ error: 'Project not found.' });
    return;
  }
  res.json({ success: true, message: 'Research project deleted.' });
});

app.post('/api/admin/research/:id/duplicate', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const duplicated = db.duplicateProject(req.params.id, user);
    res.status(201).json(duplicated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/research/:id/status', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  try {
    const { status } = req.body;
    const user = (req as any).user;
    const updated = db.updateProject(req.params.id, { status }, user);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Sections
app.post('/api/admin/research/:id/sections', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const sec = db.addSection(req.params.id, req.body, user);
  res.status(201).json(sec);
});

app.put('/api/admin/research/:id/sections/:secId', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const sec = db.updateSection(req.params.secId, req.body, user);
    res.json(sec);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/research/:id/sections/:secId', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const ok = db.deleteSection(req.params.secId, user);
  res.json({ success: ok });
});

// Questions
app.post('/api/admin/research/:id/questions', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const q = db.addQuestion(req.params.id, req.body, user);
  res.status(201).json(q);
});

app.put('/api/admin/research/:id/questions/:qId', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const q = db.updateQuestion(req.params.qId, req.body, user);
    res.json(q);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/admin/research/:id/questions/:qId/duplicate', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const q = db.duplicateQuestion(req.params.qId, user);
    res.status(201).json(q);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/research/:id/questions/:qId', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const ok = db.deleteQuestion(req.params.qId, user);
  res.json({ success: ok });
});

app.post('/api/admin/research/:id/reorder', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'RESEARCH_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const { questionIds } = req.body;
  const ok = db.reorderQuestions(req.params.id, questionIds || [], user);
  res.json({ success: ok });
});

// Results & Analytics
app.get('/api/admin/research/:id/results', requireAuth, (req, res) => {
  try {
    const { institutionCategory, experience, province } = req.query as Record<string, string>;
    const analytics = db.getResultsAnalytics(req.params.id, {
      institutionCategory,
      experience,
      province,
    });
    res.json(analytics);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/admin/research/:id/responses', requireAuth, (req, res) => {
  res.json(db.getResponses(req.params.id));
});

app.get('/api/admin/research/:id/export', requireAuth, (req, res) => {
  try {
    const csvData = db.exportCsv(req.params.id);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="research-${req.params.id}-responses.csv"`);
    res.send(csvData);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// News Admin
app.get('/api/admin/news', requireAuth, (req, res) => {
  res.json(db.getNews(false));
});

app.post('/api/admin/news', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const item = db.createNews(req.body, user);
  res.status(201).json(item);
});

app.put('/api/admin/news/:id', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const item = db.updateNews(req.params.id, req.body, user);
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/news/:id', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const ok = db.deleteNews(req.params.id, user);
  res.json({ success: ok });
});

// Blog Admin
app.get('/api/admin/blog', requireAuth, (req, res) => {
  res.json(db.getBlog(false));
});

app.post('/api/admin/blog', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const item = db.createBlog(req.body, user);
  res.status(201).json(item);
});

app.put('/api/admin/blog/:id', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR'), (req, res) => {
  try {
    const user = (req as any).user;
    const item = db.updateBlog(req.params.id, req.body, user);
    res.json(item);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/admin/blog/:id', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN', 'CONTENT_EDITOR'), (req, res) => {
  const user = (req as any).user;
  const ok = db.deleteBlog(req.params.id, user);
  res.json({ success: ok });
});

// Users Admin
app.get('/api/admin/users', requireAuth, requireRoles('SUPER_ADMIN', 'ADMIN'), (req, res) => {
  res.json(db.getUsers());
});

app.put('/api/admin/users/:id/role', requireAuth, requireRoles('SUPER_ADMIN'), (req, res) => {
  try {
    const user = (req as any).user;
    const { role } = req.body;
    const updated = db.updateUserRole(req.params.id, role, user);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// Reset seed data
app.post('/api/admin/seed/reset', requireAuth, requireRoles('SUPER_ADMIN'), (req, res) => {
  res.json(db.resetSeed());
});

// ==========================================
// VITE OR STATIC FRONTEND SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  } else {
    // Development mode with Vite middleware mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[AcuityResearch Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[AcuityResearch Server] Startup error:', err);
  process.exit(1);
});
