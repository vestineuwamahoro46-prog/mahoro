import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type {
  ResearchProject,
  ResearchSection,
  ResearchQuestion,
  ResearchResponse,
  NewsArticle,
  BlogPost,
  UserProfile,
  AuditLog,
  PlatformStats
} from '../src/types/research.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'database.json');

interface DatabaseSchema {
  users: UserProfile[];
  projects: ResearchProject[];
  sections: ResearchSection[];
  questions: ResearchQuestion[];
  responses: ResearchResponse[];
  news: NewsArticle[];
  blog: BlogPost[];
  auditLogs: AuditLog[];
}

function ensureDirectoryExists(filePath: string) {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
  }
}

// Generate high quality seed data
function getInitialSeedData(): DatabaseSchema {
  const project1Id = 'proj-aml-cft-rwanda-001';
  const project2Id = 'proj-green-finance-002';
  const project3Id = 'proj-digital-payments-003';

  const cesarUser: UserProfile = {
    id: 'user-cesar-001',
    name: 'MAHORO Cesar',
    email: 'superadmin@acuityresearch.rw',
    role: 'SUPER_ADMIN',
    department: 'Financial Crime & Regulatory Intelligence',
    avatarUrl: '/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg',
    createdAt: '2026-01-15T08:00:00Z',
  };

  const users: UserProfile[] = [
    cesarUser,
    {
      id: 'user-admin-002',
      name: 'Dr. Aline Uwera',
      email: 'admin@acuityresearch.rw',
      role: 'ADMIN',
      department: 'Institutional Governance',
      createdAt: '2026-01-20T09:00:00Z',
    },
    {
      id: 'user-editor-003',
      name: 'Jean-Paul Mugisha',
      email: 'researcher@acuityresearch.rw',
      role: 'RESEARCH_EDITOR',
      department: 'Empirical Research Methods',
      createdAt: '2026-02-01T10:00:00Z',
    },
    {
      id: 'user-content-004',
      name: 'Claire Mukamana',
      email: 'editor@acuityresearch.rw',
      role: 'CONTENT_EDITOR',
      department: 'Editorial & Publications',
      createdAt: '2026-02-05T11:00:00Z',
    },
    {
      id: 'user-analyst-005',
      name: 'David Habimana',
      email: 'analyst@acuityresearch.rw',
      role: 'ANALYST',
      department: 'Quantitative Analytics & Forensics',
      createdAt: '2026-02-10T14:00:00Z',
    },
  ];

  // Project 1: AML/CFT Rwanda
  const project1: ResearchProject = {
    id: project1Id,
    title: 'Analysis of Strategies for Investigating, Prosecuting Money Laundering, and Terrorist Financing Offences in Rwanda',
    slug: 'investigating-prosecuting-money-laundering-terrorist-financing-rwanda',
    category: 'Financial Crime & Legal Policy',
    shortDescription: 'Structured empirical questionnaire examining investigation, prosecution, institutional synergy, and regulatory supervision relating to ML/TF offences in Rwanda.',
    description: 'A comprehensive empirical study assessing institutional capacity, inter-agency coordination between the Financial Intelligence Centre (FIC), Rwanda Investigation Bureau (RIB), and National Public Prosecution Authority (NPPA), supervisory oversight by the National Bank of Rwanda (BNR) and Rwanda Revenue Authority (RRA), and private sector reporting entity compliance.',
    purpose: 'To critically evaluate the effectiveness of AML/CFT enforcement strategies, identify evidentiary and judicial bottlenecks, assess technological and human capacity constraints, and propose targeted policy and legal reforms aligned with FATF standards.',
    background: 'Rwanda has enacted modern legal frameworks (Law No. 75/2019 on AML/CFT) and established robust specialized agencies. However, emerging challenges such as cross-border digital financial flows, Virtual Asset Service Providers (VASPs), trade-based money laundering, and complex corporate beneficial ownership structures necessitate empirical evaluation of investigative and prosecutorial outcomes.',
    targetAudience: 'AML/CFT Compliance Officers and MLROs from Commercial Banks, Microfinance Institutions, Insurance and Capital Market intermediaries, Licensed VASPs, and Regulatory Supervisors from BNR and RRA.',
    estimatedTime: '8–10 minutes',
    confidentialityStatement: 'All responses are strictly confidential. Data will be aggregated anonymously for scientific and policy analysis. No institutional or individual respondent identities will be disclosed in publications.',
    dataUseStatement: 'Collected data will inform academic policy reports, symposium deliberations, and recommendations to Rwandan supervisory and law enforcement authorities.',
    researcherName: 'MAHORO Cesar',
    researcherRole: 'Lead Investigator & AML/CFT Compliance Specialist',
    researcherInstitution: 'Center for Financial Integrity & Legal Policy Studies, Kigali',
    researcherImage: '/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg',
    requiresConsent: true,
    consentText: 'I understand the purpose of this research and voluntarily agree to participate. I understand that my responses will remain confidential and be used exclusively for research and policy analysis.',
    status: 'PUBLISHED',
    access: 'ANONYMOUS',
    publishedAt: '2026-03-01T08:00:00Z',
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-03-10T08:00:00Z',
  };

  // Project 2: Green Finance
  const project2: ResearchProject = {
    id: project2Id,
    title: 'Assessment of Green Finance Adoption and ESG Risk Governance in Rwanda\'s Banking Sector',
    slug: 'green-finance-adoption-esg-governance-rwanda',
    category: 'Sustainable Finance',
    shortDescription: 'Evaluating climate risk disclosure, green taxonomy alignment, and sustainable lending practices among Rwandan financial institutions.',
    description: 'An empirical survey investigating commercial bank integration of Environmental, Social, and Governance (ESG) guidelines established by the National Bank of Rwanda (BNR) and international climate finance facilities.',
    purpose: 'Assess the maturity of green finance instruments, identify capital allocation barriers, and evaluate portfolio climate risk stress-testing.',
    background: 'With Rwanda\'s green taxonomy and NDC climate commitments, domestic financial institutions are transitioning toward low-carbon investment frameworks.',
    targetAudience: 'Chief Risk Officers, Credit Committee Chairs, and Sustainability Managers in Rwandan commercial and development banks.',
    estimatedTime: '6–8 minutes',
    confidentialityStatement: 'Strict confidentiality applies. Responses are analyzed in aggregated statistical formats.',
    dataUseStatement: 'Data informs academic publications and policy dialogues on sustainable banking.',
    researcherName: 'Dr. Eric Karenzi',
    researcherRole: 'Senior Fellow in Sustainable Economics',
    researcherInstitution: 'Rwanda Institute of Development & Financial Policy',
    requiresConsent: true,
    consentText: 'I agree to participate in this study on green finance governance.',
    status: 'PUBLISHED',
    access: 'PUBLIC',
    publishedAt: '2026-02-20T08:00:00Z',
    createdAt: '2026-02-10T08:00:00Z',
    updatedAt: '2026-02-20T08:00:00Z',
  };

  // Project 3: Digital Payments
  const project3: ResearchProject = {
    id: project3Id,
    title: 'National Survey on Digital Payment Interoperability, Financial Inclusion, and Consumer Trust in Rwanda',
    slug: 'digital-payment-interoperability-financial-inclusion-rwanda',
    category: 'Financial Technology & Inclusion',
    shortDescription: 'Exploring consumer protection, transaction cost transparency, and seamless cross-network digital wallet interoperability.',
    description: 'Investigating merchant and user experiences across mobile money, instant payment switches, and payment service providers in urban and rural Rwanda.',
    purpose: 'To benchmark consumer adoption, detect fraud exposure patterns, and measure satisfaction with instant payment dispute resolution.',
    background: 'Digital payments have expanded dramatically across Rwanda; this study analyzes user friction and systemic reliability.',
    targetAudience: 'Digital financial service consumers, retail merchants, and fintech product leads across Rwanda.',
    estimatedTime: '5–7 minutes',
    confidentialityStatement: 'Data is protected and completely anonymized.',
    dataUseStatement: 'Results will be presented to fintech sector working groups and consumer protection committees.',
    researcherName: 'Diane Umutoni',
    researcherRole: 'Fintech Inclusion Researcher',
    researcherInstitution: 'Center for Digital Transformation & Economics, Kigali',
    requiresConsent: true,
    consentText: 'I consent to participating in this consumer survey.',
    status: 'PUBLISHED',
    access: 'PUBLIC',
    publishedAt: '2026-02-25T08:00:00Z',
    createdAt: '2026-02-15T08:00:00Z',
    updatedAt: '2026-02-25T08:00:00Z',
  };

  // Sections for Project 1 (AML/CFT)
  const sections: ResearchSection[] = [
    {
      id: 'sec-aml-1',
      researchId: project1Id,
      title: 'Respondent & Institutional Demographics',
      description: 'Baseline professional profile and institutional background of the respondent.',
      order: 1,
    },
    {
      id: 'sec-aml-2',
      researchId: project1Id,
      title: 'Institutional Framework & Risk Assessment',
      description: 'Internal compliance programs, automated transaction monitoring, and beneficial ownership identification.',
      order: 2,
    },
    {
      id: 'sec-aml-3',
      researchId: project1Id,
      title: 'Investigation Capacity & Law Enforcement Synergy',
      description: 'Inter-agency collaboration between reporting entities, FIU (Financial Intelligence Centre), and RIB.',
      order: 3,
    },
    {
      id: 'sec-aml-4',
      researchId: project1Id,
      title: 'Prosecution & Judicial Outcomes',
      description: 'Evidentiary sufficiency, predicate offence establishment, and asset recovery mechanisms.',
      order: 4,
    },
    {
      id: 'sec-aml-5',
      researchId: project1Id,
      title: 'Regulatory Supervision & Emerging Technologies',
      description: 'Supervisory depth by BNR/RRA, virtual asset service provider (VASP) risks, and FATF Travel Rule.',
      order: 5,
    },
    {
      id: 'sec-aml-6',
      researchId: project1Id,
      title: 'Strategic Recommendations & Reform Priorities',
      description: 'Priority policy interventions and systemic enhancements for Rwanda\'s AML/CFT regime.',
      order: 6,
    },
    // Project 2 section
    {
      id: 'sec-green-1',
      researchId: project2Id,
      title: 'ESG Governance & Institutional Capacity',
      description: 'Board-level oversight and climate risk metrics in Rwandan lending institutions.',
      order: 1,
    },
    // Project 3 section
    {
      id: 'sec-digital-1',
      researchId: project3Id,
      title: 'User Experience & Consumer Protection',
      description: 'Everyday adoption metrics and transaction safety across mobile payment switches.',
      order: 1,
    },
  ];

  // Questions for Project 1 (AML/CFT)
  const questions: ResearchQuestion[] = [
    // --- SECTION 1: Respondent Metadata ---
    {
      id: 'q-aml-01',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Respondent Category',
      description: 'Please indicate your primary operational mandate in relation to AML/CFT.',
      type: 'single_choice',
      required: true,
      active: true,
      order: 1,
      options: [
        { id: 'opt-01-1', text: 'Compliance Officer / MLRO (Reporting Entity)', value: 'reporting_entity', order: 1 },
        { id: 'opt-01-2', text: 'Regulatory Supervisor (BNR/RRA)', value: 'regulator', order: 2 },
        { id: 'opt-01-3', text: 'Other AML/CFT-related role', value: 'other', order: 3 },
      ],
    },
    {
      id: 'q-aml-02',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Institution / Agency Category',
      description: 'Select the primary sector your organization belongs to.',
      type: 'single_choice',
      required: true,
      active: true,
      order: 2,
      options: [
        { id: 'opt-02-1', text: 'Commercial Bank', value: 'commercial_bank', order: 1 },
        { id: 'opt-02-2', text: 'Microfinance Institution', value: 'microfinance', order: 2 },
        { id: 'opt-02-3', text: 'Insurance / Capital Market', value: 'insurance_capital', order: 3 },
        { id: 'opt-02-4', text: 'Licensed VASP (Virtual Asset Service Provider)', value: 'vasp', order: 4 },
        { id: 'opt-02-5', text: 'National Bank of Rwanda (BNR)', value: 'bnr', order: 5 },
        { id: 'opt-02-6', text: 'Rwanda Revenue Authority (RRA)', value: 'rra', order: 6 },
        { id: 'opt-02-7', text: 'Other Reporting Entity', value: 'other', order: 7 },
      ],
    },
    {
      id: 'q-aml-03',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Position / Job Title',
      description: 'Your formal title within the compliance or regulatory hierarchy.',
      type: 'single_choice',
      required: true,
      active: true,
      order: 3,
      options: [
        { id: 'opt-03-1', text: 'Compliance Officer', value: 'compliance_officer', order: 1 },
        { id: 'opt-03-2', text: 'MLRO / AML Manager', value: 'mlro_manager', order: 2 },
        { id: 'opt-03-3', text: 'Risk Officer', value: 'risk_officer', order: 3 },
        { id: 'opt-03-4', text: 'Internal Auditor', value: 'internal_auditor', order: 4 },
        { id: 'opt-03-5', text: 'Regulatory Supervisor / Examiner', value: 'supervisor_examiner', order: 5 },
        { id: 'opt-03-6', text: 'Legal Counsel / Forensics', value: 'legal_forensics', order: 6 },
      ],
    },
    {
      id: 'q-aml-04',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Gender',
      type: 'single_choice',
      required: true,
      active: true,
      order: 4,
      options: [
        { id: 'opt-04-1', text: 'Male', value: 'male', order: 1 },
        { id: 'opt-04-2', text: 'Female', value: 'female', order: 2 },
        { id: 'opt-04-3', text: 'Prefer not to say', value: 'prefer_not', order: 3 },
      ],
    },
    {
      id: 'q-aml-05',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Age Bracket',
      type: 'single_choice',
      required: true,
      active: true,
      order: 5,
      options: [
        { id: 'opt-05-1', text: 'Under 25', value: 'under_25', order: 1 },
        { id: 'opt-05-2', text: '25–34', value: '25_34', order: 2 },
        { id: 'opt-05-3', text: '35–44', value: '35_44', order: 3 },
        { id: 'opt-05-4', text: '45–54', value: '45_54', order: 4 },
        { id: 'opt-05-5', text: '55 and above', value: '55_above', order: 5 },
      ],
    },
    {
      id: 'q-aml-06',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Highest Level of Education',
      type: 'single_choice',
      required: true,
      active: true,
      order: 6,
      options: [
        { id: 'opt-06-1', text: 'Diploma / A-Level', value: 'diploma', order: 1 },
        { id: 'opt-06-2', text: "Bachelor's Degree", value: 'bachelor', order: 2 },
        { id: 'opt-06-3', text: "Master's Degree", value: 'master', order: 3 },
        { id: 'opt-06-4', text: 'PhD', value: 'phd', order: 4 },
        { id: 'opt-06-5', text: 'Professional certification only (no degree)', value: 'cert_only', order: 5 },
      ],
    },
    {
      id: 'q-aml-07',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Professional AML/CFT Certification',
      description: 'Accredited international or local financial crime certifications held.',
      type: 'multiple_choice',
      required: true,
      active: true,
      order: 7,
      options: [
        { id: 'opt-07-1', text: 'CAMS (Certified Anti-Money Laundering Specialist)', value: 'cams', order: 1 },
        { id: 'opt-07-2', text: 'CFE (Certified Fraud Examiner)', value: 'cfe', order: 2 },
        { id: 'opt-07-3', text: 'ICA Diploma / Certificate in AML', value: 'ica', order: 3 },
        { id: 'opt-07-4', text: 'None', value: 'none', order: 4 },
        { id: 'opt-07-5', text: 'Other professional credential', value: 'other', order: 5, isOther: true },
      ],
    },
    {
      id: 'q-aml-08',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Years of AML/CFT Experience',
      type: 'single_choice',
      required: true,
      active: true,
      order: 8,
      options: [
        { id: 'opt-08-1', text: 'Less than 2 years', value: 'under_2', order: 1 },
        { id: 'opt-08-2', text: '2–5 years', value: '2_5', order: 2 },
        { id: 'opt-08-3', text: '5–10 years', value: '5_10', order: 3 },
        { id: 'opt-08-4', text: 'More than 10 years', value: 'over_10', order: 4 },
      ],
    },
    {
      id: 'q-aml-09',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Province / Region in Rwanda',
      description: 'Primary location of institutional operations or supervisory posting.',
      type: 'single_choice',
      required: true,
      active: true,
      order: 9,
      options: [
        { id: 'opt-09-1', text: 'Kigali City', value: 'kigali', order: 1 },
        { id: 'opt-09-2', text: 'Southern Province', value: 'southern', order: 2 },
        { id: 'opt-09-3', text: 'Northern Province', value: 'northern', order: 3 },
        { id: 'opt-09-4', text: 'Eastern Province', value: 'eastern', order: 4 },
        { id: 'opt-09-5', text: 'Western Province', value: 'western', order: 5 },
      ],
    },
    {
      id: 'q-aml-10',
      researchId: project1Id,
      sectionId: 'sec-aml-1',
      text: 'Ownership Structure',
      type: 'single_choice',
      required: true,
      active: true,
      order: 10,
      options: [
        { id: 'opt-10-1', text: 'Domestically owned', value: 'domestic', order: 1 },
        { id: 'opt-10-2', text: 'Foreign owned', value: 'foreign', order: 2 },
        { id: 'opt-10-3', text: 'Public / State owned', value: 'state', order: 3 },
        { id: 'opt-10-4', text: 'Joint venture', value: 'joint_venture', order: 4 },
        { id: 'opt-10-5', text: 'Not applicable (e.g. Regulatory authority)', value: 'na', order: 5 },
      ],
    },

    // --- SECTION 2: Institutional Framework & Risk Assessment ---
    {
      id: 'q-aml-11',
      researchId: project1Id,
      sectionId: 'sec-aml-2',
      text: 'Frequency of AML/CFT Institutional Risk Assessments',
      description: 'How regularly does your institution update its formal institutional ML/TF risk assessment?',
      type: 'single_choice',
      required: true,
      active: true,
      order: 11,
      options: [
        { id: 'opt-11-1', text: 'Annually', value: 'annually', order: 1 },
        { id: 'opt-11-2', text: 'Bi-annually', value: 'bi_annually', order: 2 },
        { id: 'opt-11-3', text: 'Ongoing / Real-time trigger based', value: 'ongoing', order: 3 },
        { id: 'opt-11-4', text: 'Ad-hoc (only upon regulatory request)', value: 'adhoc', order: 4 },
      ],
    },
    {
      id: 'q-aml-12',
      researchId: project1Id,
      sectionId: 'sec-aml-2',
      text: 'Our institution possesses adequate automated transaction monitoring software calibrated to Rwandan AML typology risks.',
      description: 'Rate your level of agreement on a 5-point Likert scale (1 = Strongly Disagree, 5 = Strongly Agree).',
      type: 'likert',
      required: true,
      active: true,
      order: 12,
      logic: [
        // Conditional: Only active if reporting entity or supervisory examiner
        {
          id: 'log-01',
          sourceQuestionId: 'q-aml-01',
          operator: 'not_equals',
          value: 'other',
          action: 'show',
          targetQuestionId: 'q-aml-12',
        },
      ],
    },
    {
      id: 'q-aml-13',
      researchId: project1Id,
      sectionId: 'sec-aml-2',
      text: 'Does your institution apply Enhanced Due Diligence (EDD) for domestic Politically Exposed Persons (PEPs) beyond standard threshold screening?',
      type: 'yes_no',
      required: true,
      active: true,
      order: 13,
    },
    {
      id: 'q-aml-14',
      researchId: project1Id,
      sectionId: 'sec-aml-2',
      text: 'What are the primary operational challenges in verifying Ultimate Beneficial Ownership (UBO) in Rwanda?',
      description: 'Select all that apply based on your compliance operations.',
      type: 'multiple_choice',
      required: true,
      active: true,
      order: 14,
      options: [
        { id: 'opt-14-1', text: 'Complex multi-layered corporate structures', value: 'complex_structures', order: 1 },
        { id: 'opt-14-2', text: 'Delays in accessing the official RDB Beneficial Ownership Register', value: 'rdb_delay', order: 2 },
        { id: 'opt-14-3', text: 'Use of nominee shareholders / informal power-of-attorney arrangements', value: 'nominees', order: 3 },
        { id: 'opt-14-4', text: 'Cross-border foreign parent company verification hurdles', value: 'cross_border', order: 4 },
        { id: 'opt-14-5', text: 'Lack of verified documentary proof from corporate clients', value: 'proof_shortage', order: 5 },
      ],
    },

    // --- SECTION 3: Investigation Capacity & Law Enforcement Synergy ---
    {
      id: 'q-aml-15',
      researchId: project1Id,
      sectionId: 'sec-aml-3',
      text: 'Rate the efficiency of institutional synergy and information sharing between Reporting Entities, the Financial Intelligence Centre (FIC), and Rwanda Investigation Bureau (RIB).',
      description: '1 indicates poor/fragmented coordination; 5 indicates highly cohesive and timely synergy.',
      type: 'rating',
      required: true,
      active: true,
      order: 15,
    },
    {
      id: 'q-aml-16',
      researchId: project1Id,
      sectionId: 'sec-aml-3',
      text: 'What are the main bottlenecks encountered in financial crime evidence collection?',
      description: 'Select up to 3 major obstacles.',
      type: 'multiple_choice',
      required: true,
      active: true,
      order: 16,
      options: [
        { id: 'opt-16-1', text: 'Delays in obtaining inter-agency judicial production orders/warrants', value: 'warrant_delays', order: 1 },
        { id: 'opt-16-2', text: 'Tracing proceeds converted into digital assets / virtual wallets', value: 'vasp_tracing', order: 2 },
        { id: 'opt-16-3', text: 'Shortage of certified forensic accounting investigators', value: 'forensic_shortage', order: 3 },
        { id: 'opt-16-4', text: 'Protracted Mutual Legal Assistance (MLA) requests from foreign jurisdictions', value: 'foreign_mla', order: 4 },
        { id: 'opt-16-5', text: 'Subtle trade-based money laundering (TBML) over/under-invoicing', value: 'tbml', order: 5 },
      ],
    },
    {
      id: 'q-aml-17',
      researchId: project1Id,
      sectionId: 'sec-aml-3',
      text: 'Turnaround time for receiving operational feedback from FIC following a Suspicious Transaction Report (STR) filing:',
      type: 'dropdown',
      required: true,
      active: true,
      order: 17,
      options: [
        { id: 'opt-17-1', text: 'Within 30 days', value: 'under_30d', order: 1 },
        { id: 'opt-17-2', text: '1 to 3 months', value: '1_3m', order: 2 },
        { id: 'opt-17-3', text: '3 to 6 months', value: '3_6m', order: 3 },
        { id: 'opt-17-4', text: 'Feedback rarely or never provided', value: 'rarely', order: 4 },
        { id: 'opt-17-5', text: 'Not applicable (Regulatory supervisor)', value: 'na', order: 5 },
      ],
    },

    // --- SECTION 4: Prosecution & Judicial Outcomes ---
    {
      id: 'q-aml-18',
      researchId: project1Id,
      sectionId: 'sec-aml-4',
      text: 'Rwandan courts and prosecutors demonstrate sufficient specialized expertise to adjudicate complex, multi-tiered money laundering schemes effectively.',
      description: 'Rate your level of agreement (1 = Strongly Disagree, 5 = Strongly Agree).',
      type: 'likert',
      required: true,
      active: true,
      order: 18,
    },
    {
      id: 'q-aml-19',
      researchId: project1Id,
      sectionId: 'sec-aml-4',
      text: 'Are current non-conviction-based asset forfeiture and civil confiscation mechanisms in Rwanda legally sufficient to prevent criminals from retaining illicit gains?',
      type: 'single_choice',
      required: true,
      active: true,
      order: 19,
      options: [
        { id: 'opt-19-1', text: 'Yes, fully sufficient and proactively applied', value: 'yes', order: 1 },
        { id: 'opt-19-2', text: 'Partially sufficient, but hampered by procedural delays', value: 'partially', order: 2 },
        { id: 'opt-19-3', text: 'No, significant legal ambiguities remain', value: 'no', order: 3 },
        { id: 'opt-19-4', text: 'Unsure / Insufficient judicial exposure', value: 'unsure', order: 4 },
      ],
    },
    {
      id: 'q-aml-20',
      researchId: project1Id,
      sectionId: 'sec-aml-4',
      text: 'In your experience, what are the primary legal challenges in proving predicate offences (e.g. corruption, tax evasion, fraud) when prosecuting autonomous money laundering charges?',
      description: 'Provide your qualitative assessment of evidentiary thresholds.',
      type: 'long_text',
      required: false,
      active: true,
      order: 20,
    },

    // --- SECTION 5: Regulatory Supervision & VASPs ---
    {
      id: 'q-aml-21',
      researchId: project1Id,
      sectionId: 'sec-aml-5',
      text: 'BNR and RRA supervisory examinations provide actionable, risk-proportionate guidance rather than purely punitive check-box compliance.',
      description: 'Rate on a 5-point Likert scale (1 = Strongly Disagree, 5 = Strongly Agree).',
      type: 'likert',
      required: true,
      active: true,
      order: 21,
    },
    {
      id: 'q-aml-22',
      researchId: project1Id,
      sectionId: 'sec-aml-5',
      text: 'How would you rate the current level of money laundering and terrorist financing risk associated with unlicensed cross-border cryptocurrency and virtual asset peer-to-peer (P2P) trading in Rwanda?',
      description: '1 = Very Low Risk, 5 = Severe / Critical Risk.',
      type: 'rating',
      required: true,
      active: true,
      order: 22,
    },
    {
      id: 'q-aml-23',
      researchId: project1Id,
      sectionId: 'sec-aml-5',
      text: 'Current readiness of Rwandan reporting institutions to enforce the FATF Recommendation 16 "Travel Rule" on virtual asset transfers:',
      type: 'dropdown',
      required: true,
      active: true,
      order: 23,
      options: [
        { id: 'opt-23-1', text: 'Fully compliant with automated counterparty messaging protocol', value: 'fully_compliant', order: 1 },
        { id: 'opt-23-2', text: 'Partially compliant / pilot phase testing', value: 'partially_compliant', order: 2 },
        { id: 'opt-23-3', text: 'Planning implementation / evaluating vendor solutions', value: 'planning', order: 3 },
        { id: 'opt-23-4', text: 'Not started / Lack technical guidance', value: 'not_started', order: 4 },
      ],
    },

    // --- SECTION 6: Strategic Recommendations ---
    {
      id: 'q-aml-24',
      researchId: project1Id,
      sectionId: 'sec-aml-6',
      text: 'Which single strategic reform should Rwanda prioritize to maximize the disruption of money laundering networks?',
      description: 'Select the most impactful priority reform.',
      type: 'single_choice',
      required: true,
      active: true,
      order: 24,
      options: [
        { id: 'opt-24-1', text: 'Establishment of a real-time, automated inter-agency financial intelligence data exchange hub', value: 'automated_data_hub', order: 1 },
        { id: 'opt-24-2', text: 'Mandatory accredited continuous professional education (CAMS/CFE) for all financial investigators & compliance heads', value: 'accredited_training', order: 2 },
        { id: 'opt-24-3', text: 'Creation of a specialized Fast-Track Economic Crimes and Asset Recovery Court Bench', value: 'specialized_court', order: 3 },
        { id: 'opt-24-4', text: 'Stricter supervisory sanctions and mandatory public naming of non-compliant reporting entities', value: 'stricter_sanctions', order: 4 },
        { id: 'opt-24-5', text: 'Enactment of enhanced VASP and decentralized finance (DeFi) regulatory oversight frameworks', value: 'vasp_framework', order: 5 },
      ],
    },
    {
      id: 'q-aml-25',
      researchId: project1Id,
      sectionId: 'sec-aml-6',
      text: 'Additional strategic recommendations or operational observations for the research team:',
      description: 'Your insights will directly inform the final policy monograph and symposium briefing.',
      type: 'long_text',
      required: false,
      active: true,
      order: 25,
    },

    // Questions for Project 2 (Green Finance)
    {
      id: 'q-green-01',
      researchId: project2Id,
      sectionId: 'sec-green-1',
      text: 'Has your institution adopted formal ESG lending criteria mandated by BNR?',
      type: 'yes_no',
      required: true,
      active: true,
      order: 1,
    },
    {
      id: 'q-green-02',
      researchId: project2Id,
      sectionId: 'sec-green-1',
      text: 'Rate the availability of green credit guarantee instruments in the Rwandan market:',
      type: 'rating',
      required: true,
      active: true,
      order: 2,
    },

    // Questions for Project 3 (Digital Payments)
    {
      id: 'q-dig-01',
      researchId: project3Id,
      sectionId: 'sec-digital-1',
      text: 'Primary digital payment channel used for everyday transactions:',
      type: 'single_choice',
      required: true,
      active: true,
      order: 1,
      options: [
        { id: 'opt-d1-1', text: 'Mobile Money (MTN MoMo / Airtel Money)', value: 'momo', order: 1 },
        { id: 'opt-d1-2', text: 'Commercial Bank Mobile App / Push-Pull', value: 'bank_app', order: 2 },
        { id: 'opt-d1-3', text: 'Point of Sale (POS) Card Swipes', value: 'pos_card', order: 3 },
        { id: 'opt-d1-4', text: 'Online Payment Gateway', value: 'online_gateway', order: 4 },
      ],
    },
  ];

  // 32 Realistic Responses for Project 1 (AML/CFT)
  const sampleResponses: ResearchResponse[] = [];
  const roles = ['reporting_entity', 'regulator', 'other'];
  const institutions = ['commercial_bank', 'microfinance', 'insurance_capital', 'vasp', 'bnr', 'rra'];
  const titles = ['compliance_officer', 'mlro_manager', 'risk_officer', 'internal_auditor', 'supervisor_examiner'];
  const genders = ['male', 'female', 'male', 'female', 'prefer_not'];
  const ageBrackets = ['25_34', '35_44', '45_54', '25_34'];
  const educations = ['bachelor', 'master', 'master', 'bachelor', 'phd'];
  const certs = [['cams'], ['cfe'], ['cams', 'cfe'], ['ica'], ['none']];
  const experiences = ['2_5', '5_10', 'over_10', 'under_2'];
  const provinces = ['kigali', 'kigali', 'southern', 'western', 'eastern'];
  const ownerships = ['domestic', 'foreign', 'domestic', 'state', 'joint_venture'];
  const frequencies = ['annually', 'ongoing', 'bi_annually', 'ongoing'];
  const strFeedbacks = ['1_3m', 'under_30d', '3_6m', 'rarely'];
  const assetForfeitures = ['partially', 'partially', 'yes', 'no'];
  const vaspReadiness = ['planning', 'partially_compliant', 'not_started', 'fully_compliant'];
  const reforms = ['automated_data_hub', 'specialized_court', 'accredited_training', 'automated_data_hub', 'vasp_framework'];

  for (let i = 1; i <= 32; i++) {
    const isRegulator = i % 5 === 0;
    const repRole = isRegulator ? 'regulator' : 'reporting_entity';
    const repInst = isRegulator ? (i % 2 === 0 ? 'bnr' : 'rra') : institutions[i % 4];
    const repTitle = isRegulator ? 'supervisor_examiner' : titles[i % 4];
    const repGender = genders[i % genders.length];
    const repAge = ageBrackets[i % ageBrackets.length];
    const repEdu = educations[i % educations.length];
    const repCert = certs[i % certs.length];
    const repExp = experiences[i % experiences.length];
    const repProv = provinces[i % provinces.length];
    const repOwn = isRegulator ? 'na' : ownerships[i % ownerships.length];

    // Ratings & Likert with realistic distribution
    const likertMonitoring = (i % 5) + 1; // 1 to 5
    const likertSynergy = (i % 4) + 2; // 2 to 5
    const likertJudicial = ((i + 2) % 5) + 1;
    const likertSupervisory = ((i + 1) % 5) + 1;
    const vaspRisk = 4 + (i % 2); // 4 or 5 (consistently viewed as elevated)

    sampleResponses.push({
      id: `resp-aml-${String(i).padStart(3, '0')}`,
      researchId: project1Id,
      consentGiven: true,
      status: 'COMPLETED',
      submittedAt: new Date(Date.now() - (35 - i) * 3600000 * 18).toISOString(),
      metadata: {
        durationSeconds: 480 + (i * 15) % 180,
        completionPercentage: 100,
      },
      answers: [
        { questionId: 'q-aml-01', value: repRole },
        { questionId: 'q-aml-02', value: repInst },
        { questionId: 'q-aml-03', value: repTitle },
        { questionId: 'q-aml-04', value: repGender },
        { questionId: 'q-aml-05', value: repAge },
        { questionId: 'q-aml-06', value: repEdu },
        { questionId: 'q-aml-07', value: repCert },
        { questionId: 'q-aml-08', value: repExp },
        { questionId: 'q-aml-09', value: repProv },
        { questionId: 'q-aml-10', value: repOwn },
        { questionId: 'q-aml-11', value: frequencies[i % frequencies.length] },
        { questionId: 'q-aml-12', value: likertMonitoring },
        { questionId: 'q-aml-13', value: i % 4 !== 0 ? 'yes' : 'no' },
        {
          questionId: 'q-aml-14',
          value: ['complex_structures', 'rdb_delay', 'cross_border'].slice(0, 2 + (i % 2)),
        },
        { questionId: 'q-aml-15', value: likertSynergy },
        {
          questionId: 'q-aml-16',
          value: ['warrant_delays', 'vasp_tracing', 'forensic_shortage'].slice(0, 2),
        },
        { questionId: 'q-aml-17', value: isRegulator ? 'na' : strFeedbacks[i % strFeedbacks.length] },
        { questionId: 'q-aml-18', value: likertJudicial },
        { questionId: 'q-aml-19', value: assetForfeitures[i % assetForfeitures.length] },
        {
          questionId: 'q-aml-20',
          value: i % 3 === 0
            ? 'Establishing beyond reasonable doubt the nexus between the underlying tax fraud / procurement inflation and the placement of funds without certified forensic testimony is the greatest hurdle in Rwandan criminal courts.'
            : (i % 3 === 1 ? 'Judges occasionally demand a prior conviction for the predicate offence before adjudicating money laundering, despite statutory autonomy under Article 75.' : 'Lack of cross-border witness subpoenas causes significant trial postponements.'),
        },
        { questionId: 'q-aml-21', value: likertSupervisory },
        { questionId: 'q-aml-22', value: vaspRisk },
        { questionId: 'q-aml-23', value: vaspReadiness[i % vaspReadiness.length] },
        { questionId: 'q-aml-24', value: reforms[i % reforms.length] },
        {
          questionId: 'q-aml-25',
          value: i % 4 === 0
            ? 'We strongly encourage the research team to brief both the BNR Governors and the Parliamentary Committee on National Budget and Patrimony on these empirical findings.'
            : '',
        },
      ],
    });
  }

  // 5 News Articles
  const news: NewsArticle[] = [
    {
      id: 'news-001',
      title: 'Rwanda Financial Intelligence Centre (FIC) Hosts Strategic AML/CFT Symposium for Commercial Banks',
      slug: 'fic-strategic-aml-cft-symposium-commercial-banks',
      subtitle: 'Key deliberations focused on real-time transaction monitoring, cross-border intelligence sharing, and UBO verification.',
      featuredImage: '/src/assets/images/news_financial_compliance_1791454479790.jpg',
      content: 'Senior compliance executives from commercial banks, microfinance institutions, and regulatory supervisors convened in Kigali for a two-day policy symposium organized by the Financial Intelligence Centre (FIC). The sessions reviewed recent Mutual Evaluation trends across Eastern and Southern Africa, stressing the imperative for institutional data harmonization, enhanced beneficial ownership registries, and algorithmic pattern recognition to curb illicit financial flows.',
      author: 'AcuityResearch Regulatory Desk',
      publishedAt: '2026-03-05T09:00:00Z',
      category: 'Regulatory Affairs',
      tags: ['AML/CFT', 'Rwanda', 'FIC', 'Banking Compliance', 'Policy'],
      seoTitle: 'FIC Hosts Strategic AML/CFT Symposium for Commercial Banks in Kigali',
      seoDescription: 'Deliberations on real-time transaction monitoring and UBO verification at the national compliance symposium in Kigali.',
      published: true,
    },
    {
      id: 'news-002',
      title: 'National Bank of Rwanda (BNR) Issues Updated Directives on Virtual Asset Service Provider Compliance',
      slug: 'bnr-updated-directives-virtual-asset-service-providers',
      subtitle: 'New compliance guidelines mandate full Travel Rule enforcement for crypto asset exchanges and digital brokers.',
      featuredImage: '/src/assets/images/blog_forensic_investigation_1791454491528.jpg',
      content: 'In response to growing cross-border virtual asset trading, the National Bank of Rwanda (BNR) has promulgated enhanced supervisory guidelines governing licensed Virtual Asset Service Providers (VASPs). The new rules require VASPs to institute cryptographic customer identification, conduct ongoing screening against international sanction lists, and exchange originator and beneficiary metadata for all transfers exceeding statutory thresholds.',
      author: 'Legal & Financial Policy Bureau',
      publishedAt: '2026-02-28T14:30:00Z',
      category: 'Fintech & Regulation',
      tags: ['BNR', 'VASPs', 'Cryptocurrency', 'Travel Rule', 'Financial Law'],
      seoTitle: 'BNR Issues Directives on VASP Compliance and FATF Travel Rule',
      seoDescription: 'National Bank of Rwanda mandates rigorous AML/CFT screening and originator identification for virtual asset service providers.',
      published: true,
    },
    {
      id: 'news-003',
      title: 'East African Regional AML Taskforce Commends Rwanda on Rapid Institutional Digitalization',
      slug: 'east-african-taskforce-commends-rwanda-digitalization',
      subtitle: 'ESAAMLG experts highlight integrated judicial filing and RDB beneficial ownership digitization as regional best practices.',
      featuredImage: '/src/assets/images/research_hero_banner_1791454454189.jpg',
      content: 'Delegates from the Eastern and Southern Africa Anti-Money Laundering Group (ESAAMLG) praised Rwanda\'s rapid deployment of digital platforms for beneficial ownership registers and automated suspicious transaction reporting. Peer evaluators noted that Rwanda\'s unified commercial registry and digitized court filing system have substantially shortened investigative discovery timelines.',
      author: 'Regional Compliance Monitor',
      publishedAt: '2026-02-18T11:00:00Z',
      category: 'Regional Integration',
      tags: ['ESAAMLG', 'Regional Governance', 'Judicial Modernization'],
      seoTitle: 'Regional AML Taskforce Commends Rwanda\'s Institutional Digitalization',
      seoDescription: 'ESAAMLG evaluation highlights Rwanda\'s digitized beneficial ownership register and streamlined judicial evidentiary tools.',
      published: true,
    },
    {
      id: 'news-004',
      title: 'Rwanda Investigation Bureau (RIB) and Capital Market Authority Launch Joint Forensic Accounting Certification',
      slug: 'rib-cma-joint-forensic-accounting-certification',
      subtitle: 'Specialized 12-month program aims to build investigative depth in tracing corporate shell vehicles and securities fraud.',
      featuredImage: '/src/assets/images/news_financial_compliance_1791454479790.jpg',
      content: 'To counter sophisticated corporate fraud and market manipulation, the Rwanda Investigation Bureau (RIB) has partnered with the Capital Market Authority (CMA) to inaugurate an advanced forensic accounting fellowship. The curriculum equips law enforcement analysts with forensic data mining, trade reconstruction, and asset-tracing methodologies.',
      author: 'Investigation Capacity Initiative',
      publishedAt: '2026-02-12T16:00:00Z',
      category: 'Capacity Building',
      tags: ['RIB', 'Forensic Accounting', 'Securities', 'Asset Tracing'],
      seoTitle: 'RIB and CMA Launch Joint Forensic Accounting Certification in Kigali',
      seoDescription: 'Specialized 12-month fellowship trains financial investigators in corporate forensic auditing and asset tracing.',
      published: true,
    },
    {
      id: 'news-005',
      title: 'AcuityResearch Forum Commences Nationwide Compliance Survey Fieldwork Across Rwandan Financial Institutions',
      slug: 'acuityresearch-nationwide-compliance-survey-fieldwork',
      subtitle: 'Over 40 commercial banks, microfinance firms, and supervisors participate in landmark empirical study led by MAHORO Cesar.',
      featuredImage: '/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg',
      content: 'The AcuityResearch platform has officially initiated field response collection for its landmark investigation into money laundering and terrorist financing deterrence strategies in Rwanda. Under the leadership of Principal Investigator MAHORO Cesar, the research team aims to deliver independent, quantitative insights that guide the national financial crime strategy.',
      author: 'Editorial Office',
      publishedAt: '2026-02-01T10:00:00Z',
      category: 'Institutional Research',
      tags: ['AcuityResearch', 'MAHORO Cesar', 'Fieldwork', 'Empirical Study'],
      seoTitle: 'Nationwide Compliance Survey Commences Fieldwork in Rwanda',
      seoDescription: 'AcuityResearch initiates empirical data collection across Rwandan banking and regulatory sectors.',
      published: true,
    },
  ];

  // 5 Blog Posts (with MAHORO Cesar as primary author)
  const blog: BlogPost[] = [
    {
      id: 'blog-001',
      title: 'Deconstructing Beneficial Ownership Concealment: Practical Lessons for Rwandan MLROs',
      slug: 'deconstructing-beneficial-ownership-concealment-rwandan-mlros',
      author: 'MAHORO Cesar',
      authorRole: 'Lead Investigator & AML/CFT Compliance Specialist',
      authorImage: '/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg',
      featuredImage: '/src/assets/images/blog_forensic_investigation_1791454491528.jpg',
      content: `The identification of ultimate beneficial owners (UBO) remains the foundational pillar of any robust anti-money laundering architecture. In Rwanda, the enactment of statutory provisions requiring transparent disclosure in the commercial registry has marked a significant structural advancement. Yet, practical challenges persist on the operational frontline.

### The Anatomy of Nominee Concealment
Financial crime perpetrators rarely operate through transparent ownership trees. In our ongoing empirical investigations across Rwandan financial institutions, we observe several recurrent concealment typologies:
1. **Multi-tiered holding companies** spanning neighboring jurisdictions with divergent corporate disclosure rules.
2. **Informal powers-of-attorney** where the registered shareholder acts purely on instructions from undisclosed beneficial principals.
3. **Circular corporate shareholdings** engineered to obscure the 25% statutory controlling equity threshold.

### Operational Remedies for Compliance Teams
To mitigate these risks, compliance officers must transition from passive document collection to proactive forensic verification:
- Cross-reference registry filings against corporate bank signatory cards and actual transactional beneficiaries.
- Require notarized disclosures when non-resident corporate shareholders hold controlling stakes.
- Implement automated graph-database analysis to detect shared residential addresses, telephone numbers, and nominee directors across seemingly unrelated entities.`,
      category: 'Compliance Practice',
      tags: ['Beneficial Ownership', 'UBO', 'Corporate Governance', 'AML/CFT'],
      publishedAt: '2026-03-08T08:30:00Z',
      readingTime: '5 min read',
      seoTitle: 'Deconstructing Beneficial Ownership Concealment | MAHORO Cesar',
      seoDescription: 'Practical insights from lead researcher MAHORO Cesar on detecting nominee shareholders and corporate concealment in Rwanda.',
      published: true,
    },
    {
      id: 'blog-002',
      title: 'The Intersection of AML/CFT and Virtual Assets: Navigating the FATF Travel Rule in East Africa',
      slug: 'intersection-aml-cft-virtual-assets-fatf-travel-rule',
      author: 'MAHORO Cesar',
      authorRole: 'Lead Investigator & AML/CFT Compliance Specialist',
      authorImage: '/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg',
      featuredImage: '/src/assets/images/news_financial_compliance_1791454479790.jpg',
      content: `As digital financial instruments gain traction across the East African Community, regulatory perimeter boundaries are being redrawn. Virtual Asset Service Providers (VASPs) offer unprecedented transaction speed and financial access, but they also present unique vectors for illicit value transmission.

### Understanding Recommendation 16 (The Travel Rule)
The Financial Action Task Force (FATF) Recommendation 16 requires VASPs to obtain, hold, and transmit required and accurate originator and beneficiary information immediately and securely when conducting crypto transfers.

In Rwanda's context, where mobile money ecosystems interact seamlessly with virtual asset on-ramps, ensuring cryptographic identity verification without introducing unsustainable friction for legitimate users requires careful regulatory balancing.

### Key Implementation Milestones
- **Interoperable Messaging Protocols**: Implementing messaging protocols (such as IVMS101) to communicate across differing blockchain analytics platforms.
- **Counterparty VASP Due Diligence**: Establishing that the receiving entity in a cross-border transaction is duly licensed and adheres to comparable AML/CFT standards.
- **Continuous Unhosted Wallet Screening**: Applying risk-scoring algorithms to transactions interacting with private unhosted wallets.`,
      category: 'Fintech & Digital Assets',
      tags: ['Virtual Assets', 'VASPs', 'Travel Rule', 'FATF', 'East Africa'],
      publishedAt: '2026-02-27T10:00:00Z',
      readingTime: '6 min read',
      seoTitle: 'Virtual Assets and the FATF Travel Rule in East Africa | MAHORO Cesar',
      seoDescription: 'Lead researcher MAHORO Cesar analyzes virtual asset compliance and FATF Travel Rule implementation in East Africa.',
      published: true,
    },
    {
      id: 'blog-003',
      title: 'From Suspicious Transaction Reports (STRs) to Court Convictions: Bridging the Evidentiary Gap',
      slug: 'from-strs-to-court-convictions-bridging-evidentiary-gap',
      author: 'MAHORO Cesar',
      authorRole: 'Lead Investigator & AML/CFT Compliance Specialist',
      authorImage: '/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg',
      featuredImage: '/src/assets/images/research_hero_banner_1791454454189.jpg',
      content: `A high volume of Suspicious Transaction Reports (STRs) filed with a Financial Intelligence Unit does not automatically equate to effective criminal justice outcomes. The ultimate barometer of an anti-money laundering regime lies in its ability to translate suspicious activity intelligence into admissible judicial evidence that withstands scrutiny in court.

### The Chain of Financial Evidence
1. **The Reporting Entity Phase**: Identifying anomalies through heuristic thresholds and suspicious transaction red flags.
2. **The Intelligence Phase**: The Financial Intelligence Centre (FIC) analyzing STRs, enriching them with tax and border data, and generating tactical dissemination packages.
3. **The Investigation Phase**: The Rwanda Investigation Bureau (RIB) converting intelligence into sworn witness statements, subpoenaed financial records, and forensic ledgers.
4. **The Prosecution Phase**: The National Public Prosecution Authority (NPPA) demonstrating both the illicit origin (predicate crime) and the laundering intent.

### Overcoming Evidentiary Roadblocks
Our ongoing study underscores that the primary bottleneck occurs during the transition between intelligence dissemination and formal criminal investigation. Investing in joint training between bank MLROs, law enforcement detectives, and public prosecutors is essential to ensure that forensic documentation meets the stringent standard of proof beyond reasonable doubt.`,
      category: 'Judicial & Prosecution',
      tags: ['STRs', 'Financial Evidence', 'Prosecution', 'RIB', 'Judicial Policy'],
      publishedAt: '2026-02-15T12:00:00Z',
      readingTime: '7 min read',
      seoTitle: 'From STRs to Court Convictions: Bridging the Evidentiary Gap in Rwanda',
      seoDescription: 'Analyzing the critical evidentiary pipeline from bank suspicion reports to successful judicial asset recovery.',
      published: true,
    },
    {
      id: 'blog-004',
      title: 'Institutional Risk Assessment Methodologies: Aligning Internal Controls with Rwanda\'s NRA',
      slug: 'institutional-risk-assessment-methodologies-rwandan-nra',
      author: 'Jean-Paul Mugisha',
      authorRole: 'Senior Methodologist',
      authorImage: '',
      featuredImage: '/src/assets/images/news_financial_compliance_1791454479790.jpg',
      content: `Financial institutions must align their internal risk scores with national vulnerabilities highlighted in Rwanda's National Risk Assessment (NRA). This analysis provides a step-by-step framework for calibrating risk scoring matrices against sector-specific threat profiles.`,
      category: 'Methodology & Risk',
      tags: ['NRA', 'Risk Assessment', 'Internal Controls'],
      publishedAt: '2026-02-05T09:00:00Z',
      readingTime: '4 min read',
      seoTitle: 'Institutional Risk Assessment Methodologies | AcuityResearch',
      seoDescription: 'How financial institutions can align internal risk assessments with Rwanda\'s National Risk Assessment.',
      published: true,
    },
    {
      id: 'blog-005',
      title: 'Evidence-Based Policy in Financial Crime Prevention: Why Empirical Compliance Research Matters',
      slug: 'evidence-based-policy-financial-crime-prevention',
      author: 'Dr. Aline Uwera',
      authorRole: 'Institutional Governance Director',
      authorImage: '',
      featuredImage: '/src/assets/images/blog_forensic_investigation_1791454491528.jpg',
      content: `Without empirical validation, compliance frameworks risk devolving into box-ticking rituals. Rigorous survey methodologies and anonymized practitioner feedback provide the vital empirical foundation required to refine regulations, allocate supervisory resources efficiently, and safeguard economic integrity.`,
      category: 'Research Philosophy',
      tags: ['Empirical Research', 'Policy Making', 'Governance'],
      publishedAt: '2026-01-25T11:00:00Z',
      readingTime: '5 min read',
      seoTitle: 'Evidence-Based Policy in Financial Crime Prevention | AcuityResearch',
      seoDescription: 'Why empirical research and quantitative surveys are crucial for developing effective financial crime policies.',
      published: true,
    },
  ];

  // Initial Audit Logs
  const auditLogs: AuditLog[] = [
    {
      id: 'log-001',
      userId: cesarUser.id,
      userName: cesarUser.name,
      userRole: cesarUser.role,
      action: 'SYSTEM_INITIALIZATION',
      entityType: 'RESEARCH',
      entityId: project1Id,
      details: 'Initialized AML/CFT Rwanda empirical research project and configured dynamic questionnaire sections.',
      timestamp: '2026-03-01T08:00:00Z',
    },
    {
      id: 'log-002',
      userId: cesarUser.id,
      userName: cesarUser.name,
      userRole: cesarUser.role,
      action: 'PUBLISH_RESEARCH',
      entityType: 'RESEARCH',
      entityId: project1Id,
      details: 'Published research project for public and anonymous respondent participation.',
      timestamp: '2026-03-01T08:15:00Z',
    },
    {
      id: 'log-003',
      userId: cesarUser.id,
      userName: cesarUser.name,
      userRole: cesarUser.role,
      action: 'PUBLISH_BLOG',
      entityType: 'BLOG',
      entityId: 'blog-001',
      details: 'Published article "Deconstructing Beneficial Ownership Concealment".',
      timestamp: '2026-03-08T08:30:00Z',
    },
  ];

  return {
    users,
    projects: [project1, project2, project3],
    sections,
    questions,
    responses: sampleResponses,
    news,
    blog,
    auditLogs,
  };
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      ensureDirectoryExists(DB_FILE);
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        if (parsed.projects && parsed.questions && parsed.responses) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database.json, initializing fresh seed.', err);
    }

    const seed = getInitialSeedData();
    this.saveDataDirect(seed);
    return seed;
  }

  private saveDataDirect(data: DatabaseSchema) {
    try {
      ensureDirectoryExists(DB_FILE);
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  private save() {
    this.saveDataDirect(this.data);
  }

  // --- Reset to seed data ---
  resetSeed() {
    this.data = getInitialSeedData();
    this.save();
    return { success: true, message: 'Database reset to default seed data successfully.' };
  }

  // --- Users & Profiles ---
  getUsers(): UserProfile[] {
    return this.data.users;
  }

  getUserById(id: string): UserProfile | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): UserProfile | undefined {
    return this.data.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  }

  updateUserRole(userId: string, role: UserProfile['role'], adminUser: UserProfile): UserProfile {
    const user = this.data.users.find((u) => u.id === userId);
    if (!user) throw new Error('User not found');
    user.role = role;
    this.logAction(adminUser, 'UPDATE_USER_ROLE', 'USER', userId, `Updated role to ${role}`);
    this.save();
    return user;
  }

  // --- Projects ---
  getProjects(filters?: { status?: string; search?: string; category?: string }): ResearchProject[] {
    let list = this.data.projects.map((p) => {
      const respCount = this.data.responses.filter((r) => r.researchId === p.id).length;
      const qCount = this.data.questions.filter((q) => q.researchId === p.id && q.active).length;
      return {
        ...p,
        responseCount: respCount,
        questionsCount: qCount,
      } as any;
    });

    if (filters?.status && filters.status !== 'ALL') {
      list = list.filter((p) => p.status === filters.status);
    }

    if (filters?.category && filters.category !== 'ALL') {
      list = list.filter((p) => p.category.toLowerCase().includes(filters.category!.toLowerCase()));
    }

    if (filters?.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.targetAudience.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getProjectById(idOrSlug: string, includeFull = false): ResearchProject | null {
    const project = this.data.projects.find((p) => p.id === idOrSlug || p.slug === idOrSlug);
    if (!project) return null;

    if (!includeFull) {
      const respCount = this.data.responses.filter((r) => r.researchId === project.id).length;
      return { ...project, responseCount: respCount };
    }

    const sections = this.data.sections
      .filter((s) => s.researchId === project.id)
      .sort((a, b) => a.order - b.order);

    const questions = this.data.questions
      .filter((q) => q.researchId === project.id && q.active)
      .sort((a, b) => a.order - b.order);

    const respCount = this.data.responses.filter((r) => r.researchId === project.id).length;

    return {
      ...project,
      sections,
      questions,
      responseCount: respCount,
    };
  }

  createProject(projectData: Partial<ResearchProject>, user: UserProfile): ResearchProject {
    const id = `proj-${Date.now()}`;
    const slug = (projectData.title || 'research-project')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newProject: ResearchProject = {
      id,
      title: projectData.title || 'Untitled Research Study',
      slug,
      category: projectData.category || 'General Research',
      shortDescription: projectData.shortDescription || '',
      description: projectData.description || '',
      purpose: projectData.purpose || '',
      background: projectData.background || '',
      targetAudience: projectData.targetAudience || 'General Public',
      estimatedTime: projectData.estimatedTime || '5–10 minutes',
      confidentialityStatement:
        projectData.confidentialityStatement ||
        'All responses are confidential and used exclusively for academic research.',
      dataUseStatement: projectData.dataUseStatement || 'Data will be analyzed in aggregated form.',
      researcherName: projectData.researcherName || user.name,
      researcherRole: projectData.researcherRole || 'Lead Researcher',
      researcherInstitution: projectData.researcherInstitution || 'AcuityResearch Institute',
      researcherImage: projectData.researcherImage || user.avatarUrl,
      requiresConsent: projectData.requiresConsent !== undefined ? projectData.requiresConsent : true,
      consentText:
        projectData.consentText ||
        'I understand the purpose of this research and agree voluntarily to participate.',
      status: projectData.status || 'DRAFT',
      access: projectData.access || 'ANONYMOUS',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: projectData.status === 'PUBLISHED' ? new Date().toISOString() : undefined,
    };

    this.data.projects.push(newProject);

    // Create a default initial section
    const defaultSection: ResearchSection = {
      id: `sec-${Date.now()}-1`,
      researchId: id,
      title: 'General Questionnaire',
      description: 'Primary survey questions',
      order: 1,
    };
    this.data.sections.push(defaultSection);

    this.logAction(user, 'CREATE_RESEARCH', 'RESEARCH', id, `Created research: ${newProject.title}`);
    this.save();
    return newProject;
  }

  updateProject(id: string, updates: Partial<ResearchProject>, user: UserProfile): ResearchProject {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Research project not found');

    const current = this.data.projects[index];
    const wasPublished = current.status === 'PUBLISHED';
    const nowPublishing = updates.status === 'PUBLISHED' && !wasPublished;

    const updated: ResearchProject = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString(),
      publishedAt: nowPublishing ? new Date().toISOString() : current.publishedAt,
    };

    this.data.projects[index] = updated;
    this.logAction(user, 'UPDATE_RESEARCH', 'RESEARCH', id, `Updated research: ${updated.title}`);
    this.save();
    return updated;
  }

  deleteProject(id: string, user: UserProfile): boolean {
    const proj = this.data.projects.find((p) => p.id === id);
    if (!proj) return false;

    this.data.projects = this.data.projects.filter((p) => p.id !== id);
    this.data.sections = this.data.sections.filter((s) => s.researchId !== id);
    this.data.questions = this.data.questions.filter((q) => q.researchId !== id);
    this.data.responses = this.data.responses.filter((r) => r.researchId !== id);

    this.logAction(user, 'DELETE_RESEARCH', 'RESEARCH', id, `Deleted research project: ${proj.title}`);
    this.save();
    return true;
  }

  duplicateProject(id: string, user: UserProfile): ResearchProject {
    const sourceProject = this.getProjectById(id, true);
    if (!sourceProject) throw new Error('Source project not found');

    const newId = `proj-dup-${Date.now()}`;
    const newTitle = `${sourceProject.title} (Copy)`;
    const newSlug = `${sourceProject.slug}-copy-${Date.now().toString().slice(-4)}`;

    const newProject: ResearchProject = {
      ...sourceProject,
      id: newId,
      title: newTitle,
      slug: newSlug,
      status: 'DRAFT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: undefined,
      closedAt: undefined,
      sections: undefined,
      questions: undefined,
      responseCount: 0,
    };

    this.data.projects.push(newProject);

    // Map old section IDs to new section IDs
    const sectionMap = new Map<string, string>();
    const oldSections = this.data.sections.filter((s) => s.researchId === id);
    for (const sec of oldSections) {
      const newSecId = `sec-dup-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      sectionMap.set(sec.id, newSecId);
      this.data.sections.push({
        ...sec,
        id: newSecId,
        researchId: newId,
      });
    }

    // Duplicate questions
    const oldQuestions = this.data.questions.filter((q) => q.researchId === id);
    const questionMap = new Map<string, string>();

    // First pass create new question IDs
    for (const q of oldQuestions) {
      const newQId = `q-dup-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      questionMap.set(q.id, newQId);
    }

    // Second pass duplicate questions with updated IDs and logic references
    for (const q of oldQuestions) {
      const newQId = questionMap.get(q.id)!;
      const targetSecId = sectionMap.get(q.sectionId) || this.data.sections[0]?.id;

      const duplicatedLogic = q.logic?.map((l) => ({
        ...l,
        id: `log-dup-${Date.now()}-${Math.random()}`,
        sourceQuestionId: questionMap.get(l.sourceQuestionId) || l.sourceQuestionId,
        targetQuestionId: questionMap.get(l.targetQuestionId) || l.targetQuestionId,
      }));

      this.data.questions.push({
        ...q,
        id: newQId,
        researchId: newId,
        sectionId: targetSecId,
        logic: duplicatedLogic,
      });
    }

    this.logAction(user, 'DUPLICATE_RESEARCH', 'RESEARCH', newId, `Duplicated project from ${sourceProject.title}`);
    this.save();
    return newProject;
  }

  // --- Sections ---
  addSection(projectId: string, sectionData: Partial<ResearchSection>, user: UserProfile): ResearchSection {
    const existingSections = this.data.sections.filter((s) => s.researchId === projectId);
    const nextOrder = existingSections.length + 1;
    const newSection: ResearchSection = {
      id: `sec-${Date.now()}`,
      researchId: projectId,
      title: sectionData.title || `Section ${nextOrder}`,
      description: sectionData.description || '',
      order: nextOrder,
    };

    this.data.sections.push(newSection);
    this.logAction(user, 'ADD_SECTION', 'SECTION', newSection.id, `Added section to project ${projectId}`);
    this.save();
    return newSection;
  }

  updateSection(sectionId: string, updates: Partial<ResearchSection>, user: UserProfile): ResearchSection {
    const index = this.data.sections.findIndex((s) => s.id === sectionId);
    if (index === -1) throw new Error('Section not found');

    const updated = { ...this.data.sections[index], ...updates };
    this.data.sections[index] = updated;
    this.logAction(user, 'UPDATE_SECTION', 'SECTION', sectionId, `Updated section ${updated.title}`);
    this.save();
    return updated;
  }

  deleteSection(sectionId: string, user: UserProfile): boolean {
    const sec = this.data.sections.find((s) => s.id === sectionId);
    if (!sec) return false;

    // Delete section and its questions
    this.data.sections = this.data.sections.filter((s) => s.id !== sectionId);
    this.data.questions = this.data.questions.filter((q) => q.sectionId !== sectionId);

    this.logAction(user, 'DELETE_SECTION', 'SECTION', sectionId, `Deleted section ${sec.title}`);
    this.save();
    return true;
  }

  // --- Questions ---
  addQuestion(projectId: string, questionData: Partial<ResearchQuestion>, user: UserProfile): ResearchQuestion {
    const existing = this.data.questions.filter((q) => q.researchId === projectId);
    const nextOrder = existing.length + 1;

    // Ensure section exists
    let sectionId = questionData.sectionId;
    if (!sectionId) {
      const firstSec = this.data.sections.find((s) => s.researchId === projectId);
      sectionId = firstSec ? firstSec.id : this.addSection(projectId, { title: 'General' }, user).id;
    }

    const newQuestion: ResearchQuestion = {
      id: `q-${Date.now()}`,
      researchId: projectId,
      sectionId,
      text: questionData.text || 'New Question',
      description: questionData.description || '',
      type: questionData.type || 'short_text',
      required: questionData.required !== undefined ? questionData.required : false,
      active: true,
      order: nextOrder,
      options: questionData.options || (['single_choice', 'multiple_choice', 'dropdown'].includes(questionData.type || '')
        ? [
            { id: `opt-1`, text: 'Option 1', value: 'option_1', order: 1 },
            { id: `opt-2`, text: 'Option 2', value: 'option_2', order: 2 },
          ]
        : undefined),
      matrixRows: questionData.matrixRows,
      matrixColumns: questionData.matrixColumns,
      validation: questionData.validation,
      logic: questionData.logic || [],
    };

    this.data.questions.push(newQuestion);
    this.logAction(user, 'ADD_QUESTION', 'QUESTION', newQuestion.id, `Added question: ${newQuestion.text}`);
    this.save();
    return newQuestion;
  }

  updateQuestion(questionId: string, updates: Partial<ResearchQuestion>, user: UserProfile): ResearchQuestion {
    const index = this.data.questions.findIndex((q) => q.id === questionId);
    if (index === -1) throw new Error('Question not found');

    const updated = { ...this.data.questions[index], ...updates };
    this.data.questions[index] = updated;
    this.logAction(user, 'UPDATE_QUESTION', 'QUESTION', questionId, `Updated question: ${updated.text}`);
    this.save();
    return updated;
  }

  duplicateQuestion(questionId: string, user: UserProfile): ResearchQuestion {
    const q = this.data.questions.find((item) => item.id === questionId);
    if (!q) throw new Error('Question not found');

    const newId = `q-dup-${Date.now()}`;
    const duplicated: ResearchQuestion = {
      ...q,
      id: newId,
      text: `${q.text} (Copy)`,
      order: q.order + 1,
      options: q.options ? q.options.map((opt) => ({ ...opt, id: `opt-dup-${Date.now()}-${Math.random()}` })) : undefined,
    };

    this.data.questions.push(duplicated);
    this.logAction(user, 'DUPLICATE_QUESTION', 'QUESTION', newId, `Duplicated question: ${q.text}`);
    this.save();
    return duplicated;
  }

  deleteQuestion(questionId: string, user: UserProfile): boolean {
    const q = this.data.questions.find((item) => item.id === questionId);
    if (!q) return false;

    this.data.questions = this.data.questions.filter((item) => item.id !== questionId);
    this.logAction(user, 'DELETE_QUESTION', 'QUESTION', questionId, `Deleted question: ${q.text}`);
    this.save();
    return true;
  }

  reorderQuestions(projectId: string, orderedIds: string[], user: UserProfile): boolean {
    orderedIds.forEach((id, index) => {
      const q = this.data.questions.find((item) => item.id === id && item.researchId === projectId);
      if (q) {
        q.order = index + 1;
      }
    });

    this.logAction(user, 'REORDER_QUESTIONS', 'QUESTION', projectId, 'Reordered questions');
    this.save();
    return true;
  }

  // --- Response Submission & Storage ---
  submitResponse(projectId: string, payload: {
    consentGiven: boolean;
    answers: Array<{ questionId: string; value: any }>;
    durationSeconds?: number;
    respondentEmail?: string;
  }): ResearchResponse {
    const project = this.data.projects.find((p) => p.id === projectId);
    if (!project) throw new Error('Research project not found');
    if (project.status !== 'PUBLISHED') throw new Error('This research project is currently closed or not published.');

    const newResponse: ResearchResponse = {
      id: `resp-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      researchId: projectId,
      consentGiven: payload.consentGiven,
      status: 'COMPLETED',
      submittedAt: new Date().toISOString(),
      respondentEmail: payload.respondentEmail,
      metadata: {
        durationSeconds: payload.durationSeconds || 120,
        completionPercentage: 100,
      },
      answers: payload.answers,
    };

    this.data.responses.push(newResponse);
    this.save();
    return newResponse;
  }

  getResponses(projectId: string): ResearchResponse[] {
    return this.data.responses
      .filter((r) => r.researchId === projectId)
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
  }

  // --- Results & Statistical Analysis ---
  getResultsAnalytics(projectId: string, filters?: {
    institutionCategory?: string;
    experience?: string;
    province?: string;
  }) {
    const project = this.getProjectById(projectId, true);
    if (!project) throw new Error('Project not found');

    let responses = this.data.responses.filter((r) => r.researchId === projectId);

    // Apply demographic cross-tab filters if specified
    if (filters?.institutionCategory && filters.institutionCategory !== 'ALL') {
      responses = responses.filter((r) => {
        const instAns = r.answers.find((a) => a.questionId === 'q-aml-02');
        return instAns?.value === filters.institutionCategory;
      });
    }

    if (filters?.experience && filters.experience !== 'ALL') {
      responses = responses.filter((r) => {
        const expAns = r.answers.find((a) => a.questionId === 'q-aml-08');
        return expAns?.value === filters.experience;
      });
    }

    if (filters?.province && filters.province !== 'ALL') {
      responses = responses.filter((r) => {
        const provAns = r.answers.find((a) => a.questionId === 'q-aml-09');
        return provAns?.value === filters.province;
      });
    }

    const totalResponses = responses.length;
    const completedResponses = responses.filter((r) => r.status === 'COMPLETED').length;
    const avgDuration = totalResponses > 0
      ? Math.round(responses.reduce((sum, r) => sum + (r.metadata?.durationSeconds || 0), 0) / totalResponses)
      : 0;

    // Daily responses distribution (past 14 days)
    const dailyMap = new Map<string, number>();
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      dailyMap.set(key, 0);
    }

    responses.forEach((r) => {
      const dateKey = r.submittedAt.split('T')[0];
      if (dailyMap.has(dateKey)) {
        dailyMap.set(dateKey, (dailyMap.get(dateKey) || 0) + 1);
      }
    });

    const dailyTrends = Array.from(dailyMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    // Question-by-question breakdown
    const questionsBreakdown = (project.questions || []).map((q) => {
      const relevantAnswers = responses
        .map((r) => r.answers.find((a) => a.questionId === q.id))
        .filter(Boolean)
        .map((a) => a!.value);

      const answeredCount = relevantAnswers.length;

      if (['single_choice', 'dropdown', 'yes_no'].includes(q.type)) {
        const counts: Record<string, number> = {};
        const labels: Record<string, string> = {};

        // Prepare option labels
        if (q.options) {
          q.options.forEach((opt) => {
            counts[opt.value] = 0;
            labels[opt.value] = opt.text;
          });
        } else if (q.type === 'yes_no') {
          counts['yes'] = 0;
          counts['no'] = 0;
          labels['yes'] = 'Yes';
          labels['no'] = 'No';
        }

        relevantAnswers.forEach((val) => {
          if (typeof val === 'string') {
            counts[val] = (counts[val] || 0) + 1;
            if (!labels[val]) labels[val] = val;
          }
        });

        const distribution = Object.entries(counts).map(([key, count]) => ({
          key,
          label: labels[key] || key,
          count,
          percentage: answeredCount > 0 ? Math.round((count / answeredCount) * 100) : 0,
        }));

        return {
          questionId: q.id,
          text: q.text,
          type: q.type,
          answeredCount,
          distribution,
        };
      }

      if (q.type === 'multiple_choice') {
        const counts: Record<string, number> = {};
        const labels: Record<string, string> = {};
        q.options?.forEach((opt) => {
          counts[opt.value] = 0;
          labels[opt.value] = opt.text;
        });

        relevantAnswers.forEach((val) => {
          if (Array.isArray(val)) {
            val.forEach((item) => {
              counts[item] = (counts[item] || 0) + 1;
              if (!labels[item]) labels[item] = item;
            });
          } else if (typeof val === 'string') {
            counts[val] = (counts[val] || 0) + 1;
          }
        });

        const distribution = Object.entries(counts).map(([key, count]) => ({
          key,
          label: labels[key] || key,
          count,
          percentage: answeredCount > 0 ? Math.round((count / answeredCount) * 100) : 0,
        }));

        return {
          questionId: q.id,
          text: q.text,
          type: q.type,
          answeredCount,
          distribution,
        };
      }

      if (['likert', 'rating'].includes(q.type)) {
        const scoreCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        let totalScore = 0;
        let scoreResponses = 0;

        relevantAnswers.forEach((val) => {
          const num = Number(val);
          if (!isNaN(num) && num >= 1 && num <= 5) {
            scoreCounts[num] = (scoreCounts[num] || 0) + 1;
            totalScore += num;
            scoreResponses++;
          }
        });

        const average = scoreResponses > 0 ? (totalScore / scoreResponses).toFixed(2) : '0.00';

        const distribution = [1, 2, 3, 4, 5].map((score) => ({
          score,
          count: scoreCounts[score] || 0,
          percentage: scoreResponses > 0 ? Math.round(((scoreCounts[score] || 0) / scoreResponses) * 100) : 0,
        }));

        return {
          questionId: q.id,
          text: q.text,
          type: q.type,
          answeredCount,
          average,
          distribution,
        };
      }

      // Qualitative text responses
      const textSamples = relevantAnswers
        .filter((val) => typeof val === 'string' && val.trim().length > 0)
        .slice(0, 50);

      return {
        questionId: q.id,
        text: q.text,
        type: q.type,
        answeredCount,
        textSamples,
      };
    });

    return {
      project: {
        id: project.id,
        title: project.title,
        status: project.status,
        category: project.category,
      },
      summary: {
        totalResponses,
        completedResponses,
        completionRate: totalResponses > 0 ? Math.round((completedResponses / totalResponses) * 100) : 100,
        avgDurationMinutes: (avgDuration / 60).toFixed(1),
      },
      dailyTrends,
      questionsBreakdown,
    };
  }

  // --- Export Responses to CSV ---
  exportCsv(projectId: string): string {
    const project = this.getProjectById(projectId, true);
    if (!project) throw new Error('Project not found');

    const responses = this.data.responses.filter((r) => r.researchId === projectId);
    const questions = project.questions || [];

    const headers = ['Response ID', 'Submitted Date', 'Status', ...questions.map((q) => `"${q.text.replace(/"/g, '""')}"`)];

    const rows = responses.map((r) => {
      const date = r.submittedAt;
      const status = r.status;
      const ansCols = questions.map((q) => {
        const found = r.answers.find((a) => a.questionId === q.id);
        if (!found || found.value === undefined || found.value === null) return '""';
        let valStr = '';
        if (Array.isArray(found.value)) {
          valStr = found.value.join('; ');
        } else if (typeof found.value === 'object') {
          valStr = JSON.stringify(found.value);
        } else {
          valStr = String(found.value);
        }
        return `"${valStr.replace(/"/g, '""')}"`;
      });
      return [r.id, date, status, ...ansCols].join(',');
    });

    return [headers.join(','), ...rows].join('\n');
  }

  // --- News Articles ---
  getNews(onlyPublished = true): NewsArticle[] {
    let list = this.data.news;
    if (onlyPublished) list = list.filter((n) => n.published);
    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  getNewsById(idOrSlug: string): NewsArticle | undefined {
    return this.data.news.find((n) => n.id === idOrSlug || n.slug === idOrSlug);
  }

  createNews(articleData: Partial<NewsArticle>, user: UserProfile): NewsArticle {
    const id = `news-${Date.now()}`;
    const slug = (articleData.title || 'news-article')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newArticle: NewsArticle = {
      id,
      title: articleData.title || 'Untitled News',
      slug,
      subtitle: articleData.subtitle || '',
      featuredImage: articleData.featuredImage || '/src/assets/images/news_financial_compliance_1791454479790.jpg',
      content: articleData.content || '',
      author: articleData.author || user.name,
      publishedAt: new Date().toISOString(),
      category: articleData.category || 'Regulatory News',
      tags: articleData.tags || ['Policy', 'Rwanda'],
      seoTitle: articleData.seoTitle || articleData.title || '',
      seoDescription: articleData.seoDescription || articleData.subtitle || '',
      published: articleData.published !== undefined ? articleData.published : true,
    };

    this.data.news.unshift(newArticle);
    this.logAction(user, 'CREATE_NEWS', 'NEWS', id, `Created news article: ${newArticle.title}`);
    this.save();
    return newArticle;
  }

  updateNews(id: string, updates: Partial<NewsArticle>, user: UserProfile): NewsArticle {
    const index = this.data.news.findIndex((n) => n.id === id);
    if (index === -1) throw new Error('News article not found');

    const updated = { ...this.data.news[index], ...updates };
    this.data.news[index] = updated;
    this.logAction(user, 'UPDATE_NEWS', 'NEWS', id, `Updated news article: ${updated.title}`);
    this.save();
    return updated;
  }

  deleteNews(id: string, user: UserProfile): boolean {
    const item = this.data.news.find((n) => n.id === id);
    if (!item) return false;

    this.data.news = this.data.news.filter((n) => n.id !== id);
    this.logAction(user, 'DELETE_NEWS', 'NEWS', id, `Deleted news article: ${item.title}`);
    this.save();
    return true;
  }

  // --- Blog Posts ---
  getBlog(onlyPublished = true): BlogPost[] {
    let list = this.data.blog;
    if (onlyPublished) list = list.filter((b) => b.published);
    return list.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  }

  getBlogById(idOrSlug: string): BlogPost | undefined {
    return this.data.blog.find((b) => b.id === idOrSlug || b.slug === idOrSlug);
  }

  createBlog(postData: Partial<BlogPost>, user: UserProfile): BlogPost {
    const id = `blog-${Date.now()}`;
    const slug = (postData.title || 'blog-post')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const newPost: BlogPost = {
      id,
      title: postData.title || 'Untitled Post',
      slug,
      author: postData.author || user.name,
      authorRole: postData.authorRole || user.department,
      authorImage: postData.authorImage || user.avatarUrl,
      featuredImage: postData.featuredImage || '/src/assets/images/blog_forensic_investigation_1791454491528.jpg',
      content: postData.content || '',
      category: postData.category || 'Research Insights',
      tags: postData.tags || ['Research'],
      publishedAt: new Date().toISOString(),
      readingTime: postData.readingTime || '5 min read',
      seoTitle: postData.seoTitle || postData.title || '',
      seoDescription: postData.seoDescription || '',
      published: postData.published !== undefined ? postData.published : true,
    };

    this.data.blog.unshift(newPost);
    this.logAction(user, 'CREATE_BLOG', 'BLOG', id, `Created blog post: ${newPost.title}`);
    this.save();
    return newPost;
  }

  updateBlog(id: string, updates: Partial<BlogPost>, user: UserProfile): BlogPost {
    const index = this.data.blog.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Blog post not found');

    const updated = { ...this.data.blog[index], ...updates };
    this.data.blog[index] = updated;
    this.logAction(user, 'UPDATE_BLOG', 'BLOG', id, `Updated blog post: ${updated.title}`);
    this.save();
    return updated;
  }

  deleteBlog(id: string, user: UserProfile): boolean {
    const item = this.data.blog.find((b) => b.id === id);
    if (!item) return false;

    this.data.blog = this.data.blog.filter((b) => b.id !== id);
    this.logAction(user, 'DELETE_BLOG', 'BLOG', id, `Deleted blog post: ${item.title}`);
    this.save();
    return true;
  }

  // --- Global Search ---
  globalSearch(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { research: [], news: [], blog: [] };

    const research = this.data.projects
      .filter(
        (p) =>
          p.status === 'PUBLISHED' &&
          (p.title.toLowerCase().includes(q) ||
            p.shortDescription.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.researcherName.toLowerCase().includes(q))
      )
      .slice(0, 5);

    const news = this.data.news
      .filter(
        (n) =>
          n.published &&
          (n.title.toLowerCase().includes(q) ||
            n.subtitle.toLowerCase().includes(q) ||
            n.content.toLowerCase().includes(q) ||
            n.category.toLowerCase().includes(q))
      )
      .slice(0, 5);

    const blog = this.data.blog
      .filter(
        (b) =>
          b.published &&
          (b.title.toLowerCase().includes(q) ||
            b.content.toLowerCase().includes(q) ||
            b.author.toLowerCase().includes(q) ||
            b.category.toLowerCase().includes(q))
      )
      .slice(0, 5);

    return { research, news, blog };
  }

  // --- Platform Statistics & Audit ---
  getStats(): PlatformStats {
    const totalResearch = this.data.projects.length;
    const activeResearch = this.data.projects.filter((p) => p.status === 'PUBLISHED').length;
    const closedResearch = this.data.projects.filter((p) => p.status === 'CLOSED').length;
    const totalResponses = this.data.responses.length;

    const oneWeekAgo = Date.now() - 7 * 24 * 3600000;
    const oneMonthAgo = Date.now() - 30 * 24 * 3600000;

    const responsesThisWeek = this.data.responses.filter((r) => new Date(r.submittedAt).getTime() >= oneWeekAgo).length;
    const responsesThisMonth = this.data.responses.filter((r) => new Date(r.submittedAt).getTime() >= oneMonthAgo).length;

    const completed = this.data.responses.filter((r) => r.status === 'COMPLETED').length;
    const avgCompletionRate = totalResponses > 0 ? Math.round((completed / totalResponses) * 100) : 100;

    const publishedNews = this.data.news.filter((n) => n.published).length;
    const publishedBlogs = this.data.blog.filter((b) => b.published).length;

    return {
      totalResearch,
      activeResearch,
      closedResearch,
      totalResponses,
      responsesThisWeek,
      responsesThisMonth,
      avgCompletionRate,
      publishedNews,
      publishedBlogs,
    };
  }

  getAuditLogs(limit = 20): AuditLog[] {
    return this.data.auditLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  private logAction(
    user: UserProfile,
    action: string,
    entityType: AuditLog['entityType'],
    entityId: string,
    details: string
  ) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action,
      entityType,
      entityId,
      details,
      timestamp: new Date().toISOString(),
    };
    this.data.auditLogs.unshift(log);
  }
}

export const db = new Database();
