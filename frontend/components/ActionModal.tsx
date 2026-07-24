import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldAlert } from 'lucide-react';
import { Finding, Status } from '../types';
import { translateStatus } from '../utils';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (status: Status) => void;
  finding: Finding | null;
}

export const ActionModal: React.FC<ActionModalProps> = ({ isOpen, onClose, onConfirm, finding }) => {
  const [selectedStatus, setSelectedStatus] = useState<Status>('Reviewed');
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      if (!previousFocusRef.current) {
        previousFocusRef.current = document.activeElement as HTMLElement;
      }
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const getFocusableElements = () => {
      if (!modalRef.current) return [];
      return Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
    };

    setTimeout(() => {
      const els = getFocusableElements();
      if (els.length > 0) els[0].focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      const els = getFocusableElements();
      if (els.length === 0) return;

      const first = els[0];
      const last = els[els.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) {
          last.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !finding) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="action-modal-title">
      <div ref={modalRef} className="bg-white dark:bg-slate-850 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none">
        
        <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
          <h3 id="action-modal-title" className="font-semibold text-slate-900 dark:text-slate-100">Prototyp-Aktion</h3>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95" aria-label="Schließen">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Ausgewählte Aktion für:</p>
            <p className="font-medium text-slate-900 dark:text-slate-100">{finding.title}</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex gap-3">
            <ShieldAlert className="text-slate-500 shrink-0 mt-0.5" size={20} />
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Sichere Prototyp-Umgebung</h4>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                LifeRadar darf niemals eine externe Aktion ohne ausdrückliche Bestätigung des Nutzers ausführen. Dies ist ein Prototyp. Ein Klick auf Bestätigen simuliert die Aktion nur und aktualisiert den lokalen Status.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Simulierte Schritte, die ausgeführt würden:</p>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
              <li>Entwurf basierend auf {finding.source} vorbereiten</li>
              <li>Checkliste zur Überprüfung öffnen</li>
              <li>Lokale Erinnerung zur Nachverfolgung erstellen</li>
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Element markieren als:</p>
            <div className="grid grid-cols-2 gap-2">
              {(['Reviewed', 'Resolved', 'Snoozed', 'Needs Clarification'] as Status[]).map(status => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-3 py-2 text-sm rounded-lg border transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] ${
                    selectedStatus === status
                      ? 'bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-300'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 dark:bg-slate-850 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800'
                  }`}
                >
                  {translateStatus(status)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]"
          >
            Abbrechen
          </button>
          <button 
            onClick={() => {
              onConfirm(selectedStatus);
              onClose();
            }}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-850 active:scale-[0.98]"
          >
            Bestätigen (Demo)
          </button>
        </div>
      </div>
    </div>
  );
};
