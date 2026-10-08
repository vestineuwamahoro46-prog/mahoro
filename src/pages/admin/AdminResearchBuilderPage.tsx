import React, { useState, useEffect } from 'react';
import {
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
  Eye,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  HelpCircle,
  Layers,
  ArrowLeft,
  X
} from 'lucide-react';
import { api } from '../../lib/api.js';
import type {
  ResearchProject,
  ResearchSection,
  ResearchQuestion,
  QuestionType,
  QuestionOption,
  QuestionLogic
} from '../../types/research.js';
import { QuestionRenderer } from '../../components/research/QuestionRenderer.js';

interface AdminResearchBuilderPageProps {
  id: string; // 'new' or existing id
  navigate: (path: string) => void;
}

export const AdminResearchBuilderPage: React.FC<AdminResearchBuilderPageProps> = ({ id, navigate }) => {
  const isNew = id === 'new';
  const [project, setProject] = useState<ResearchProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Selected item state
  const [selectedSectionId, setSelectedSectionId] = useState<string>('');
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('');

  // Live preview modal state
  const [previewOpen, setPreviewOpen] = useState(false);

  // Load project
  useEffect(() => {
    if (isNew) {
      // Create draft project immediately
      api.createResearch({
        title: 'New Empirical Study',
        category: 'Financial Crime & Legal Policy',
        shortDescription: 'Research questionnaire investigating institutional and regulatory practices.',
        estimatedTime: '8–10 minutes',
        status: 'DRAFT',
      })
        .then((created) => {
          setProject(created);
          setSelectedSectionId(created.sections?.[0]?.id || '');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(true);
      api.getResearchById(id)
        .then((data) => {
          setProject(data);
          if (data.sections && data.sections.length > 0) {
            setSelectedSectionId(data.sections[0].id);
          }
          if (data.questions && data.questions.length > 0) {
            setSelectedQuestionId(data.questions[0].id);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [id, isNew]);

  if (loading || !project) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-stone-400 gap-3">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="text-xs">Loading research questionnaire builder...</span>
      </div>
    );
  }

  const sections = project.sections || [];
  const questions = project.questions || [];

  const selectedQuestion = questions.find((q) => q.id === selectedQuestionId);
  const currentSectionQuestions = questions
    .filter((q) => q.sectionId === selectedSectionId && q.active)
    .sort((a, b) => a.order - b.order);

  // --- Handlers: Project Level ---
  const handleProjectMetaChange = (field: keyof ResearchProject, val: any) => {
    setProject({ ...project, [field]: val });
  };

  const saveProjectMeta = async () => {
    setSaving(true);
    try {
      const updated = await api.updateResearch(project.id, {
        title: project.title,
        category: project.category,
        shortDescription: project.shortDescription,
        description: project.description,
        purpose: project.purpose,
        background: project.background,
        targetAudience: project.targetAudience,
        estimatedTime: project.estimatedTime,
        status: project.status,
      });
      setProject({ ...project, ...updated });
    } finally {
      setSaving(false);
    }
  };

  // --- Handlers: Sections ---
  const handleAddSection = async () => {
    const title = prompt('Enter section title:', `Section ${sections.length + 1}`);
    if (!title) return;
    const newSec = await api.addSection(project.id, { title });
    const refreshed = await api.getResearchById(project.id);
    setProject(refreshed);
    setSelectedSectionId(newSec.id);
  };

  const handleDeleteSection = async (secId: string) => {
    if (sections.length <= 1) {
      alert('A research project must have at least one section.');
      return;
    }
    if (!confirm('Delete section and all its questions?')) return;
    await api.deleteSection(project.id, secId);
    const refreshed = await api.getResearchById(project.id);
    setProject(refreshed);
    setSelectedSectionId(refreshed.sections?.[0]?.id || '');
  };

  // --- Handlers: Questions ---
  const handleAddQuestion = async () => {
    const newQ = await api.addQuestion(project.id, {
      sectionId: selectedSectionId,
      text: 'New Research Question',
      type: 'single_choice',
      required: true,
      options: [
        { id: `opt-${Date.now()}-1`, text: 'Option A', value: 'opt_a', order: 1 },
        { id: `opt-${Date.now()}-2`, text: 'Option B', value: 'opt_b', order: 2 },
      ],
    });
    const refreshed = await api.getResearchById(project.id);
    setProject(refreshed);
    setSelectedQuestionId(newQ.id);
  };

  const handleUpdateQuestion = async (updates: Partial<ResearchQuestion>) => {
    if (!selectedQuestion) return;
    const updated = await api.updateQuestion(project.id, selectedQuestion.id, updates);
    setProject((prev) => {
      if (!prev) return null;
      const updatedQuestions: ResearchQuestion[] = (prev.questions || []).map((q) =>
        q.id === updated.id ? updated : q
      );
      return {
        ...prev,
        questions: updatedQuestions,
      };
    });
  };

  const handleDuplicateQuestion = async (qId: string) => {
    const dup = await api.duplicateQuestion(project.id, qId);
    const refreshed = await api.getResearchById(project.id);
    setProject(refreshed);
    setSelectedQuestionId(dup.id);
  };

  const handleDeleteQuestion = async (qId: string) => {
    if (!confirm('Delete this question?')) return;
    await api.deleteQuestion(project.id, qId);
    const refreshed = await api.getResearchById(project.id);
    setProject(refreshed);
    setSelectedQuestionId(refreshed.questions?.[0]?.id || '');
  };

  const handleMoveQuestion = async (qId: string, direction: 'up' | 'down') => {
    const sQuestions = [...currentSectionQuestions];
    const index = sQuestions.findIndex((q) => q.id === qId);
    if (index === -1) return;

    if (direction === 'up' && index > 0) {
      const temp = sQuestions[index];
      sQuestions[index] = sQuestions[index - 1];
      sQuestions[index - 1] = temp;
    } else if (direction === 'down' && index < sQuestions.length - 1) {
      const temp = sQuestions[index];
      sQuestions[index] = sQuestions[index + 1];
      sQuestions[index + 1] = temp;
    }

    const reorderedIds = sQuestions.map((q) => q.id);
    await api.reorderQuestions(project.id, reorderedIds);
    const refreshed = await api.getResearchById(project.id);
    setProject(refreshed);
  };

  // Options management inside selected question
  const handleAddOption = () => {
    if (!selectedQuestion) return;
    const opts = selectedQuestion.options || [];
    const newOpt: QuestionOption = {
      id: `opt-${Date.now()}`,
      text: `Option ${opts.length + 1}`,
      value: `option_${opts.length + 1}`,
      order: opts.length + 1,
    };
    handleUpdateQuestion({ options: [...opts, newOpt] });
  };

  const handleUpdateOption = (optId: string, text: string) => {
    if (!selectedQuestion) return;
    const opts = (selectedQuestion.options || []).map((o) =>
      o.id === optId ? { ...o, text, value: text.toLowerCase().replace(/[^a-z0-9]+/g, '_') } : o
    );
    handleUpdateQuestion({ options: opts });
  };

  const handleDeleteOption = (optId: string) => {
    if (!selectedQuestion) return;
    const opts = (selectedQuestion.options || []).filter((o) => o.id !== optId);
    handleUpdateQuestion({ options: opts });
  };

  // Logic rule management
  const handleAddLogic = () => {
    if (!selectedQuestion) return;
    const currentRules = selectedQuestion.logic || [];
    const newRule: QuestionLogic = {
      id: `rule-${Date.now()}`,
      sourceQuestionId: questions[0]?.id || '',
      operator: 'equals',
      value: 'yes',
      action: 'show',
      targetQuestionId: selectedQuestion.id,
    };
    handleUpdateQuestion({ logic: [...currentRules, newRule] });
  };

  const handleUpdateLogic = (ruleId: string, updates: Partial<QuestionLogic>) => {
    if (!selectedQuestion) return;
    const currentRules = (selectedQuestion.logic || []).map((r) =>
      r.id === ruleId ? { ...r, ...updates } : r
    );
    handleUpdateQuestion({ logic: currentRules });
  };

  const handleDeleteLogic = (ruleId: string) => {
    if (!selectedQuestion) return;
    const currentRules = (selectedQuestion.logic || []).filter((r) => r.id !== ruleId);
    handleUpdateQuestion({ logic: currentRules });
  };

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/admin/research')}
            className="p-1.5 text-stone-600 hover:text-stone-900 rounded-md cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="text-[11px] font-mono text-stone-500 uppercase">
              Questionnaire Builder · Status: {project.status}
            </div>
            <h1 className="text-xl font-serif font-bold text-stone-900 truncate max-w-xl">
              {project.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 rounded-lg cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Survey</span>
          </button>

          <button
            onClick={saveProjectMeta}
            disabled={saving}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Visual Builder Layout (Section 13) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Sections & Question Hierarchy (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Sections & Flow</span>
            </h3>
            <button
              onClick={handleAddSection}
              className="text-[11px] font-semibold text-stone-900 hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3 h-3" />
              <span>Add Section</span>
            </button>
          </div>

          {/* Section list tabs */}
          <div className="space-y-1">
            {sections.map((sec, idx) => (
              <div
                key={sec.id}
                onClick={() => setSelectedSectionId(sec.id)}
                className={`p-2.5 rounded-lg border text-xs cursor-pointer flex items-center justify-between transition-colors ${
                  selectedSectionId === sec.id
                    ? 'border-stone-900 bg-stone-900 text-white font-medium'
                    : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                }`}
              >
                <div className="truncate flex-1">
                  <span className="font-mono mr-1.5">P{idx + 1}.</span>
                  <span>{sec.title}</span>
                </div>
                {sections.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteSection(sec.id);
                    }}
                    className="p-1 opacity-60 hover:opacity-100"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Questions inside selected section */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                Questions ({currentSectionQuestions.length})
              </span>
              <button
                onClick={handleAddQuestion}
                className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Question</span>
              </button>
            </div>

            <div className="space-y-1.5 max-h-[400px] overflow-y-auto pr-1">
              {currentSectionQuestions.map((q, idx) => {
                const isSelected = selectedQuestionId === q.id;
                return (
                  <div
                    key={q.id}
                    onClick={() => setSelectedQuestionId(q.id)}
                    className={`p-2.5 rounded-lg border text-xs cursor-pointer transition-colors flex items-center justify-between ${
                      isSelected
                        ? 'border-stone-900 bg-stone-100 font-semibold text-stone-900 shadow-2xs'
                        : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <div className="truncate flex-1">
                      <span className="font-mono text-[10px] text-stone-400 mr-1.5">
                        Q{idx + 1}.
                      </span>
                      <span>{q.text}</span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0 ml-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveQuestion(q.id, 'up');
                        }}
                        disabled={idx === 0}
                        className="p-0.5 text-stone-400 hover:text-stone-900 disabled:opacity-20"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoveQuestion(q.id, 'down');
                        }}
                        disabled={idx === currentSectionQuestions.length - 1}
                        className="p-0.5 text-stone-400 hover:text-stone-900 disabled:opacity-20"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CENTER COLUMN: Question Editor (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-stone-200 p-6 shadow-2xs space-y-5">
          {selectedQuestion ? (
            <>
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 font-mono">
                  Editing Question
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDuplicateQuestion(selectedQuestion.id)}
                    title="Duplicate question"
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100 cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteQuestion(selectedQuestion.id)}
                    title="Delete question"
                    className="p-1.5 text-rose-500 hover:text-rose-700 rounded hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Question Text */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Question Text *</label>
                <textarea
                  rows={2}
                  value={selectedQuestion.text}
                  onChange={(e) => handleUpdateQuestion({ text: e.target.value })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs sm:text-sm text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-800"
                />
              </div>

              {/* Help Description */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Help / Subtitle Description</label>
                <input
                  type="text"
                  value={selectedQuestion.description || ''}
                  onChange={(e) => handleUpdateQuestion({ description: e.target.value })}
                  placeholder="Optional guidance for respondents..."
                  className="w-full p-2 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-none"
                />
              </div>

              {/* Question Type Selection (17 Types Supported!) */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-stone-700">Question Type</label>
                <select
                  value={selectedQuestion.type}
                  onChange={(e) => handleUpdateQuestion({ type: e.target.value as QuestionType })}
                  className="w-full p-2.5 bg-stone-50 border border-stone-300 rounded-lg text-xs text-stone-900 font-medium focus:outline-none"
                >
                  <optgroup label="Choices">
                    <option value="single_choice">Single Choice (Radio)</option>
                    <option value="multiple_choice">Multiple Choice (Checkboxes)</option>
                    <option value="dropdown">Dropdown Selection</option>
                    <option value="yes_no">Yes / No Toggle</option>
                  </optgroup>
                  <optgroup label="Scales & Ratings">
                    <option value="likert">Likert Scale (1–5 Strongly Disagree to Agree)</option>
                    <option value="rating">Rating Scale (1–5 Stars)</option>
                    <option value="matrix">Matrix / Likert Grid</option>
                  </optgroup>
                  <optgroup label="Text & Numeric">
                    <option value="short_text">Short Text</option>
                    <option value="long_text">Long Text / Paragraph</option>
                    <option value="number">Numeric Input</option>
                    <option value="percentage">Percentage (0–100%)</option>
                  </optgroup>
                  <optgroup label="Demographic & Specific">
                    <option value="age">Age</option>
                    <option value="date">Date</option>
                    <option value="email">Email Address</option>
                    <option value="phone">Phone Number</option>
                    <option value="file_upload">Document / File Upload</option>
                  </optgroup>
                </select>
              </div>

              {/* Required & Active Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-stone-100">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={selectedQuestion.required}
                    onChange={(e) => handleUpdateQuestion({ required: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
                  />
                  <span>Mandatory / Required question</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={selectedQuestion.active}
                    onChange={(e) => handleUpdateQuestion({ active: e.target.checked })}
                    className="w-4 h-4 rounded text-stone-900 focus:ring-stone-900"
                  />
                  <span>Active in survey</span>
                </label>
              </div>

              {/* Live Preview of this Question */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                  Question Preview
                </span>
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200">
                  <QuestionRenderer
                    question={selectedQuestion}
                    value={null}
                    onChange={() => {}}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="py-20 text-center text-xs text-stone-400">
              Select or add a question to configure details.
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Options & Conditional Branching Rules (3 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {selectedQuestion && ['single_choice', 'multiple_choice', 'dropdown'].includes(selectedQuestion.type) && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h4 className="text-xs font-semibold text-stone-900">Answer Choices</h4>
                <button
                  onClick={handleAddOption}
                  className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Option</span>
                </button>
              </div>

              <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                {(selectedQuestion.options || []).map((opt) => (
                  <div key={opt.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt.text}
                      onChange={(e) => handleUpdateOption(opt.id, e.target.value)}
                      className="flex-1 p-1.5 text-xs bg-stone-50 border border-stone-200 rounded focus:outline-none"
                    />
                    <button
                      onClick={() => handleDeleteOption(opt.id)}
                      className="p-1 text-stone-400 hover:text-rose-600 cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conditional Logic Rule Builder (Section 7) */}
          {selectedQuestion && (
            <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div>
                  <h4 className="text-xs font-semibold text-stone-900">Conditional Logic</h4>
                  <span className="text-[10px] text-stone-500">IF rules for display</span>
                </div>
                <button
                  onClick={handleAddLogic}
                  className="text-[11px] font-semibold text-emerald-800 hover:underline flex items-center gap-0.5 cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Rule</span>
                </button>
              </div>

              {(!selectedQuestion.logic || selectedQuestion.logic.length === 0) ? (
                <p className="text-[11px] text-stone-400 italic">
                  Always shown to all respondents.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedQuestion.logic.map((rule) => (
                    <div key={rule.id} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-xs space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-medium text-stone-700">
                        <span>Condition Rule</span>
                        <button
                          onClick={() => handleDeleteLogic(rule.id)}
                          className="text-stone-400 hover:text-rose-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-stone-500">Source Question</label>
                        <select
                          value={rule.sourceQuestionId}
                          onChange={(e) => handleUpdateLogic(rule.id, { sourceQuestionId: e.target.value })}
                          className="w-full p-1 bg-white border border-stone-300 rounded text-[11px]"
                        >
                          {questions
                            .filter((q) => q.id !== selectedQuestion.id)
                            .map((q) => (
                              <option key={q.id} value={q.id}>{q.text.slice(0, 30)}...</option>
                            ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] text-stone-500">Condition</label>
                          <select
                            value={rule.operator}
                            onChange={(e) => handleUpdateLogic(rule.id, { operator: e.target.value as any })}
                            className="w-full p-1 bg-white border border-stone-300 rounded text-[11px]"
                          >
                            <option value="equals">Equals</option>
                            <option value="not_equals">Does not equal</option>
                            <option value="contains">Contains</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] text-stone-500">Value</label>
                          <input
                            type="text"
                            value={rule.value}
                            onChange={(e) => handleUpdateLogic(rule.id, { value: e.target.value })}
                            placeholder="e.g. reporting_entity"
                            className="w-full p-1 bg-white border border-stone-300 rounded text-[11px]"
                          />
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between text-[11px]">
                        <span className="text-stone-500">Action:</span>
                        <select
                          value={rule.action}
                          onChange={(e) => handleUpdateLogic(rule.id, { action: e.target.value as any })}
                          className="p-1 bg-white border border-stone-300 rounded text-[11px] font-semibold"
                        >
                          <option value="show">SHOW question</option>
                          <option value="skip">SKIP question</option>
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Study Metadata Settings */}
          <div className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs space-y-3">
            <h4 className="text-xs font-semibold text-stone-900 border-b border-stone-100 pb-2">
              Study Metadata
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <label className="text-[11px] text-stone-500 block">Category</label>
                <input
                  type="text"
                  value={project.category}
                  onChange={(e) => handleProjectMetaChange('category', e.target.value)}
                  className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500 block">Est. Time</label>
                <input
                  type="text"
                  value={project.estimatedTime}
                  onChange={(e) => handleProjectMetaChange('estimatedTime', e.target.value)}
                  className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded"
                />
              </div>
              <div>
                <label className="text-[11px] text-stone-500 block">Status</label>
                <select
                  value={project.status}
                  onChange={(e) => handleProjectMetaChange('status', e.target.value as any)}
                  className="w-full p-1.5 bg-stone-50 border border-stone-200 rounded font-medium"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="PUBLISHED">PUBLISHED (Active)</option>
                  <option value="CLOSED">CLOSED</option>
                  <option value="ARCHIVED">ARCHIVED</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview Modal */}
      {previewOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-stone-200 max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-stone-50">
              <span className="text-xs font-semibold text-stone-700">Live Questionnaire Preview</span>
              <button
                onClick={() => setPreviewOpen(false)}
                className="p-1 text-stone-400 hover:text-stone-700 rounded cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              <h2 className="text-xl font-serif font-bold text-stone-950">{project.title}</h2>
              <p className="text-xs text-stone-600">{project.shortDescription}</p>

              <div className="space-y-6 pt-4 border-t border-stone-200">
                {currentSectionQuestions.map((q, idx) => (
                  <div key={q.id} className="p-4 bg-stone-50 rounded-lg border border-stone-200 space-y-2">
                    <h4 className="text-sm font-medium text-stone-900">
                      {idx + 1}. {q.text} {q.required && <span className="text-rose-600">*</span>}
                    </h4>
                    {q.description && <p className="text-xs text-stone-500">{q.description}</p>}
                    <QuestionRenderer question={q} value={null} onChange={() => {}} />
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-stone-200 bg-stone-50 text-right">
              <button
                onClick={() => setPreviewOpen(false)}
                className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
