import React from 'react';
import { MoreVertical, Edit2, CheckCircle2, Trash2, ExternalLink, Calendar, Euro, Bell } from 'lucide-react';
import { RadarItem, RadarItemCategory } from '../types';
import { formatCurrency, formatDate } from '../utils';

interface UserRadarItemCardProps {
  item: RadarItem;
  onEdit: (item: RadarItem) => void;
  onToggleStatus: (item: RadarItem) => void;
  onDelete: (item: RadarItem) => void;
  isPrimary?: boolean;
}

const CATEGORY_LABELS: Record<RadarItemCategory, string> = {
  contract: 'Vertrag',
  insurance: 'Versicherung',
  subscription: 'Abo',
  tax: 'Steuer',
  warranty: 'Garantie',
  application: 'Antrag',
  other: 'Sonstiges',
};

export const UserRadarItemCard: React.FC<UserRadarItemCardProps> = ({ item, onEdit, onToggleStatus, onDelete, isPrimary }) => {
  const isOverdue = item.status === 'active' && item.relevantDate < new Date().toISOString().split('T')[0];

  return (
    <article className={`relative bg-white dark:bg-slate-850 rounded-2xl border shadow-sm ${
      isPrimary
        ? 'border-indigo-200 dark:border-indigo-800 bg-gradient-to-br from-indigo-50/50 to-transparent dark:from-indigo-900/10'
        : 'border-slate-200/80 dark:border-slate-700/80'
    } overflow-hidden`}>
      <div className="absolute top-3 right-3 flex items-center gap-1">
        <button
          onClick={() => onEdit(item)}
          className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          aria-label="Bearbeiten"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => onDelete(item)}
          className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg bg-white/80 dark:bg-slate-800/80 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          aria-label="Löschen"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className={`p-5 ${isPrimary ? 'pb-4' : ''}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300">
                Von dir eingetragen
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {CATEGORY_LABELS[item.category]}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1 truncate">{item.title}</h3>

            <div className="flex items-center gap-4 mt-3 text-sm text-slate-600 dark:text-slate-400 flex-wrap">
              <span className="flex items-center gap-1">
                <Calendar size={14} />
                {formatDate(item.relevantDate, 'long')}
                {isOverdue && <span className="ml-1 text-red-600 dark:text-red-400 font-medium">(Überfällig)</span>}
              </span>
              {item.cost !== undefined && (
                <span className="flex items-center gap-1">
                  <Euro size={14} />
                  {formatCurrency(item.cost)}
                </span>
              )}
              {item.reminderLeadDays !== undefined && item.reminderLeadDays > 0 && (
                <span className="flex items-center gap-1">
                  <Bell size={14} />
                  {item.reminderLeadDays} Tag{item.reminderLeadDays > 1 ? 'e' : ''} vorher
                </span>
              )}
            </div>

            {item.notes && (
              <p className="mt-3 text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{item.notes}</p>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              item.status === 'active'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
            }`}>
              {item.status === 'active' ? 'Aktiv' : 'Erledigt'}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">Von dir eingetragen</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleStatus(item)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                item.status === 'active'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  : 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50'
              }`}
            >
              {item.status === 'active' ? 'Als erledigt markieren' : 'Wieder aktivieren'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserRadarItemCard;