import React from 'react';
import { useAppState } from '../StateContext';
import { FindingCard } from '../components/FindingCard';
import { CheckCircle2, ArrowRightCircle } from 'lucide-react';
import { formatCurrency, startOfLocalDay, daysBetweenLocal } from '../utils';

export const TodayScreen: React.FC = () => {
  const { findings } = useAppState();

  // Filter for open priority items, max 3
  const priorityFindings = findings
    .filter(f => (f.status === 'Open' || f.status === 'Needs Clarification') && f.isPriority)
    .slice(0, 3);

  const hasFindings = priorityFindings.length > 0;

  // Calculate Next Best Action dynamically
  const unresolvedFindings = findings.filter(f => f.status === 'Open' || f.status === 'Needs Clarification');
  let nextBestActionFinding = null;
  let nextBestReason = '';

  const today = startOfLocalDay();

  // 1. Unresolved deadlines due within the next 14 days (and not in the past)
  const urgentDeadlines = unresolvedFindings
    .filter(f => {
      if (f.category !== 'Deadline' || !f.date) return false;
      const d = new Date(f.date);
      if (isNaN(d.getTime())) return false;
      const diff = daysBetweenLocal(today, d);
      return diff >= 0 && diff <= 14;
    })
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  // 2. Unresolved money findings with the highest confirmed financial impact
  const confirmedMoney = unresolvedFindings
    .filter(f => f.category === 'Money' && f.amount && (f.evidenceLevel === 'Observed' || f.evidenceLevel === 'Calculated'))
    .sort((a, b) => (b.amount || 0) - (a.amount || 0));

  // 3. Unresolved deadlines due later than 14 days
  const laterDeadlines = unresolvedFindings
    .filter(f => {
      if (f.category !== 'Deadline' || !f.date) return false;
      const d = new Date(f.date);
      if (isNaN(d.getTime())) return false;
      const diff = daysBetweenLocal(today, d);
      return diff > 14;
    })
    .sort((a, b) => new Date(a.date!).getTime() - new Date(b.date!).getTime());

  // 4. Unresolved findings marked Unknown or Needs Clarification
  const unknownOrClarification = unresolvedFindings
    .filter(f => f.evidenceLevel === 'Unknown' || f.status === 'Needs Clarification');

  // 5. Remaining unresolved findings
  const remainingFindings = unresolvedFindings.filter(f => 
    !urgentDeadlines.includes(f) && 
    !confirmedMoney.includes(f) && 
    !laterDeadlines.includes(f) && 
    !unknownOrClarification.includes(f)
  );

  if (urgentDeadlines.length > 0) {
    nextBestActionFinding = urgentDeadlines[0];
    nextBestReason = 'Dies zuerst zu erledigen, verhindert das Verpassen einer dringenden Frist.';
  } else if (confirmedMoney.length > 0) {
    nextBestActionFinding = confirmedMoney[0];
    nextBestReason = `Dies zuerst zu erledigen, verhindert den größten unmittelbaren finanziellen Verlust (${formatCurrency(confirmedMoney[0].amount!)}).`;
  } else if (laterDeadlines.length > 0) {
    nextBestActionFinding = laterDeadlines[0];
    nextBestReason = 'Dies frühzeitig zu erledigen, bereitet dich auf eine zukünftige Frist vor.';
  } else if (unknownOrClarification.length > 0) {
    nextBestActionFinding = unknownOrClarification[0];
    nextBestReason = 'Die Klärung dieses Punktes hilft festzustellen, ob Handlungsbedarf besteht.';
  } else if (remainingFindings.length > 0) {
    nextBestActionFinding = remainingFindings[0];
    nextBestReason = 'Dies ist der nächste offene Punkt, der deine Aufmerksamkeit erfordert.';
  }

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <span className="block text-sm font-medium text-indigo-600 dark:text-indigo-400">
          Wir haben dein Leben auf dem Schirm.
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight break-words">
          Was du sonst zu spät bemerken würdest.
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl">
          LifeRadar macht Fristen, stille Kosten und offene Ansprüche sichtbar — und zeigt dir, was als Nächstes sinnvoll ist.
        </p>
      </header>

      {hasFindings ? (
        <div className="space-y-4">
          {priorityFindings.map((finding, index) => (
            <FindingCard 
              key={finding.id} 
              finding={finding} 
              isPrimary={index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[40vh] shadow-sm">
          <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={24} className="text-slate-400 dark:text-slate-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Keine offenen Demo-Ergebnisse.</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Die aktuelle Demo enthält keine offenen Prioritäts-Ergebnisse.
          </p>
        </div>
      )}

      {nextBestActionFinding && (
        <div className="pt-8 border-t border-slate-200/80 dark:border-slate-800/80">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <ArrowRightCircle size={18} className="text-indigo-500 dark:text-indigo-400" />
            Nächster bester Schritt
          </h2>
          <div className="bg-gradient-to-br from-indigo-50/50 to-indigo-100/30 dark:from-indigo-900/10 dark:to-indigo-900/5 rounded-xl p-5 border border-indigo-100/80 dark:border-indigo-800/40 shadow-sm">
            <p className="text-indigo-900 dark:text-indigo-100 font-medium mb-1.5">
              {nextBestActionFinding.actionLabel} für: {nextBestActionFinding.title}
            </p>
            <p className="text-sm text-indigo-700/80 dark:text-indigo-300/80">
              {nextBestReason}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
