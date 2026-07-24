import React from 'react';
import { EvidenceLevel } from '../types';
import { translateEvidence } from '../utils';

interface BadgeProps {
  level?: EvidenceLevel;
  text?: string;
  variant?: 'default' | 'success' | 'warning' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({ level, text, variant = 'default' }) => {
  let bgClass = 'bg-slate-100 dark:bg-slate-800';
  let textClass = 'text-slate-600 dark:text-slate-300';
  let borderClass = 'border-slate-200 dark:border-slate-700';
  let dotClass = 'bg-slate-400';

  const displayLabel = level ? `Grundlage: ${translateEvidence(level)}` : text;

  if (level) {
    switch (level) {
      case 'Observed':
        bgClass = 'bg-indigo-50 dark:bg-indigo-900/30';
        textClass = 'text-indigo-700 dark:text-indigo-300';
        borderClass = 'border-indigo-200 dark:border-indigo-800';
        dotClass = 'bg-indigo-500';
        break;
      case 'Calculated':
        bgClass = 'bg-blue-50 dark:bg-blue-900/30';
        textClass = 'text-blue-700 dark:text-blue-300';
        borderClass = 'border-blue-200 dark:border-blue-800';
        dotClass = 'bg-blue-500';
        break;
      case 'Estimated':
        bgClass = 'bg-amber-50 dark:bg-amber-900/30';
        textClass = 'text-amber-700 dark:text-amber-300';
        borderClass = 'border-amber-200 dark:border-amber-800';
        dotClass = 'bg-amber-500';
        break;
      case 'Unknown':
        bgClass = 'bg-slate-100 dark:bg-slate-800';
        textClass = 'text-slate-600 dark:text-slate-400';
        borderClass = 'border-slate-200 dark:border-slate-700';
        dotClass = 'bg-slate-400';
        break;
    }
  } else if (variant) {
     switch (variant) {
      case 'success':
        bgClass = 'bg-emerald-50 dark:bg-emerald-900/30';
        textClass = 'text-emerald-700 dark:text-emerald-300';
        borderClass = 'border-emerald-200 dark:border-emerald-800';
        dotClass = 'bg-emerald-500';
        break;
      case 'warning':
        bgClass = 'bg-amber-50 dark:bg-amber-900/30';
        textClass = 'text-amber-700 dark:text-amber-300';
        borderClass = 'border-amber-200 dark:border-amber-800';
        dotClass = 'bg-amber-500';
        break;
     }
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border tabular-nums ${bgClass} ${textClass} ${borderClass}`}>
      {level && <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${dotClass}`}></span>}
      {displayLabel}
    </span>
  );
};
