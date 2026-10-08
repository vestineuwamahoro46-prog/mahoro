import React, { useState, useEffect } from 'react';
import {
  Download,
  Filter,
  BarChart3,
  Users,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Search,
  Loader2,
  Calendar,
  Share2,
  Printer
} from 'lucide-react';
import { api } from '../../lib/api.js';

interface AdminResultsPageProps {
  id: string;
  navigate: (path: string) => void;
}

export const AdminResultsPage: React.FC<AdminResultsPageProps> = ({ id, navigate }) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Demographic cross-tab filters (Section 9 requirement!)
  const [institutionFilter, setInstitutionFilter] = useState('ALL');
  const [experienceFilter, setExperienceFilter] = useState('ALL');
  const [provinceFilter, setProvinceFilter] = useState('ALL');
  const [textSearch, setTextSearch] = useState('');

  const loadAnalytics = () => {
    setLoading(true);
    api.getResults(id, {
      institutionCategory: institutionFilter === 'ALL' ? undefined : institutionFilter,
      experience: experienceFilter === 'ALL' ? undefined : experienceFilter,
      province: provinceFilter === 'ALL' ? undefined : provinceFilter,
    })
      .then((res) => setData(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadAnalytics();
  }, [id, institutionFilter, experienceFilter, provinceFilter]);

  const handleExportCsv = () => {
    window.location.href = api.getExportUrl(id);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading && !data) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs">Computing statistical aggregations and charts...</span>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-16 text-center text-xs text-stone-500">
        Analytics unavailable for this study.
      </div>
    );
  }

  const { project, summary, dailyTrends, questionsBreakdown } = data;

  return (
    <div className="space-y-8 print:p-0">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/research')}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded cursor-pointer print:hidden"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-mono text-stone-500 uppercase">
              Statistical Intelligence Report · {project.category}
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-stone-900 leading-tight">
              {project.title}
            </h1>
          </div>
        </div>

        {/* Export & Actions (Section 10 requirement!) */}
        <div className="flex items-center gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-stone-700 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Results (CSV)</span>
          </button>
        </div>
      </div>

      {/* Demographic Cross-Tab Filtering Ribbon (Section 9) */}
      <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs space-y-3 print:hidden">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-600">
          <Filter className="w-3.5 h-3.5" />
          <span>Cross-Tab Demographic Segmentation Filter</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-[11px] text-stone-500 block mb-1">Institution Category</label>
            <select
              value={institutionFilter}
              onChange={(e) => setInstitutionFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none"
            >
              <option value="ALL">All Reporting Sectors</option>
              <option value="commercial_bank">Commercial Banks</option>
              <option value="microfinance">Microfinance Institutions</option>
              <option value="insurance_capital">Insurance & Capital Markets</option>
              <option value="vasp">Licensed VASPs</option>
              <option value="bnr">National Bank of Rwanda (BNR)</option>
              <option value="rra">Rwanda Revenue Authority (RRA)</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-stone-500 block mb-1">AML Experience</label>
            <select
              value={experienceFilter}
              onChange={(e) => setExperienceFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none"
            >
              <option value="ALL">All Experience Tiers</option>
              <option value="under_2">Less than 2 years</option>
              <option value="2_5">2–5 years</option>
              <option value="5_10">5–10 years</option>
              <option value="over_10">More than 10 years</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] text-stone-500 block mb-1">Geographic Region</label>
            <select
              value={provinceFilter}
              onChange={(e) => setProvinceFilter(e.target.value)}
              className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none"
            >
              <option value="ALL">All Provinces</option>
              <option value="kigali">Kigali City</option>
              <option value="southern">Southern Province</option>
              <option value="northern">Northern Province</option>
              <option value="eastern">Eastern Province</option>
              <option value="western">Western Province</option>
            </select>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Total Respondents</div>
          <div className="text-3xl font-serif font-bold text-stone-950 mt-1 tabular-nums">
            {summary.totalResponses}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">100% verified</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Completed Submissions</div>
          <div className="text-3xl font-serif font-bold text-emerald-700 mt-1 tabular-nums">
            {summary.completedResponses}
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Full questionnaire passed</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Completion Rate</div>
          <div className="text-3xl font-serif font-bold text-stone-950 mt-1 tabular-nums">
            {summary.completionRate}%
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Low respondent fatigue</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-2xs">
          <div className="text-xs text-stone-500 font-medium">Avg. Completion Time</div>
          <div className="text-3xl font-serif font-bold text-stone-950 mt-1 tabular-nums">
            {summary.avgDurationMinutes}m
          </div>
          <div className="text-[11px] text-stone-500 mt-1 font-mono">Target: 8–10 min</div>
        </div>
      </div>

      {/* Response Trends Over Time Chart (Section 9 & 24) */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-serif font-semibold text-stone-900">
            Daily Response Ingestion (Past 14 Days)
          </h2>
          <span className="text-[11px] font-mono text-stone-500">Live Timestamped</span>
        </div>

        <div className="h-40 flex items-end gap-2 pt-4 border-b border-stone-200">
          {dailyTrends.map((d: any, idx: number) => {
            const maxCount = Math.max(...dailyTrends.map((t: any) => t.count), 1);
            const heightPercent = Math.max((d.count / maxCount) * 100, 6);
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="opacity-0 group-hover:opacity-100 absolute -top-7 text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded font-mono transition-opacity">
                  {d.count}
                </div>
                <div
                  className="w-full bg-stone-800 group-hover:bg-stone-950 rounded-t transition-all"
                  style={{ height: `${heightPercent}%` }}
                />
                <span className="text-[9px] text-stone-400 font-mono rotate-45 sm:rotate-0 mt-1">
                  {d.date.slice(5)}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Question-by-Question Deep Statistical Analysis */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
          <h2 className="text-lg font-serif font-semibold text-stone-900">
            Question-by-Question Distribution Analysis
          </h2>
          <span className="text-xs text-stone-500 font-mono">
            {questionsBreakdown.length} questions evaluated
          </span>
        </div>

        <div className="space-y-6">
          {questionsBreakdown.map((item: any, idx: number) => (
            <div
              key={item.questionId}
              className="bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block">
                    Item {idx + 1} · {item.type.replace('_', ' ')}
                  </span>
                  <h3 className="text-base font-medium text-stone-900 mt-0.5 leading-snug">
                    {item.text}
                  </h3>
                </div>
                <span className="text-xs font-mono text-stone-600 bg-stone-100 px-2.5 py-1 rounded shrink-0">
                  n = {item.answeredCount} responses
                </span>
              </div>

              {/* Multiple Choice / Single Choice Breakdown Bar Charts */}
              {item.distribution && ['single_choice', 'multiple_choice', 'dropdown', 'yes_no'].includes(item.type) && (
                <div className="space-y-2.5 pt-2">
                  {item.distribution.map((dist: any) => (
                    <div key={dist.key} className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-stone-700">
                        <span className="font-medium truncate max-w-md">{dist.label}</span>
                        <span className="font-mono tabular-nums text-stone-500 shrink-0 ml-2">
                          {dist.count} ({dist.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-stone-900 h-full rounded-full transition-all"
                          style={{ width: `${dist.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Likert Scale & Rating Averages and Score Distributions */}
              {item.average && (
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-lg border border-stone-200">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold block">
                        Composite Average Score
                      </span>
                      <span className="text-2xl font-serif font-bold text-stone-900 tabular-nums">
                        {item.average} <span className="text-xs font-normal text-stone-500">/ 5.00</span>
                      </span>
                    </div>
                    <div className="flex-1 text-xs text-stone-600 border-l border-stone-200 pl-4">
                      {Number(item.average) >= 3.8
                        ? 'Strong consensus / Elevated perceived risk'
                        : Number(item.average) <= 2.5
                        ? 'Low consensus / Deficient perceived effectiveness'
                        : 'Moderate / Divided practitioner perception'}
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center text-xs">
                    {item.distribution.map((d: any) => (
                      <div key={d.score} className="p-2 bg-stone-50 rounded border border-stone-100">
                        <div className="font-mono font-bold text-stone-900">{d.score}★</div>
                        <div className="font-mono text-[11px] text-stone-500">{d.percentage}%</div>
                        <div className="text-[9px] text-stone-400">{d.count} resps</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Qualitative Text Responses Table */}
              {item.textSamples && (
                <div className="space-y-2 pt-2">
                  <span className="text-xs font-semibold text-stone-700 block">
                    Recorded Qualitative Observations:
                  </span>
                  {item.textSamples.length === 0 ? (
                    <p className="text-xs text-stone-400 italic">No text remarks submitted yet.</p>
                  ) : (
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {item.textSamples.map((text: string, tIdx: number) => (
                        <div
                          key={tIdx}
                          className="p-3 bg-stone-50 rounded-lg border border-stone-100 text-xs text-stone-700 leading-relaxed font-serif italic"
                        >
                          "{text}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
