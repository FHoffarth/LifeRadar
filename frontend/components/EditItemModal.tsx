import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Calendar, Euro, Bell, Save, Loader2 } from 'lucide-react';
import { RadarItem, UpdateRadarItemInput, RadarItemCategory } from '../types';
import { radarItemRepository } from '../repository/radarItemRepository';

const CATEGORIES: { value: RadarItemCategory; label: string }[] = [
  { value: 'contract', label: 'Vertrag' },
  { value: 'insurance', label: 'Versicherung' },
  { value: 'subscription', label: 'Abo' },
  { value: 'tax', label: 'Steuer' },
  { value: 'warranty', label: 'Garantie' },
  { value: 'application', label: 'Antrag' },
  { value: 'other', label: 'Sonstiges' },
];

const REMINDER_OPTIONS = [
  { value: 0, label: 'Am Tag' },
  { value: 1, label: '1 Tag vorher' },
  { value: 3, label: '3 Tage vorher' },
  { value: 7, label: '7 Tage vorher' },
];

interface EditItemModalProps {
  isOpen: boolean;
  item: RadarItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditItemModal: React.FC<EditItemModalProps> = ({ isOpen, item, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<RadarItemCategory>('contract');
  const [relevantDate, setRelevantDate] = useState('');
  const [cost, setCost] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [reminderLeadDays, setReminderLeadDays] = useState<number | ''>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const populateForm = useCallback(() => {
    if (item) {
      setTitle(item.title);
      setCategory(item.category);
      setRelevantDate(item.relevantDate);
      setCost(item.cost !== undefined ? String(item.cost) : '');
      setCurrency(item.currency || 'EUR');
      setReminderLeadDays(item.reminderLeadDays !== undefined ? item.reminderLeadDays : '');
      setNotes(item.notes || '');
    }
  }, [item]);

  useEffect(() => {
    if (isOpen && item) {
      populateForm();
      previousActiveElement.current = document.activeElement as HTMLElement;
      setTimeout(() => titleRef.current?.focus(), 0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      previousActiveElement.current?.focus();
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, item, populateForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = 'Titel ist erforderlich';
    if (!relevantDate) newErrors.relevantDate = 'Datum ist erforderlich';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(relevantDate)) newErrors.relevantDate = 'Format: YYYY-MM-DD';
    if (cost && (isNaN(Number(cost)) || Number(cost) < 0)) newErrors.cost = 'Betrag muss eine nicht-negative Zahl sein';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    setSubmitError('');

    const hasCost = cost && Number(cost) >= 0;
    const input: UpdateRadarItemInput = {
      title: title.trim(),
      category,
      relevantDate,
      cost: hasCost ? Number(cost) : undefined,
      currency: hasCost ? currency : undefined,
      reminderLeadDays: reminderLeadDays === '' ? undefined : Number(reminderLeadDays),
      notes: notes.trim() || undefined,
    };

    const res = await radarItemRepository.update(item!.id, input);
    if (!res.ok) {
      setSubmitError(res.error || 'Aktualisierung fehlgeschlagen');
      setIsSubmitting(false);
      return;
    }
    onSuccess();
    onClose();
    setIsSubmitting(false);
  };

  const handleReset = () => {
    populateForm();
    setErrors({});
    setSubmitError('');
  };

  if (!isOpen || !item) return null;

  const today = new Date().toISOString().split('T')[0];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-item-title"
    >
      <div className="w-full max-w-md bg-white dark:bg-slate-850 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700" onClick={e => e.stopPropagation()}>
        <header className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 id="edit-item-title" className="text-lg font-semibold text-slate-900 dark:text-white">Eintrag bearbeiten</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label="Schließen"
          >
            <X size={20} />
          </button>
        </header>

        <form ref={formRef} onSubmit={handleSubmit} className="p-4 space-y-4">
          {submitError && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm" role="alert">
              {submitError}
            </div>
          )}

          <div>
            <label htmlFor="edit-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titel *</label>
            <input
              ref={titleRef}
              id="edit-title"
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="z. B. Kündigungsfrist Internetvertrag"
              className={`w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.title ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600'
              } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
              aria-invalid={!!errors.title}
              aria-describedby={errors.title ? 'title-error' : undefined}
            />
            {errors.title && <p id="title-error" className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kategorie *</label>
            <select
              id="edit-category"
              value={category}
              onChange={e => setCategory(e.target.value as RadarItemCategory)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="edit-relevantDate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Relevantes Datum *</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <input
                id="edit-relevantDate"
                type="date"
                value={relevantDate}
                onChange={e => setRelevantDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full pl-10 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.relevantDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                aria-invalid={!!errors.relevantDate}
              />
            </div>
            {errors.relevantDate && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.relevantDate}</p>}
          </div>

          <div>
            <label htmlFor="edit-cost" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Kosten (optional)</label>
            <div className="relative">
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" aria-hidden="true" />
              <input
                id="edit-cost"
                type="number"
                step="0.01"
                min="0"
                value={cost}
                onChange={e => setCost(e.target.value)}
                placeholder="z. B. 12.99"
                className={`w-full pl-10 px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.cost ? 'border-red-500 focus:ring-red-500' : 'border-slate-300 dark:border-slate-600'
                } bg-white dark:bg-slate-800 text-slate-900 dark:text-white`}
                aria-invalid={!!errors.cost}
              />
            </div>
            {errors.cost && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.cost}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="edit-currency" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Währung</label>
              <select
                id="edit-currency"
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                disabled={!cost}
                className="w-full px-3 py-2 rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option value="EUR">EUR</option>
                <option value="USD">USD</option>
                <option value="CHF">CHF</option>
                <option value="GBP">GBP</option>
              </select>
            </div>
            <div>
              <label htmlFor="edit-reminderLeadDays" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Erinnerung</label>
              <select
                id="edit-reminderLeadDays"
                value={reminderLeadDays}
                onChange={e => setReminderLeadDays(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {REMINDER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="edit-notes" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notizen (optional)</label>
            <textarea
              id="edit-notes"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              placeholder="Zusätzliche Informationen..."
            />
          </div>

          <footer className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              Zurücksetzen
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Speichere…
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  Speichern
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};