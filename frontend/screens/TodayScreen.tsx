import React, { useState } from 'react';
import { useAppState } from '../StateContext';
import { useRadarItems } from '../context/RadarItemsContext';
import { UserRadarItemCard } from '../components/UserRadarItemCard';
import { FindingCard } from '../components/FindingCard';
import { CreateItemModal } from '../components/CreateItemModal';
import { DeleteConfirmModal } from '../components/DeleteConfirmModal';
import { CheckCircle2, ArrowRightCircle, Plus } from 'lucide-react';
import { formatCurrency, startOfLocalDay, daysBetweenLocal } from '../utils';

export const TodayScreen: React.FC = () => {
  const { findings } = useAppState();
  const { items: radarItems, loading, error, createItem, updateItem, deleteItem, toggleStatus, refresh } = useRadarItems();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ item: import('../types').RadarItem } | null>(null);

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

  const activeRadarItems = radarItems.filter(i => i.status === 'active');
  const completedRadarItems = radarItems.filter(i => i.status === 'completed');

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
  };

  const handleOpenCreate = () => {
    setShowCreateModal(true);
  };

  const handleEdit = (item: import('../types').RadarItem) => {
    // TODO: Implement edit modal
    console.log('Edit item:', item);
  };

  const handleToggleStatus = async (id: string) => {
    await toggleStatus(id);
  };

  const handleDelete = (item: import('../types').RadarItem) => {
    setDeleteConfirm({ item });
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirm) {
      await deleteItem(deleteConfirm.item.id);
      setDeleteConfirm(null);
    }
  };

  if (loading) {
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
        <div className="flex items-center justify-center min-h-[40vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" aria-label="Lade Benutzer-Fristen"></div>
        </div>
      </div>
    );
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

      {/* Error state */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm" role="alert">
          {error}
        </div>
      )}

      {/* Radar Items - User created items */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Deine Fristen</h2>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          >
            <Plus size={16} />
            Neue Frist
          </button>
        </div>

        {radarItems.length > 0 ? (
          <>
            <div className="space-y-4">
              {radarItems.filter(i => i.status === 'active').map((item, index) => (
                <UserRadarItemCard
                  key={item.id}
                  item={item}
                  isPrimary={index === 0}
                  onEdit={handleEdit}
                  onToggleStatus={handleToggleStatus}
                  onDelete={handleDelete}
                />
              ))}
            </div>

            {radarItems.filter(i => i.status === 'completed').length > 0 && (
              <details className="group">
                <summary className="flex items-center justify-between cursor-pointer p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-200/80 dark:border-slate-700/80 list-none">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Erledigt ({radarItems.filter(i => i.status === 'completed').length})
                  </span>
                  <span className="text-slate-400 transition-transform group-open:rotate-180">▼</span>
                </summary>
                <div className="space-y-3 mt-3">
                  {radarItems.filter(i => i.status === 'completed').map(item => (
                    <UserRadarItemCard
                      key={item.id}
                      item={item}
                      onEdit={handleEdit}
                      onToggleStatus={handleToggleStatus}
                      onDelete={handleDelete}
                    />
                  ))}
                </div>
              </details>
            )}
          </>
        ) : (
          <div className="bg-white dark:bg-slate-850 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center min-h-[40vh] shadow-sm">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Plus size={24} className="text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Noch keine eigenen Fristen.</h3>
            <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
              Lege deine erste Frist an, um loszulegen.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <Plus size={16} />
              Erste Frist anlegen
            </button>
          </div>
        )}

        {error && !radarItems.length && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm" role="alert">
            {error}
          </div>
        )}
      </section>

      {/* Demo Findings Section */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2">
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300">
            Demo
          </span>
          Demo-Ergebnisse
        </h2>

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
      </section>

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

      {/* Create Item Modal */}
      <CreateItemModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handleCreateSuccess}
      />

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteConfirm}
        itemTitle={deleteConfirm?.item.title || ''}
      />
    </div>
  );
};

export default TodayScreen;