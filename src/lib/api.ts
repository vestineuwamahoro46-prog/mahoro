import type {
  ResearchProject,
  ResearchSection,
  ResearchQuestion,
  ResearchResponse,
  NewsArticle,
  BlogPost,
  UserProfile,
  PlatformStats
} from '../types/research.js';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('acuity_auth_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP error ${res.status}`);
  }
  return res.json();
}

export const api = {
  // Public
  async getStats(): Promise<PlatformStats> {
    const res = await fetch(`${API_BASE}/stats`);
    return handleResponse<PlatformStats>(res);
  },

  async getResearchList(params?: { status?: string; category?: string; search?: string }): Promise<ResearchProject[]> {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.category) query.set('category', params.category);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/research?${query.toString()}`);
    return handleResponse<ResearchProject[]>(res);
  },

  async getResearchById(idOrSlug: string): Promise<ResearchProject> {
    const res = await fetch(`${API_BASE}/research/${idOrSlug}`);
    return handleResponse<ResearchProject>(res);
  },

  async submitSurveyResponse(projectId: string, data: {
    consentGiven: boolean;
    answers: Array<{ questionId: string; value: any }>;
    durationSeconds?: number;
    respondentEmail?: string;
  }): Promise<{ success: boolean; responseId: string; message: string }> {
    const res = await fetch(`${API_BASE}/research/${projectId}/responses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; responseId: string; message: string }>(res);
  },

  async getNewsList(): Promise<NewsArticle[]> {
    const res = await fetch(`${API_BASE}/news`);
    return handleResponse<NewsArticle[]>(res);
  },

  async getNewsById(idOrSlug: string): Promise<NewsArticle> {
    const res = await fetch(`${API_BASE}/news/${idOrSlug}`);
    return handleResponse<NewsArticle>(res);
  },

  async getBlogList(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/blog`);
    return handleResponse<BlogPost[]>(res);
  },

  async getBlogById(idOrSlug: string): Promise<BlogPost> {
    const res = await fetch(`${API_BASE}/blog/${idOrSlug}`);
    return handleResponse<BlogPost>(res);
  },

  async globalSearch(q: string) {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(q)}`);
    return handleResponse<{ research: ResearchProject[]; news: NewsArticle[]; blog: BlogPost[] }>(res);
  },

  async submitContact(data: { name: string; email: string; subject: string; message: string; organization?: string }) {
    const res = await fetch(`${API_BASE}/contact`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },

  // Auth
  async login(email: string): Promise<{ user: UserProfile; token: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await handleResponse<{ user: UserProfile; token: string }>(res);
    localStorage.setItem('acuity_auth_token', data.token);
    localStorage.setItem('acuity_auth_user', JSON.stringify(data.user));
    return data;
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const token = localStorage.getItem('acuity_auth_token');
    if (!token) return null;
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader(),
    });
    if (!res.ok) {
      localStorage.removeItem('acuity_auth_token');
      localStorage.removeItem('acuity_auth_user');
      return null;
    }
    const data = await res.json();
    return data.user;
  },

  logout() {
    localStorage.removeItem('acuity_auth_token');
    localStorage.removeItem('acuity_auth_user');
  },

  // Admin
  async getAdminDashboard() {
    const res = await fetch(`${API_BASE}/admin/dashboard`, {
      headers: getAuthHeader(),
    });
    return handleResponse<{ stats: PlatformStats; auditLogs: any[]; recentResearch: ResearchProject[] }>(res);
  },

  async getAdminResearch(params?: { status?: string; search?: string }) {
    const query = new URLSearchParams();
    if (params?.status) query.set('status', params.status);
    if (params?.search) query.set('search', params.search);
    const res = await fetch(`${API_BASE}/admin/research?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ResearchProject[]>(res);
  },

  async createResearch(data: Partial<ResearchProject>): Promise<ResearchProject> {
    const res = await fetch(`${API_BASE}/admin/research`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResearchProject>(res);
  },

  async updateResearch(id: string, data: Partial<ResearchProject>): Promise<ResearchProject> {
    const res = await fetch(`${API_BASE}/admin/research/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResearchProject>(res);
  },

  async deleteResearch(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/research/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res).then((r) => r.success);
  },

  async duplicateResearch(id: string): Promise<ResearchProject> {
    const res = await fetch(`${API_BASE}/admin/research/${id}/duplicate`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<ResearchProject>(res);
  },

  async setResearchStatus(id: string, status: string): Promise<ResearchProject> {
    const res = await fetch(`${API_BASE}/admin/research/${id}/status`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return handleResponse<ResearchProject>(res);
  },

  // Admin Builder: Sections & Questions
  async addSection(projectId: string, data: { title: string; description?: string }): Promise<ResearchSection> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/sections`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResearchSection>(res);
  },

  async updateSection(projectId: string, secId: string, data: { title?: string; description?: string }): Promise<ResearchSection> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/sections/${secId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResearchSection>(res);
  },

  async deleteSection(projectId: string, secId: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/sections/${secId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async addQuestion(projectId: string, data: any): Promise<ResearchQuestion> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResearchQuestion>(res);
  },

  async updateQuestion(projectId: string, qId: string, data: any): Promise<ResearchQuestion> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/questions/${qId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<ResearchQuestion>(res);
  },

  async duplicateQuestion(projectId: string, qId: string): Promise<ResearchQuestion> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/questions/${qId}/duplicate`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<ResearchQuestion>(res);
  },

  async deleteQuestion(projectId: string, qId: string) {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/questions/${qId}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res);
  },

  async reorderQuestions(projectId: string, questionIds: string[]) {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/reorder`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ questionIds }),
    });
    return handleResponse<{ success: boolean }>(res);
  },

  // Results & Analytics
  async getResults(projectId: string, filters?: { institutionCategory?: string; experience?: string; province?: string }) {
    const query = new URLSearchParams();
    if (filters?.institutionCategory) query.set('institutionCategory', filters.institutionCategory);
    if (filters?.experience) query.set('experience', filters.experience);
    if (filters?.province) query.set('province', filters.province);
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/results?${query.toString()}`, {
      headers: getAuthHeader(),
    });
    return handleResponse<any>(res);
  },

  async getResponses(projectId: string): Promise<ResearchResponse[]> {
    const res = await fetch(`${API_BASE}/admin/research/${projectId}/responses`, {
      headers: getAuthHeader(),
    });
    return handleResponse<ResearchResponse[]>(res);
  },

  getExportUrl(projectId: string): string {
    return `${API_BASE}/admin/research/${projectId}/export`;
  },

  // News Admin
  async getAdminNews(): Promise<NewsArticle[]> {
    const res = await fetch(`${API_BASE}/admin/news`, {
      headers: getAuthHeader(),
    });
    return handleResponse<NewsArticle[]>(res);
  },

  async saveNews(data: Partial<NewsArticle>, id?: string): Promise<NewsArticle> {
    const url = id ? `${API_BASE}/admin/news/${id}` : `${API_BASE}/admin/news`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<NewsArticle>(res);
  },

  async deleteNews(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/news/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res).then((r) => r.success);
  },

  // Blog Admin
  async getAdminBlog(): Promise<BlogPost[]> {
    const res = await fetch(`${API_BASE}/admin/blog`, {
      headers: getAuthHeader(),
    });
    return handleResponse<BlogPost[]>(res);
  },

  async saveBlog(data: Partial<BlogPost>, id?: string): Promise<BlogPost> {
    const url = id ? `${API_BASE}/admin/blog/${id}` : `${API_BASE}/admin/blog`;
    const method = id ? 'PUT' : 'POST';
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data),
    });
    return handleResponse<BlogPost>(res);
  },

  async deleteBlog(id: string): Promise<boolean> {
    const res = await fetch(`${API_BASE}/admin/blog/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean }>(res).then((r) => r.success);
  },

  // Users Admin
  async getUsers(): Promise<UserProfile[]> {
    const res = await fetch(`${API_BASE}/admin/users`, {
      headers: getAuthHeader(),
    });
    return handleResponse<UserProfile[]>(res);
  },

  async updateUserRole(userId: string, role: string): Promise<UserProfile> {
    const res = await fetch(`${API_BASE}/admin/users/${userId}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ role }),
    });
    return handleResponse<UserProfile>(res);
  },

  async resetSeedData(): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/admin/seed/reset`, {
      method: 'POST',
      headers: getAuthHeader(),
    });
    return handleResponse<{ success: boolean; message: string }>(res);
  },
};
