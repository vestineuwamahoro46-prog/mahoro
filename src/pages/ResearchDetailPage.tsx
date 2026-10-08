import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, ShieldCheck, Users, Building2, CheckSquare, Square, ArrowRight, Loader2, Award, AlertCircle, Phone, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.js';
import type { ResearchProject } from '../types/research.js';

interface ResearchDetailPageProps {
  idOrSlug: string;
  navigate: (path: string) => void;
}

export const ResearchDetailPage: React.FC<ResearchDetailPageProps> = ({ idOrSlug, navigate }) => {
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [consentAgreed, setConsentAgreed] = useState(false);
  const [consentError, setConsentError] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getResearchById(idOrSlug)
      .then((data) => {
        setProject(data);
        if (!data.requiresConsent) {
          setConsentAgreed(true);
        }
      })
      .catch((err) => setError(err.message || 'Failed to load research project.'))
      .finally(() => setLoading(false));
  }, [idOrSlug]);

  const handleStartSurvey = () => {
    if (project?.requiresConsent && !consentAgreed) {
      setConsentError(true);
      return;
    }
    navigate(`/survey/${project?.id}`);
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs">Loading study details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-serif font-semibold text-stone-900">Study Not Found</h2>
        <p className="text-xs text-stone-600">{error || 'This research project is unavailable.'}</p>
        <button
          onClick={() => navigate('/research')}
          className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md"
        >
          Return to Research Directory
        </button>
      </div>
    );
  }

  const isClosed = project.status === 'CLOSED';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Back button */}
      <button
        onClick={() => navigate('/research')}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to All Research Studies</span>
      </button>

      {/* Main Header Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-10 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
          <span className="font-semibold text-stone-800">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-stone-400" />
            <span>Estimated time: {project.estimatedTime}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className={isClosed ? 'text-amber-700 font-medium' : 'text-emerald-700 font-medium'}>
            Status: {project.status === 'PUBLISHED' ? 'Active / Accepting Submissions' : project.status}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-950 leading-tight">
          {project.title}
        </h1>

        <p className="text-base text-stone-700 leading-relaxed max-w-3xl">
          {project.description || project.shortDescription}
        </p>

        {/* Lead Investigator & Institutional Affiliation Box */}
        <div className="pt-6 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            {project.researcherImage ? (
              <img
                src={project.researcherImage}
                alt={project.researcherName}
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-full object-cover border border-stone-300 shrink-0"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-stone-200 text-stone-700 font-serif font-bold flex items-center justify-center shrink-0">
                {project.researcherName.slice(0, 2)}
              </div>
            )}
            <div>
              <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">
                Principal Investigator
              </span>
              <h3 className="text-base font-serif font-bold text-stone-900">
                {project.researcherName}
              </h3>
              <p className="text-xs text-stone-600">{project.researcherRole}</p>
              <p className="text-[11px] text-stone-500 mt-0.5">{project.researcherInstitution}</p>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-1.5 text-xs text-stone-700">
            <span className="text-[11px] text-stone-500 uppercase tracking-wider block font-semibold">
              Target Respondents & Scope
            </span>
            <p className="font-medium text-stone-900">{project.targetAudience}</p>
            <p className="text-stone-500 text-[11px] leading-relaxed">
              Supervisors (BNR, RRA), Law Enforcement & Intelligence (FIC, RIB), and private reporting entities.
            </p>
          </div>
        </div>

        {/* WhatsApp Inquiry & Community Discourse Banner */}
        <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
          <div className="space-y-0.5">
            <span className="text-xs font-semibold text-emerald-950 flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-emerald-700" />
              <span>Questions or Ideas about this Study? Contact Coordinator Uwamahoro</span>
            </span>
            <p className="text-[11px] text-emerald-800">
              Direct WhatsApp: <strong className="font-mono text-emerald-950">+250 733 711 513</strong> · Or join our active research findings discourse group.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href="https://wa.me/250733711513"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[11px] font-semibold text-emerald-900 bg-white hover:bg-emerald-100/80 border border-emerald-300 rounded-md transition-colors"
            >
              WhatsApp Uwamahoro
            </a>
            <a
              href="https://chat.whatsapp.com/Hzbfazseoin1hSmXEPGaNK"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-[11px] font-semibold text-white bg-emerald-700 hover:bg-emerald-600 rounded-md transition-colors flex items-center gap-1 shadow-xs"
            >
              <span>Join WhatsApp Group</span>
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Purpose & Background Detailed Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
          <h2 className="text-lg font-serif font-semibold text-stone-900">
            Research Purpose & Objectives
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {project.purpose}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-stone-200 p-6 space-y-3">
          <h2 className="text-lg font-serif font-semibold text-stone-900">
            Institutional Background
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            {project.background}
          </p>
        </div>
      </div>

      {/* Confidentiality & Data-Use Statement */}
      <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 sm:p-8 space-y-6">
        <div>
          <h2 className="text-lg font-serif font-semibold text-stone-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Confidentiality, Privacy & Data Use Protocol</span>
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            This study complies with Rwandan academic data governance standards and international survey protection protocols.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-stone-700">
          <div className="space-y-1 bg-white p-4 rounded-lg border border-stone-200">
            <h3 className="font-semibold text-stone-900">Confidentiality Statement</h3>
            <p className="leading-relaxed text-stone-600">
              {project.confidentialityStatement}
            </p>
          </div>
          <div className="space-y-1 bg-white p-4 rounded-lg border border-stone-200">
            <h3 className="font-semibold text-stone-900">Scientific Data Use</h3>
            <p className="leading-relaxed text-stone-600">
              {project.dataUseStatement}
            </p>
          </div>
        </div>

        {/* Required Informed Consent Statement */}
        {project.requiresConsent && (
          <div className={`pt-6 border-t border-stone-200 space-y-3 p-4 rounded-lg transition-colors ${consentError ? 'bg-rose-50 border border-rose-300' : 'bg-white border border-stone-300'}`}>
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={consentAgreed}
                onChange={(e) => {
                  setConsentAgreed(e.target.checked);
                  if (e.target.checked) setConsentError(false);
                }}
                className="mt-1 w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
              />
              <span className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                <strong className="font-semibold text-stone-900">Research Informed Consent Notice:</strong>{' '}
                "I understand the purpose of this research and voluntarily agree to participate. I understand that my responses may be used for research purposes and that personal information will be handled according to the research project's privacy policy."
              </span>
            </label>
            {consentError && (
              <p className="text-xs text-rose-600 flex items-center gap-1 font-medium pl-7">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>You must agree to the research consent notice before proceeding to the survey questionnaire.</span>
              </p>
            )}
          </div>
        )}

        {/* Start Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
          <div className="text-xs text-stone-500">
            <span>Questionnaire Length: ~{project.questions?.length || 25} items</span>
            <span className="mx-2">·</span>
            <span>Progress automatically saved</span>
          </div>

          {!isClosed ? (
            <button
              onClick={handleStartSurvey}
              className="px-8 py-3.5 text-sm font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Begin Survey Questionnaire</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="text-xs text-amber-800 font-medium bg-amber-50 px-4 py-2.5 rounded-lg border border-amber-200">
              This research project has officially concluded response collection.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
