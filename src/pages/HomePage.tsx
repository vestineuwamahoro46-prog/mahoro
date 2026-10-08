import React, { useState, useEffect } from 'react';
import { ArrowRight, CheckCircle2, Shield, BookOpen, BarChart3, Users, Clock, Award, FileText, ChevronRight, Phone, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.js';
import type { ResearchProject, NewsArticle, BlogPost, PlatformStats } from '../types/research.js';
import { ResearchCard } from '../components/research/ResearchCard.js';

interface HomePageProps {
  navigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ navigate }) => {
  const [projects, setProjects] = useState<ResearchProject[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [blog, setBlog] = useState<BlogPost[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getResearchList({ status: 'PUBLISHED' }),
      api.getNewsList(),
      api.getBlogList(),
      api.getStats(),
    ])
      .then(([pList, nList, bList, sData]) => {
        setProjects(pList);
        setNews(nList.slice(0, 3));
        setBlog(bList.slice(0, 3));
        setStats(sData);
      })
      .catch((err) => console.error('Failed to load homepage data:', err))
      .finally(() => setLoading(false));
  }, []);

  const featuredProject = projects[0];

  return (
    <div className="space-y-20 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-20 lg:pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and CTAs */}
            <div className="lg:col-span-7 space-y-6">
              <div className="text-xs font-semibold tracking-wider uppercase text-stone-500 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
                <span>Rwanda & Regional Research Directorate</span>
                <span aria-hidden="true">·</span>
                <span>Empirical Survey System</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-medium text-stone-950 tracking-tight leading-[1.12] text-balance">
                Research That Turns Evidence Into Insight
              </h1>

              <p className="text-base sm:text-lg text-stone-600 max-w-xl leading-relaxed">
                Participate in research, explore findings, and discover evidence-based insights across Rwanda and beyond. Rigorous methodology engineered for academic, institutional, and compliance integrity.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => navigate('/surveys')}
                  className="px-6 py-3.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer"
                >
                  <span>Participate in Research</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => navigate('/research')}
                  className="px-6 py-3.5 text-sm font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-lg transition-all border border-stone-300 cursor-pointer"
                >
                  Explore Research
                </button>
              </div>

              {/* Research metrics preview */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-stone-200 max-w-lg text-stone-800">
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                    {stats ? stats.totalResearch : '3+'}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Active Studies</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">
                    {stats ? stats.totalResponses : '40+'}
                  </div>
                  <div className="text-xs text-stone-500 mt-0.5">Verified Responses</div>
                </div>
                <div>
                  <div className="text-2xl font-serif font-bold text-stone-950 tabular-nums">100%</div>
                  <div className="text-xs text-stone-500 mt-0.5">Anonymized Data</div>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-stone-200 bg-stone-100 aspect-4/3 lg:aspect-auto lg:h-[460px]">
                <img
                  src="/src/assets/images/research_hero_banner_1791454454189.jpg"
                  alt="AcuityResearch Evidence & Intelligence Institute"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs uppercase tracking-wider text-stone-300 font-mono">
                    Center for Financial Integrity & Legal Policy Studies
                  </span>
                  <h3 className="text-lg font-serif font-medium mt-1">
                    Kigali Academic Research Facility
                  </h3>
                  <p className="text-xs text-stone-300 mt-1">
                    Bridging empirical fieldwork, regulatory supervision, and policy reforms in Rwanda.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED RESEARCH SPOTLIGHT (Rwanda AML/CFT Study) */}
      {featuredProject && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 sm:p-10 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center gap-2 text-xs text-stone-600 font-medium">
                  <span className="text-emerald-800 font-semibold uppercase tracking-wider">Priority National Study</span>
                  <span aria-hidden="true">·</span>
                  <span>{featuredProject.category}</span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5" />
                    {featuredProject.estimatedTime}
                  </span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-serif font-semibold text-stone-950 leading-tight">
                  {featuredProject.title}
                </h2>

                <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
                  {featuredProject.shortDescription}
                </p>

                <div className="bg-white/80 backdrop-blur-xs rounded-lg p-4 border border-stone-200/80 text-xs sm:text-sm text-stone-700 space-y-1">
                  <p>
                    <strong className="text-stone-900 font-medium">Target Respondents:</strong> {featuredProject.targetAudience}
                  </p>
                  <p>
                    <strong className="text-stone-900 font-medium">Institutional Scope:</strong> FIU / FIC, Rwanda Investigation Bureau (RIB), NPPA, BNR, RRA, Commercial Banks, and licensed VASPs.
                  </p>
                </div>

                <div className="pt-2 flex flex-wrap items-center gap-4">
                  <button
                    onClick={() => navigate(`/research/${featuredProject.slug || featuredProject.id}`)}
                    className="px-5 py-2.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-all shadow-xs flex items-center gap-2 cursor-pointer"
                  >
                    <span>Read Overview & Participate</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => navigate(`/survey/${featuredProject.id}`)}
                    className="px-5 py-2.5 text-sm font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-md transition-all cursor-pointer"
                  >
                    Start Survey Directly
                  </button>
                </div>
              </div>

              {/* Researcher Lead Card */}
              <div className="lg:col-span-4 bg-white rounded-xl p-6 border border-stone-200 shadow-xs space-y-4 text-center sm:text-left flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-4">
                  <img
                    src="/src/assets/images/researcher_mahoro_cesar_1791454468697.jpg"
                    alt="MAHORO Cesar - Lead Researcher"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover border-2 border-stone-300"
                  />
                  <div>
                    <h3 className="text-base font-serif font-bold text-stone-950">MAHORO Cesar</h3>
                    <p className="text-xs text-stone-600 font-medium">Lead Investigator & AML/CFT Specialist</p>
                    <p className="text-[11px] text-stone-500">Center for Financial Integrity, Kigali</p>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed italic">
                  "Empirical practitioner insights are essential to diagnosing evidentiary bottlenecks in financial crime litigation and calibrating Rwanda's AML/CFT supervision."
                </p>

                <div className="w-full pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span>Peer-Reviewed Study</span>
                  <span className="text-emerald-700 font-medium">Verified Investigator</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. ACTIVE RESEARCH & SURVEYS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
              Survey Repository
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-950 mt-1">
              Active Research Studies & Surveys
            </h2>
          </div>
          <button
            onClick={() => navigate('/research')}
            className="text-xs font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Research Projects</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((proj) => (
            <ResearchCard
              key={proj.id}
              project={proj}
              onSelect={(p) => navigate(`/research/${p.slug || p.id}`)}
              onStartSurvey={(p) => navigate(`/survey/${p.id}`)}
            />
          ))}
        </div>
      </section>

      {/* 4. WHY PARTICIPATE? (Institutional Rigor Section) */}
      <section className="bg-white border-y border-stone-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
              Methodological Standards
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-stone-950 mt-1">
              Why Participate in AcuityResearch Studies?
            </h2>
            <p className="text-stone-600 text-sm mt-2 leading-relaxed">
              Our questionnaires are engineered for verified compliance practitioners and institutional stakeholders. Every study adheres to international ethical charters and data privacy mandates.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-lg border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Zero Attribution & Strict Anonymity</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Individual respondent names, reporting entity identities, and internal data are decoupled from analytical submissions. Reports present only aggregated sector findings.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Direct Policy Impact</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Findings are shared directly with national supervisory bodies (BNR, RRA, FIC) and parliamentary committees to address regulatory friction and resource constraints.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-stone-200 bg-stone-50/50 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-stone-900 text-white flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-stone-900">Open Access Findings</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Participating institutions gain priority access to summarized executive briefings, cross-institutional benchmarks, and international comparative analyses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LATEST REGULATORY NEWS & LATEST BLOG ARTICLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* News Grid */}
        <div className="space-y-6">
          <div className="flex items-end justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                Official Updates
              </span>
              <h2 className="text-2xl font-serif font-medium text-stone-950">
                Latest Regulatory News
              </h2>
            </div>
            <button
              onClick={() => navigate('/news')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
            >
              <span>All News</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {news.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/news/${item.slug || item.id}`)}
                className="bg-white rounded-lg border border-stone-200 overflow-hidden hover:border-stone-400 transition-all cursor-pointer flex flex-col group"
              >
                <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                  <img
                    src={item.featuredImage}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                  />
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="text-xs text-stone-500 mb-1">
                      <span>{item.category}</span>
                      <span className="mx-1.5" aria-hidden="true">·</span>
                      <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                    </div>
                    <h3 className="text-base font-serif font-semibold text-stone-900 group-hover:text-stone-700 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-2">
                      {item.subtitle || item.content}
                    </p>
                  </div>
                  <div className="text-xs font-medium text-stone-800 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Blog / Insights Grid */}
        <div className="space-y-6 pt-6 border-t border-stone-200">
          <div className="flex items-end justify-between border-b border-stone-200 pb-3">
            <div>
              <span className="text-xs uppercase tracking-wider text-stone-500 font-semibold block">
                Research Monograph & Analysis
              </span>
              <h2 className="text-2xl font-serif font-medium text-stone-950">
                Latest Research Articles & Essays
              </h2>
            </div>
            <button
              onClick={() => navigate('/blog')}
              className="text-xs font-semibold text-stone-700 hover:text-stone-950 flex items-center gap-1 cursor-pointer"
            >
              <span>All Essays</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blog.map((post) => (
              <div
                key={post.id}
                onClick={() => navigate(`/blog/${post.slug || post.id}`)}
                className="bg-white rounded-lg border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-400 transition-all cursor-pointer group"
              >
                <div>
                  <div className="text-xs text-stone-500 mb-2">
                    <span className="font-medium text-stone-700">{post.category}</span>
                    <span className="mx-1.5" aria-hidden="true">·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="text-lg font-serif font-semibold text-stone-900 group-hover:text-stone-700 leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-3 mt-2 leading-relaxed">
                    {post.content.replace(/#+/g, '').slice(0, 150)}...
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <div className="flex items-center gap-2">
                    {post.authorImage ? (
                      <img
                        src={post.authorImage}
                        alt={post.author}
                        referrerPolicy="no-referrer"
                        className="w-5 h-5 rounded-full object-cover"
                      />
                    ) : null}
                    <span className="font-medium text-stone-800">{post.author}</span>
                  </div>
                  <span className="group-hover:text-stone-900 flex items-center gap-1 font-medium">
                    Read Essay <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. WHATSAPP RESEARCH DISCOURSE & COORDINATOR COMMUNITY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-950 text-emerald-50 rounded-2xl p-8 sm:p-12 border border-emerald-800 shadow-sm relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Interactive Research Community</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white leading-tight">
                Discuss Research Discoveries & Share Feedback
              </h2>

              <p className="text-sm text-emerald-200 leading-relaxed max-w-2xl">
                We believe empirical research is strengthened through active peer dialogue. Join our official WhatsApp group to discuss what we are discovering across Rwandan institutions, or reach out directly to research coordinator <strong className="text-white">Uwamahoro</strong> with any question or idea.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="https://chat.whatsapp.com/Hzbfazseoin1hSmXEPGaNK"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
                >
                  <Users className="w-4 h-4 text-emerald-200" />
                  <span>Join WhatsApp Research Group</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="https://wa.me/250733711513"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 text-xs font-medium text-emerald-100 hover:text-white bg-emerald-900 hover:bg-emerald-850 border border-emerald-700/80 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-emerald-300" />
                  <span>Chat with Uwamahoro: +250 733 711 513</span>
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 bg-emerald-900/60 p-6 rounded-xl border border-emerald-700/60 text-xs text-emerald-200 space-y-3">
              <div className="font-serif font-semibold text-white text-sm">
                Peer Forum Guidelines
              </div>
              <p className="leading-relaxed">
                The discourse group welcomes AML compliance officers, regulatory examiners, legal scholars, and financial investigators to debate empirical findings while safeguarding respondent anonymity.
              </p>
              <div className="pt-2 border-t border-emerald-800 text-[11px] text-emerald-300 font-mono">
                Direct WhatsApp Hotline: +250 733 711 513
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. ABOUT THE PLATFORM & CONTACT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-stone-200 rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-2xl space-y-4">
            <span className="text-xs uppercase tracking-wider text-stone-400 font-semibold block">
              Institutional Partnership
            </span>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-white">
              Commission or Collaborate on Academic & Policy Studies
            </h2>
            <p className="text-sm text-stone-300 leading-relaxed">
              AcuityResearch designs customized dynamic survey frameworks, forensic compliance questionnaires, and econometric evaluations for regulatory bodies, commercial banks, multilateral agencies, and universities.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/contact')}
                className="px-5 py-2.5 text-xs font-semibold text-stone-900 bg-white hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
              >
                Contact Research Directorate
              </button>
              <button
                onClick={() => navigate('/about')}
                className="px-5 py-2.5 text-xs font-medium text-stone-300 hover:text-white border border-stone-700 hover:border-stone-500 rounded-md transition-colors cursor-pointer"
              >
                Learn About Our Methodology
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
