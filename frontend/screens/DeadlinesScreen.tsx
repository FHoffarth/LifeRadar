import React from 'react';
import { useAppState } from '../StateContext';
import { FindingCard } from '../components/FindingCard';
import { CheckCircle2 } from 'lucide-react';
import { getRelativeDateLabel } from '../utils';

export const DeadlinesScreen: React.FC = () => {
  const { findings } = useAppState();

  const deadlineFindings = findings
    .filter(f => f.category === 'Deadline' && f.date)
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  const openFindings = deadlineFindings.filter(f => f.status === 'Open' || f.status === 'Needs Clarification');

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 break-words">
          Wichtige Fristen
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Termine mit echten Folgen — klar sortiert und früh genug sichtbar.
        </p>
      </header>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[19px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>

        <div className="space-y-8">
          {openFindings.length > 0 ? (
            openFindings.map((finding) => {
              const relativeLabel = getRelativeDateLabel(finding.date);
              const isOverdue = relativeLabel === 'Überfällig';
              const isToday = relativeLabel === 'Heute';
              
              let dotColor = 'bg-amber-400';
              if (isOverdue) dotColor = 'bg-red-400';
              else if (isToday) dotColor = 'bg-amber-500';

              return (
                <div key={finding.id} className="relative sm:pl-14">
                  {/* Timeline dot */}
                  <div className={`absolute left-[14px] top-6 w-3 h-3 rounded-full ${dotColor} border-2 border-white dark:border-slate-900 ring-4 ring-slate-50 dark:ring-slate-850 hidden sm:block z-10`}></div>
                  
                  {relativeLabel && (
                    <div className="mb-2 sm:mb-3">
                      <span className={`text-xs font-bold uppercase tracking-wider ${isOverdue ? 'text-red-600 dark:text-red-400' : isToday ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {relativeLabel}
                      </span>
                    </div>
                  )}
                  <FindingCard finding={finding} />
                </div>
              );
            })
          ) : (
            <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-sm">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={24} className="text-slate-400 dark:text-slate-500" />
              </div>
              <p className="text-slate-500 dark:text-slate-400">Keine anstehenden Fristen erkannt.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
