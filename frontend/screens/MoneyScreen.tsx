import React from 'react';
import { useAppState } from '../StateContext';
import { FindingCard } from '../components/FindingCard';
import { Wallet, CheckCircle2 } from 'lucide-react';
import { formatCurrency } from '../utils';

export const MoneyScreen: React.FC = () => {
  const { findings } = useAppState();

  const moneyFindings = findings.filter(f => f.category === 'Money');
  const openFindings = moneyFindings.filter(f => f.status === 'Open' || f.status === 'Needs Clarification');
  const resolvedFindings = moneyFindings.filter(f => f.status !== 'Open' && f.status !== 'Needs Clarification');

  const totalPotentialValue = openFindings.reduce((sum, f) => sum + (f.amount || 0), 0);

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between gap-6 flex-wrap">
        <div className="flex-1 min-w-[200px]">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 break-words">
            Geld & Ansprüche
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm">
            Offene Erstattungen, vermeidbare Kosten und Ansprüche, die du nicht verlieren solltest.
          </p>
        </div>
        
        {totalPotentialValue > 0 && (
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 dark:from-emerald-900/20 dark:to-emerald-900/10 border border-emerald-200/60 dark:border-emerald-800/50 rounded-xl px-5 py-4 flex items-center gap-4 shadow-sm shrink-0">
            <div className="p-2.5 bg-emerald-100/80 dark:bg-emerald-800/50 rounded-lg text-emerald-700 dark:text-emerald-400">
              <Wallet size={22} />
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-800/80 dark:text-emerald-400/80 mb-0.5">Potenzieller Wert</p>
              <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300 tabular-nums leading-none">
                {formatCurrency(totalPotentialValue)}
              </p>
            </div>
          </div>
        )}
      </header>

      <div className="space-y-6">
        {openFindings.length > 0 ? (
          <div className="space-y-4">
            {openFindings.map(finding => (
              <FindingCard key={finding.id} finding={finding} />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center shadow-sm">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={24} className="text-slate-400 dark:text-slate-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400">Keine offenen geldbezogenen Ergebnisse.</p>
          </div>
        )}

        {resolvedFindings.length > 0 && (
          <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
              Geprüft
            </h2>
            <div className="space-y-4 opacity-75">
              {resolvedFindings.map(finding => (
                <FindingCard key={finding.id} finding={finding} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
