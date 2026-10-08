/**
 * Comprehensive Data Types for AcuityResearch Platform
 */

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'RESEARCH_EDITOR' | 'CONTENT_EDITOR' | 'ANALYST';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  avatarUrl?: string;
  createdAt: string;
}

export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'single_choice'
  | 'multiple_choice'
  | 'dropdown'
  | 'yes_no'
  | 'rating'
  | 'likert'
  | 'number'
  | 'percentage'
  | 'date'
  | 'email'
  | 'phone'
  | 'age'
  | 'matrix'
  | 'file_upload';

export interface QuestionOption {
  id: string;
  text: string;
  value: string;
  order: number;
  isOther?: boolean;
}

export interface QuestionLogic {
  id: string;
  sourceQuestionId: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'is_empty' | 'is_not_empty';
  value: string;
  action: 'show' | 'skip';
  targetQuestionId: string;
}

export interface QuestionValidation {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  customMessage?: string;
}

export interface ResearchQuestion {
  id: string;
  researchId: string;
  sectionId: string;
  text: string;
  description?: string;
  type: QuestionType;
  required: boolean;
  active: boolean;
  order: number;
  options?: QuestionOption[];
  matrixRows?: string[];
  matrixColumns?: string[];
  validation?: QuestionValidation;
  logic?: QuestionLogic[];
}

export interface ResearchSection {
  id: string;
  researchId: string;
  title: string;
  description?: string;
  order: number;
}

export type ResearchStatus = 'DRAFT' | 'PUBLISHED' | 'CLOSED' | 'ARCHIVED';
export type ResearchAccess = 'PUBLIC' | 'ANONYMOUS' | 'REQUIRE_EMAIL' | 'REQUIRE_ACCOUNT' | 'INVITATION_ONLY';

export interface ResearchProject {
  id: string;
  title: string;
  slug: string;
  category: string;
  shortDescription: string;
  description: string;
  purpose: string;
  background: string;
  targetAudience: string;
  estimatedTime: string; // e.g. "8–10 minutes"
  confidentialityStatement: string;
  dataUseStatement: string;
  researcherName: string;
  researcherRole: string;
  researcherInstitution: string;
  researcherImage?: string;
  requiresConsent: boolean;
  consentText: string;
  status: ResearchStatus;
  access: ResearchAccess;
  publishedAt?: string;
  closedAt?: string;
  createdAt: string;
  updatedAt: string;
  // Hydrated sub-records
  sections?: ResearchSection[];
  questions?: ResearchQuestion[];
  responseCount?: number;
}

export interface ResponseAnswer {
  questionId: string;
  value: any; // string | string[] | Record<string, string> | number
}

export interface ResearchResponse {
  id: string;
  researchId: string;
  respondentAccountId?: string;
  respondentEmail?: string;
  consentGiven: boolean;
  status: 'COMPLETED' | 'INCOMPLETE';
  submittedAt: string;
  answers: ResponseAnswer[];
  metadata?: {
    durationSeconds?: number;
    completionPercentage?: number;
  };
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  featuredImage: string;
  content: string;
  author: string;
  publishedAt: string;
  category: string;
  tags: string[];
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  author: string;
  authorRole: string;
  authorImage?: string;
  featuredImage: string;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string;
  readingTime: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  entityType: 'RESEARCH' | 'QUESTION' | 'SECTION' | 'RESPONSE' | 'NEWS' | 'BLOG' | 'USER' | 'AUTH';
  entityId?: string;
  details: string;
  timestamp: string;
}

export interface PlatformStats {
  totalResearch: number;
  activeResearch: number;
  closedResearch: number;
  totalResponses: number;
  responsesThisWeek: number;
  responsesThisMonth: number;
  avgCompletionRate: number;
  publishedNews: number;
  publishedBlogs: number;
}
