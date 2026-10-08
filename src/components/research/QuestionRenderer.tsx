import React, { useState } from 'react';
import { Star, Upload, Check, AlertCircle } from 'lucide-react';
import type { ResearchQuestion } from '../../types/research.js';

interface QuestionRendererProps {
  question: ResearchQuestion;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
  error,
}) => {
  const [otherText, setOtherText] = useState('');

  // 1. Single Choice
  if (question.type === 'single_choice') {
    const options = question.options || [];
    return (
      <div className="space-y-2.5">
        {options.map((opt) => {
          const isSelected = value === opt.value;
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer text-sm ${
                isSelected
                  ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 shadow-xs'
                  : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
              }`}
            >
              <input
                type="radio"
                name={question.id}
                value={opt.value}
                checked={isSelected}
                onChange={() => onChange(opt.value)}
                className="mt-0.5 text-stone-900 focus:ring-stone-900"
              />
              <span className="flex-1">{opt.text}</span>
            </label>
          );
        })}
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 2. Multiple Choice
  if (question.type === 'multiple_choice') {
    const options = question.options || [];
    const currentValues: string[] = Array.isArray(value) ? value : [];

    const handleToggle = (optVal: string) => {
      if (currentValues.includes(optVal)) {
        onChange(currentValues.filter((v) => v !== optVal));
      } else {
        onChange([...currentValues, optVal]);
      }
    };

    return (
      <div className="space-y-2.5">
        {options.map((opt) => {
          const isChecked = currentValues.includes(opt.value);
          return (
            <div key={opt.id} className="space-y-2">
              <label
                className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all cursor-pointer text-sm ${
                  isChecked
                    ? 'border-stone-900 bg-stone-50 font-medium text-stone-900 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                }`}
              >
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={isChecked}
                  onChange={() => handleToggle(opt.value)}
                  className="mt-0.5 rounded text-stone-900 focus:ring-stone-900"
                />
                <span className="flex-1">{opt.text}</span>
              </label>

              {opt.isOther && isChecked && (
                <input
                  type="text"
                  placeholder="Please specify other details..."
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  className="w-full text-xs p-2.5 rounded border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-800"
                />
              )}
            </div>
          );
        })}
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 3. Dropdown
  if (question.type === 'dropdown') {
    const options = question.options || [];
    return (
      <div className="space-y-1">
        <select
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-3 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        >
          <option value="">-- Select an option --</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.value}>
              {opt.text}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 4. Yes / No
  if (question.type === 'yes_no') {
    return (
      <div className="space-y-1">
        <div className="grid grid-cols-2 gap-3 max-w-sm">
          {['yes', 'no'].map((item) => {
            const isSelected = value === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onChange(item)}
                className={`py-3 px-4 rounded-lg border text-sm font-medium transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-300 bg-white text-stone-700 hover:border-stone-400'
                }`}
              >
                {isSelected && <Check className="w-4 h-4" />}
                <span>{item === 'yes' ? 'Yes' : 'No'}</span>
              </button>
            );
          })}
        </div>
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 5. Likert Scale (1 = Strongly Disagree to 5 = Strongly Agree)
  if (question.type === 'likert') {
    const likertLevels = [
      { score: 1, label: 'Strongly Disagree' },
      { score: 2, label: 'Disagree' },
      { score: 3, label: 'Neutral' },
      { score: 4, label: 'Agree' },
      { score: 5, label: 'Strongly Agree' },
    ];

    const currentScore = Number(value) || 0;

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-5 gap-2">
          {likertLevels.map((lvl) => {
            const isSelected = currentScore === lvl.score;
            return (
              <button
                key={lvl.score}
                type="button"
                onClick={() => onChange(lvl.score)}
                className={`p-3 rounded-lg border text-center transition-all cursor-pointer flex flex-col items-center justify-between min-h-[72px] ${
                  isSelected
                    ? 'border-stone-900 bg-stone-900 text-white shadow-xs'
                    : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                }`}
              >
                <span className="font-mono text-base font-bold">{lvl.score}</span>
                <span className={`text-[10px] leading-tight text-center mt-1 ${isSelected ? 'text-stone-200' : 'text-stone-500'}`}>
                  {lvl.label}
                </span>
              </button>
            );
          })}
        </div>
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 6. Rating Scale (1 to 5)
  if (question.type === 'rating') {
    const currentRating = Number(value) || 0;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onChange(star)}
              className={`p-2.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
                currentRating >= star
                  ? 'border-amber-400 bg-amber-50 text-amber-900'
                  : 'border-stone-200 bg-white text-stone-400 hover:border-stone-300'
              }`}
            >
              <Star
                className={`w-5 h-5 ${
                  currentRating >= star ? 'fill-amber-400 text-amber-500' : 'text-stone-300'
                }`}
              />
              <span className="text-xs font-mono font-medium">{star}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-between max-w-xs text-[11px] text-stone-500 px-1">
          <span>1 = Minimal / Low</span>
          <span>5 = Exceptional / Critical</span>
        </div>
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 7. Long Text
  if (question.type === 'long_text') {
    return (
      <div className="space-y-1">
        <textarea
          rows={4}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Please enter your detailed observations or qualitative assessment..."
          className="w-full p-3.5 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        />
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 8. Number
  if (question.type === 'number') {
    return (
      <div className="space-y-1">
        <input
          type="number"
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Enter numeric value..."
          className="w-full max-w-sm p-3 bg-white border border-stone-300 rounded-lg text-sm font-mono tabular-nums text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        />
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 9. Percentage
  if (question.type === 'percentage') {
    return (
      <div className="space-y-1">
        <div className="relative max-w-xs">
          <input
            type="number"
            min={0}
            max={100}
            value={value !== undefined ? value : ''}
            onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
            placeholder="0–100"
            className="w-full p-3 pr-8 bg-white border border-stone-300 rounded-lg text-sm font-mono tabular-nums text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
          />
          <span className="absolute right-3 top-3 text-stone-500 font-mono text-sm">%</span>
        </div>
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 10. Date
  if (question.type === 'date') {
    return (
      <div className="space-y-1">
        <input
          type="date"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-sm p-3 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        />
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 11. Email
  if (question.type === 'email') {
    return (
      <div className="space-y-1">
        <input
          type="email"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="officer@institution.rw"
          className="w-full max-w-md p-3 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        />
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 12. Phone
  if (question.type === 'phone') {
    return (
      <div className="space-y-1">
        <input
          type="tel"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder="+250 78X XXX XXX"
          className="w-full max-w-sm p-3 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        />
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 13. Age
  if (question.type === 'age') {
    return (
      <div className="space-y-1">
        <input
          type="number"
          min={18}
          max={100}
          value={value !== undefined ? value : ''}
          onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))}
          placeholder="Years"
          className="w-full max-w-xs p-3 bg-white border border-stone-300 rounded-lg text-sm font-mono text-stone-900 focus:ring-2 focus:ring-stone-400 focus:outline-none"
        />
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // 14. Matrix / Grid
  if (question.type === 'matrix') {
    const rows = question.matrixRows || ['Statement A', 'Statement B'];
    const cols = question.matrixColumns || ['Disagree', 'Neutral', 'Agree'];
    const currentMatrix: Record<string, string> = typeof value === 'object' && value ? value : {};

    const handleCellChange = (row: string, col: string) => {
      onChange({ ...currentMatrix, [row]: col });
    };

    return (
      <div className="overflow-x-auto border border-stone-200 rounded-lg">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-50 border-b border-stone-200 text-stone-600">
            <tr>
              <th className="p-3 font-medium">Evaluation Criterion</th>
              {cols.map((col) => (
                <th key={col} className="p-3 text-center font-medium">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {rows.map((row) => (
              <tr key={row} className="hover:bg-stone-50/50">
                <td className="p-3 text-stone-800 font-medium">{row}</td>
                {cols.map((col) => {
                  const isChecked = currentMatrix[row] === col;
                  return (
                    <td key={col} className="p-3 text-center">
                      <input
                        type="radio"
                        name={`${question.id}_${row}`}
                        checked={isChecked}
                        onChange={() => handleCellChange(row, col)}
                        className="text-stone-900 focus:ring-stone-900"
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {error && <p className="text-xs text-rose-600 p-2"><AlertCircle className="w-3.5 h-3.5 inline mr-1" />{error}</p>}
      </div>
    );
  }

  // 15. File Upload
  if (question.type === 'file_upload') {
    return (
      <div className="space-y-2">
        <label className="border-2 border-dashed border-stone-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-stone-500 bg-stone-50/50 transition-colors">
          <Upload className="w-6 h-6 text-stone-400 mb-2" />
          <span className="text-xs font-medium text-stone-700">Click to attach document or report</span>
          <span className="text-[11px] text-stone-400 mt-1">PDF, DOCX, or XLSX up to 10MB</span>
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onChange(file.name);
            }}
          />
        </label>
        {value && (
          <div className="text-xs text-stone-700 bg-stone-100 p-2 rounded flex items-center justify-between">
            <span>Attached: {value}</span>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="text-stone-500 hover:text-stone-800 text-[11px] underline"
            >
              Remove
            </button>
          </div>
        )}
        {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
      </div>
    );
  }

  // Default: Short Text
  return (
    <div className="space-y-1">
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your response..."
        className="w-full p-3 bg-white border border-stone-300 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:ring-2 focus:ring-stone-400 focus:outline-none"
      />
      {error && <p className="text-xs text-rose-600 mt-1 flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" />{error}</p>}
    </div>
  );
};
