import React, { useState } from 'react';
import { ArrowRight, FileText, CheckCircle2, MoreHorizontal } from 'lucide-react';
import { Finding } from '../types';
import { FindingDetailModal } from './FindingDetailModal';
import { formatCurrency, formatDate, translateStatus, translateEvidence } from '../utils';

interface FindingCardProps {
  finding: Finding;
  isPrimary?: boolean;
}

export const FindingCard: React.FC<FindingCardProps> = ({ finding, isPrimary = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalView, setModalView] = useState<'overview' | 'action'>('overview');

  const isResolved = finding.status !== 'Open' && finding.status !== 'Needs Clarification';
  
  let categoryBorder = 'border-l-slate-300 dark:border-l-slate-600';
  if (!isResolved) {
    if (finding.category === 'Money') categoryBorder = 'border-l-emerald-500 dark:border-l-emerald-500/80';
    else if (finding.category === 'Deadline') categoryBorder = 'border-l-amber-500 dark:border-l-amber-500/80';
    else categoryBorder = 'border-l-indigo-500 dark:border-l-indigo-500/80';
  }
  
  const borderClass = finding.isPriority && !isResolved ? `border-l-4 ${categoryBorder}` : `border-l-2 ${categoryBorder}`;

  const handlePrimaryActionClick = () => {
    setModalView('action');
    setIsModalOpen(true);
  };

  const handleDetailsClick = () => {
    setModalView('overview');
    setIsModalOpen(true);
  };

  return (
    <>
      <div className={`
        relative overflow-hidden rounded-2xl border transition-all duration-200 ease-in-out motion-reduce:transition-none
        ${borderClass}
        ${isResolved ? 'opacity-60 bg-slate-50/50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800' : 
          isPrimary ? 'bg-white dark:bg-slate-850 border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:shadow-md hover:-translate-y-0.5 motion-reduce:hover:translate-y-0' : 
          'bg-white dark:bg-slate-850 border-slate-200/60 dark:border-slate-700/60 shadow-sm hover:shadow hover:-translate-y-0.5 motion-reduce:hover:translate-y-0'}
      `}>
        <div className="p-5 sm:p-6 flex flex-col h-full">
          
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5 tabular-nums truncate">
                {finding.category === 'Money' && finding.amount ? (
                  <span className="text-emerald-700 dark:text-emerald-400">{formatCurrency(finding.amount)} • </span>
                ) : ''}
                {finding.date ? (
                  <span className="text-amber-700 dark:text-amber-400">{formatDate(finding.date, 'short')} • </span>
                ) : ''}
                {finding.consequence}
              </p>
              <h3 className={`font-bold text-slate-900 dark:text-slate-100 leading-snug break-words hyphens-auto ${isPrimary ? 'text-lg' : 'text-base'}`}>
                {finding.title}
              </h3>
            </div>
            <button 
              onClick={handleDetailsClick}
              className="p-1.5 -mr-2 -mt-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 shrink-0"
              aria-label="Details anzeigen"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-500 dark:text-slate-400 mb-6">
            <span className="flex items-center gap-1.5"><FileText size={14}/> {finding.source}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>Grundlage: {translateEvidence(finding.evidenceLevel)}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="opacity-60">Demo-Daten</span>
          </div>

          <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
            {isResolved ? (
              <div className="flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} className="mr-1.5" />
                Markiert als {translateStatus(finding.status)}
              </div>
            ) : (
              <button 
                onClick={handlePrimaryActionClick}
                className="group flex items-center text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1.5 -ml-2 active:scale-[0.98]"
              >
                {finding.actionLabel}
                <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
              </button>
            )}
          </div>
        </div>
      </div>

      <FindingDetailModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        finding={finding}
        initialView={modalView}
      />
    </>
  );
};
