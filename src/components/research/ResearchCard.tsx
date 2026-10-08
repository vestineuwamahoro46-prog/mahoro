import React from 'react';
import { ArrowRight, Clock, Users, CheckCircle2 } from 'lucide-react';
import type { ResearchProject } from '../../types/research.js';

interface ResearchCardProps {
  project: ResearchProject;
  onSelect: (project: ResearchProject) => void;
  onStartSurvey?: (project: ResearchProject) => void;
}

export const ResearchCard: React.FC<ResearchCardProps> = ({
  project,
  onSelect,
  onStartSurvey,
}) => {
  const isClosed = project.status === 'CLOSED';
  const isDraft = project.status === 'DRAFT';

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-400 transition-all group">
      <div>
        {/* Anti-Slop Unboxed Metadata Header with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-stone-500 mb-2">
          <span className="font-medium text-stone-700">{project.category}</span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>{project.estimatedTime}</span>
          </span>
          <span aria-hidden="true">·</span>
          <span className={isClosed ? 'text-amber-700' : isDraft ? 'text-stone-500' : 'text-emerald-700 font-medium'}>
            {project.status === 'PUBLISHED' ? 'Active Study' : project.status}
          </span>
        </div>

        {/* Primary Title */}
        <h3
          onClick={() => onSelect(project)}
          className="text-lg font-serif font-semibold text-stone-900 leading-snug group-hover:text-stone-700 cursor-pointer transition-colors"
        >
          {project.title}
        </h3>

        {/* Short Description */}
        <p className="text-sm text-stone-600 mt-2.5 leading-relaxed line-clamp-3">
          {project.shortDescription || project.description}
        </p>

        {/* Target Respondents & Lead Investigator info */}
        <div className="mt-4 pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
          <div className="flex items-start gap-1.5">
            <Users className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">
              <strong className="text-stone-800 font-medium">Target:</strong> {project.targetAudience}
            </span>
          </div>
          <div className="text-stone-500">
            <strong className="text-stone-800 font-medium">Investigator:</strong> {project.researcherName} ({project.researcherInstitution})
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
        <button
          onClick={() => onSelect(project)}
          className="text-xs font-medium text-stone-700 hover:text-stone-950 transition-colors flex items-center gap-1 cursor-pointer"
        >
          <span>Research Overview</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {project.status === 'PUBLISHED' ? (
          <button
            onClick={() => onStartSurvey ? onStartSurvey(project) : onSelect(project)}
            className="px-4 py-2 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 rounded-md transition-colors shadow-sm cursor-pointer whitespace-nowrap"
          >
            Start Research
          </button>
        ) : (
          <span className="text-xs text-stone-400 italic">
            {isClosed ? 'Submissions Closed' : 'Draft / Unpublished'}
          </span>
        )}
      </div>
    </div>
  );
};
