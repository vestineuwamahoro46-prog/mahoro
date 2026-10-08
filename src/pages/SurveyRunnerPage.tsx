import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, AlertCircle, Loader2, ShieldCheck, Send, RotateCcw, Users, Phone, ArrowUpRight } from 'lucide-react';
import { api } from '../lib/api.js';
import type { ResearchProject, ResearchSection, ResearchQuestion } from '../types/research.js';
import { QuestionRenderer } from '../components/research/QuestionRenderer.js';

interface SurveyRunnerPageProps {
  projectId: string;
  navigate: (path: string) => void;
}

export const SurveyRunnerPage: React.FC<SurveyRunnerPageProps> = ({ projectId, navigate }) => {
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedResponseId, setSubmittedResponseId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());

  // Load project details
  useEffect(() => {
    setLoading(true);
    api.getResearchById(projectId)
      .then((data) => {
        setProject(data);
        // Load any saved draft answers from sessionStorage
        try {
          const saved = sessionStorage.getItem(`survey_draft_${data.id}`);
          if (saved) {
            setAnswers(JSON.parse(saved));
          }
        } catch {}
      })
      .catch((err) => setError(err.message || 'Failed to load survey questionnaire.'))
      .finally(() => setLoading(false));
  }, [projectId]);

  // Save answers to sessionStorage
  const handleAnswerChange = (questionId: string, val: any) => {
    const updated = { ...answers, [questionId]: val };
    setAnswers(updated);
    if (project) {
      try {
        sessionStorage.setItem(`survey_draft_${project.id}`, JSON.stringify(updated));
      } catch {}
    }
    // Clear error for this question if any
    if (validationErrors[questionId]) {
      const errs = { ...validationErrors };
      delete errs[questionId];
      setValidationErrors(errs);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs">Preparing questionnaire engine...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
        <h2 className="text-xl font-serif font-semibold text-stone-900">Survey Unavailable</h2>
        <p className="text-xs text-stone-600">{error || 'This questionnaire cannot be loaded at this time.'}</p>
        <button
          onClick={() => navigate('/research')}
          className="px-4 py-2 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md"
        >
          Return to Research Directory
        </button>
      </div>
    );
  }

  const sections = project.sections || [];
  const totalSections = sections.length > 0 ? sections.length : 1;
  const currentSection = sections[currentSectionIndex] || {
    id: 'default',
    title: 'General Questionnaire',
    order: 1,
  };

  // Evaluate conditional logic to determine which questions are visible
  const isQuestionVisible = (q: ResearchQuestion): boolean => {
    if (!q.logic || q.logic.length === 0) return true;

    for (const rule of q.logic) {
      const sourceAnswer = answers[rule.sourceQuestionId];

      let conditionMet = false;
      if (rule.operator === 'equals') {
        conditionMet = sourceAnswer === rule.value;
      } else if (rule.operator === 'not_equals') {
        conditionMet = sourceAnswer !== undefined && sourceAnswer !== rule.value;
      } else if (rule.operator === 'contains') {
        if (Array.isArray(sourceAnswer)) {
          conditionMet = sourceAnswer.includes(rule.value);
        } else if (typeof sourceAnswer === 'string') {
          conditionMet = sourceAnswer.includes(rule.value);
        }
      } else if (rule.operator === 'is_empty') {
        conditionMet = sourceAnswer === undefined || sourceAnswer === null || sourceAnswer === '';
      } else if (rule.operator === 'is_not_empty') {
        conditionMet = sourceAnswer !== undefined && sourceAnswer !== null && sourceAnswer !== '';
      }

      if (rule.action === 'show' && !conditionMet) return false;
      if (rule.action === 'skip' && conditionMet) return false;
    }

    return true;
  };

  // Filter questions for the current section
  const currentSectionQuestions = (project.questions || [])
    .filter((q) => q.sectionId === currentSection.id && q.active)
    .filter(isQuestionVisible)
    .sort((a, b) => a.order - b.order);

  // Validate current section before next
  const validateCurrentSection = (): boolean => {
    const errors: Record<string, string> = {};

    for (const q of currentSectionQuestions) {
      if (q.required) {
        const val = answers[q.id];
        if (val === undefined || val === null || val === '') {
          errors[q.id] = 'This question is required.';
        } else if (Array.isArray(val) && val.length === 0) {
          errors[q.id] = 'Please select at least one option.';
        }
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleNext = () => {
    if (!validateCurrentSection()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentSectionIndex < totalSections - 1) {
      setCurrentSectionIndex((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentSectionIndex > 0) {
      setCurrentSectionIndex((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Final submission
  const handleSubmit = async () => {
    if (!validateCurrentSection()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    const durationSeconds = Math.round((Date.now() - startTime) / 1000);

    const payloadAnswers = Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value,
    }));

    try {
      const res = await api.submitSurveyResponse(project.id, {
        consentGiven: true,
        answers: payloadAnswers,
        durationSeconds,
      });

      // Clear draft
      try {
        sessionStorage.removeItem(`survey_draft_${project.id}`);
      } catch {}

      setSubmittedResponseId(res.responseId);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      alert(err.message || 'Failed to submit response. Please retry.');
    } finally {
      setSubmitting(false);
    }
  };

  // Calculation of percentage completion
  const progressPercent = Math.round(((currentSectionIndex + 1) / totalSections) * 100);

  // Submission Complete View
  if (submittedResponseId) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider text-emerald-700 font-semibold font-mono">
            Submission Confirmed · Reference ID: {submittedResponseId}
          </span>
          <h1 className="text-3xl font-serif font-semibold text-stone-950">
            Thank You for Contributing Evidence
          </h1>
          <p className="text-stone-600 text-sm max-w-lg mx-auto leading-relaxed">
            Your responses to <strong className="text-stone-900">{project.title}</strong> have been safely encrypted and added to the research dataset.
          </p>
        </div>

        <div className="p-6 bg-stone-50 rounded-xl border border-stone-200 max-w-lg mx-auto text-xs text-stone-600 text-left space-y-2">
          <div className="flex items-center gap-2 text-stone-900 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Respondent Confidentiality Guarantee</span>
          </div>
          <p>
            Your responses are anonymous and will be aggregated with peer institutional submissions to inform academic publications and supervisory recommendations in Rwanda.
          </p>
          <div className="pt-2 text-[11px] text-stone-500 font-mono">
            Lead Investigator: {project.researcherName} ({project.researcherInstitution})
          </div>
        </div>

        {/* Post-Survey WhatsApp Discovery & Discussion Invite */}
        <div className="p-6 bg-emerald-950 text-emerald-50 rounded-xl border border-emerald-800 max-w-lg mx-auto text-left space-y-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-emerald-400 font-semibold font-mono">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Join Peer Discourse & Discoveries</span>
          </div>

          <h3 className="text-sm font-serif font-bold text-white">
            Discuss What We Are Discovering in this Study
          </h3>

          <p className="text-xs text-emerald-200 leading-relaxed">
            Have questions, feedback, or ideas? Join our dedicated research WhatsApp group to discuss empirical findings with fellow compliance officers and researchers, or contact coordinator <strong className="text-white">Uwamahoro</strong> directly.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <a
              href="https://chat.whatsapp.com/Hzbfazseoin1hSmXEPGaNK"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2 px-3 text-center text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <span>Join WhatsApp Group</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>

            <a
              href="https://wa.me/250733711513"
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 text-center text-xs font-medium text-emerald-200 hover:text-white bg-emerald-900 border border-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Uwamahoro</span>
            </a>
          </div>
        </div>

        <div className="pt-4 flex flex-wrap justify-center gap-4">
          <button
            onClick={() => navigate('/research')}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors cursor-pointer"
          >
            Explore Other Research Studies
          </button>
          <button
            onClick={() => navigate('/blog')}
            className="px-6 py-2.5 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 rounded-md transition-colors cursor-pointer border border-stone-300"
          >
            Read Research Publications & Essays
          </button>
        </div>
      </div>
    );
  }

  const isLastSection = currentSectionIndex === totalSections - 1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Breadcrumb */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <button
          onClick={() => navigate(`/research/${project.slug || project.id}`)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit Survey</span>
        </button>
        <span className="text-xs text-stone-500 font-medium">
          {project.category}
        </span>
      </div>

      {/* Progress Header */}
      <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
          <span className="font-semibold text-stone-900">
            Page {currentSectionIndex + 1} of {totalSections}
          </span>
          <span className="tabular-nums font-mono text-stone-500">
            {progressPercent}% completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
          <div
            className="bg-stone-900 h-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Current Section Title and Description */}
        <div className="pt-2">
          <h2 className="text-xl sm:text-2xl font-serif font-semibold text-stone-950">
            {currentSection.title}
          </h2>
          {currentSection.description && (
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              {currentSection.description}
            </p>
          )}
        </div>
      </div>

      {/* Validation alert banner if errors exist */}
      {Object.keys(validationErrors).length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 flex items-start gap-3 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Please answer all required questions before proceeding:</span>
            <span>You have {Object.keys(validationErrors).length} incomplete required question(s) in this section.</span>
          </div>
        </div>
      )}

      {/* Questions List in Current Section */}
      <div className="space-y-6">
        {currentSectionQuestions.map((question, index) => {
          const hasError = !!validationErrors[question.id];

          return (
            <div
              key={question.id}
              className={`bg-white rounded-xl border p-6 transition-all shadow-2xs ${
                hasError ? 'border-rose-400 ring-1 ring-rose-200' : 'border-stone-200'
              }`}
            >
              <div className="mb-4">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-base font-medium text-stone-900 leading-snug">
                    <span className="font-mono text-xs text-stone-400 mr-2">
                      Q{index + 1}.
                    </span>
                    {question.text}
                    {question.required && (
                      <span className="text-rose-600 font-bold ml-1" title="Required">*</span>
                    )}
                  </h3>
                </div>

                {question.description && (
                  <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
                    {question.description}
                  </p>
                )}
              </div>

              {/* Render Question Input Control */}
              <QuestionRenderer
                question={question}
                value={answers[question.id]}
                onChange={(val) => handleAnswerChange(question.id, val)}
                error={validationErrors[question.id]}
              />
            </div>
          );
        })}
      </div>

      {/* Bottom Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-stone-200">
        <button
          type="button"
          onClick={handleBack}
          disabled={currentSectionIndex === 0}
          className={`px-5 py-2.5 text-xs font-semibold rounded-lg border transition-all flex items-center gap-1.5 cursor-pointer ${
            currentSectionIndex === 0
              ? 'opacity-40 cursor-not-allowed border-stone-200 text-stone-400'
              : 'border-stone-300 bg-white hover:bg-stone-50 text-stone-800'
          }`}
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        <div className="text-xs text-stone-400 hidden sm:block">
          Answers are preserved across steps
        </div>

        {isLastSection ? (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting Response...</span>
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                <span>Submit Final Questionnaire</span>
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleNext}
            className="px-6 py-2.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <span>Next Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
