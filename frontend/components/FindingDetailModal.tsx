import React, { useState, useEffect, useRef } from 'react';
import { X, ShieldAlert, Download, Printer, Bell, Calendar as CalendarIcon, ArrowLeft } from 'lucide-react';
import { Finding, Status } from '../types';
import { translateStatus, downloadFile, generateICS, generateGoogleCalendarUrl, printFinding, translateEvidence } from '../utils';
import { useAppState } from '../StateContext';

interface FindingDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  finding: Finding | null;
  initialView?: 'overview' | 'action';
}

type ViewState = 'overview' | 'action' | 'reminder' | 'calendar' | 'export';

export const FindingDetailModal: React.FC<FindingDetailModalProps> = ({ isOpen, onClose, finding, initialView = 'overview' }) => {
  const { updateFindingStatus, addReminder, showToast } = useAppState();
  const [view, setView] = useState<ViewState>(initialView);
  const [selectedStatus, setSelectedStatus] = useState<Status>('Reviewed');
  
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Reminder Form State
  const [remDate, setRemDate] = useState('');
  const [remTime, setRemTime] = useState('09:00');
  const [remTitle, setRemTitle] = useState('');
  const [remNote, setRemNote] = useState('');
  const [remAdvance, setRemAdvance] = useState<'0'|'1'|'3'|'7'>('1');

  // Calendar Form State
  const [calDate, setCalDate] = useState('');
  const [calTime, setCalTime] = useState('');
  const [calDuration, setCalDuration] = useState(60);
  const [calTitle, setCalTitle] = useState('');
  const [calDesc, setCalDesc] = useState('');
  const [calReminderNote, setCalReminderNote] = useState('');

  // Initialize state and manage body scroll / return focus
  useEffect(() => {
    if (isOpen && finding) {
      setView(initialView);
      setSelectedStatus(finding.status === 'Open' ? 'Reviewed' : finding.status);
      
      const defaultDate = finding.date ? finding.date.split('T')[0] : new Date().toISOString().split('T')[0];
      setRemDate(defaultDate);
      setRemTitle(`Erinnerung: ${finding.title}`);
      setRemNote(`Konsequenz: ${finding.consequence}\nQuelle: ${finding.source}`);
      
      setCalDate(defaultDate);
      setCalTime('');
      setCalDuration(60);
      setCalTitle(finding.title);
      setCalDesc(`LifeRadar Fund\n\nKonsequenz: ${finding.consequence}\nQuelle: ${finding.source}\nNächster Schritt: ${finding.actionLabel}`);
      setCalReminderNote('Bitte Frist prüfen.');

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
  }, [isOpen, finding, initialView]);

  // Focus trap and Escape key listener
  useEffect(() => {
    if (!isOpen) return;

    const getFocusableElements = () => {
      if (!modalRef.current) return [];
      return Array.from(modalRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      ));
    };

    // Focus first element when view changes
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
  }, [isOpen, view, onClose]);

  if (!isOpen || !finding) return null;

  const handleConfirmAction = () => {
    updateFindingStatus(finding.id, selectedStatus);
    showToast(`Als ${translateStatus(selectedStatus).toLowerCase()} markiert.`);
    onClose();
  };

  const handleSaveReminder = () => {
    addReminder({
      findingId: finding.id,
      title: remTitle,
      date: remDate,
      time: remTime,
      note: remNote,
      advanceNotice: remAdvance
    });
    showToast('Lokale Erinnerung gespeichert.');
    onClose();
  };

  const getFullCalDesc = () => {
    return calReminderNote ? `${calDesc}\n\nErinnerungsnotiz:\n${calReminderNote}` : calDesc;
  };

  const handleDownloadICS = () => {
    const icsContent = generateICS(finding, {
      title: calTitle,
      date: calDate,
      time: calTime,
      duration: calDuration,
      description: getFullCalDesc()
    });
    downloadFile(icsContent, `liferadar-termin-${finding.id}.ics`, 'text/calendar;charset=utf-8');
    showToast('ICS-Datei ist bereit. Noch nicht zum Kalender hinzugefügt.');
    onClose();
  };

  const handleGoogleCalendar = () => {
    const url = generateGoogleCalendarUrl({
      title: calTitle,
      date: calDate,
      time: calTime,
      duration: calDuration,
      description: getFullCalDesc()
    });
    window.open(url, '_blank');
    showToast('Kalendereintrag vorbereitet. Noch nicht zum Kalender hinzugefügt.');
    onClose();
  };

  const handleCopyDetails = () => {
    const details = `Titel: ${calTitle}\nDatum: ${calDate}\nUhrzeit: ${calTime || 'Ganztägig'}\nDauer: ${calDuration} Min.\n\nBeschreibung:\n${getFullCalDesc()}`;
    navigator.clipboard.writeText(details);
    showToast('Kalenderdetails kopiert. Noch nicht zum Kalender hinzugefügt.');
    onClose();
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify({ ...finding, _exportNote: 'LifeRadar Demo-Export' }, null, 2);
    downloadFile(jsonContent, `liferadar-fund-${finding.id}.json`, 'application/json;charset=utf-8');
    showToast('Export erstellt.');
    onClose();
  };

  const handlePrint = () => {
    printFinding(finding);
  };

  const renderHeader = (title: string, showBack: boolean = true) => (
    <div className="flex justify-between items-center p-4 border-b border-slate-100 dark:border-slate-800">
      <div className="flex items-center gap-2">
        {showBack && view !== 'overview' && (
          <button onClick={() => setView('overview')} className="p-1 -ml-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95" aria-label="Zurück">
            <ArrowLeft size={20} />
          </button>
        )}
        <h3 id="modal-title" className="font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      </div>
      <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95" aria-label="Schließen">
        <X size={20} />
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div ref={modalRef} className="bg-white dark:bg-slate-850 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none max-h-[90vh] flex flex-col">
        
        {view === 'overview' && (
          <>
            {renderHeader('Details', false)}
            <div className="p-6 overflow-y-auto">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 break-words hyphens-auto">{finding.title}</h2>
              
              <div className="space-y-4 mb-8">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Konsequenz</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 break-words">{finding.consequence}</p>
                </div>
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800/50">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Quelle & Grundlage</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 break-words">{finding.source} ({translateEvidence(finding.evidenceLevel)})</p>
                </div>
              </div>

              <div className="space-y-3">
                <button 
                  onClick={() => setView('action')}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-850 active:scale-[0.98]"
                >
                  {finding.actionLabel}
                </button>
                
                <div className="grid grid-cols-1 gap-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button onClick={() => setView('reminder')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                    <Bell size={18} className="text-slate-400" /> Erinnerung erstellen
                  </button>
                  <button onClick={() => setView('calendar')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                    <CalendarIcon size={18} className="text-slate-400" /> Kalendereintrag vorbereiten
                  </button>
                  <button onClick={() => setView('export')} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                    <Download size={18} className="text-slate-400" /> Exportieren
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {view === 'action' && (
          <>
            {renderHeader('Prototyp-Aktion')}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 rounded-xl p-4 flex gap-3">
                <ShieldAlert className="text-slate-500 shrink-0 mt-0.5" size={20} />
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">Sichere Prototyp-Umgebung</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Dieser Prototyp führt keine externen Aktionen aus. Ein Klick auf Bestätigen simuliert die Aktion nur und aktualisiert den lokalen Status.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">Simulierte Schritte:</p>
                <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2 list-disc pl-5">
                  <li>Entwurf basierend auf {finding.source} vorbereiten</li>
                  <li>Checkliste zur Überprüfung öffnen</li>
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
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onClick={handleConfirmAction} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-850 active:scale-[0.98]">
                Bestätigen (Demo)
              </button>
            </div>
          </>
        )}

        {view === 'reminder' && (
          <>
            {renderHeader('Erinnerung erstellen')}
            <div className="p-6 overflow-y-auto space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg border border-slate-100 dark:border-slate-700 mb-4">
                <p className="text-xs text-slate-500 dark:text-slate-400">Lokale Prototyp-Erinnerung</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titel</label>
                <input type="text" value={remTitle} onChange={e => setRemTitle(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Datum</label>
                  <input type="date" value={remDate} onChange={e => setRemDate(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm tabular-nums focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Uhrzeit</label>
                  <input type="time" value={remTime} onChange={e => setRemTime(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm tabular-nums focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Vorlaufzeit</label>
                <select value={remAdvance} onChange={e => setRemAdvance(e.target.value as any)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none">
                  <option value="0">Am selben Tag</option>
                  <option value="1">1 Tag vorher</option>
                  <option value="3">3 Tage vorher</option>
                  <option value="7">7 Tage vorher</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Notiz</label>
                <textarea value={remNote} onChange={e => setRemNote(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button onClick={handleSaveReminder} className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-850 active:scale-[0.98]">
                Speichern
              </button>
            </div>
          </>
        )}

        {view === 'calendar' && (
          <>
            {renderHeader('Kalendereintrag vorbereiten')}
            <div className="p-6 overflow-y-auto space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Titel</label>
                <input type="text" value={calTitle} onChange={e => setCalTitle(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Datum</label>
                  <input type="date" value={calDate} onChange={e => setCalDate(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm tabular-nums focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Uhrzeit (Optional)</label>
                  <input type="time" value={calTime} onChange={e => setCalTime(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm tabular-nums focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Dauer (Minuten)</label>
                  <input type="number" value={calDuration} onChange={e => setCalDuration(Number(e.target.value))} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm tabular-nums focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Beschreibung</label>
                <textarea value={calDesc} onChange={e => setCalDesc(e.target.value)} rows={3} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Erinnerungsnotiz</label>
                <input type="text" value={calReminderNote} onChange={e => setCalReminderNote(e.target.value)} className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <button onClick={handleDownloadICS} className="w-full flex flex-col items-center justify-center p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-850 active:scale-[0.98]">
                <span className="text-sm font-medium">ICS-Datei herunterladen</span>
                <span className="text-xs text-indigo-200">Für Apple Kalender oder iCloud vorbereiten</span>
              </button>
              <button onClick={handleGoogleCalendar} className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                In Google Kalender öffnen
              </button>
              <button onClick={handleCopyDetails} className="w-full flex items-center justify-center gap-2 p-3 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl transition-colors text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                Kalenderdetails kopieren
              </button>
            </div>
          </>
        )}

        {view === 'export' && (
          <>
            {renderHeader('Exportieren')}
            <div className="p-6 overflow-y-auto space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                LifeRadar Demo-Export. Wähle ein Format für diesen Fund.
              </p>
              <button onClick={handlePrint} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                <Printer size={20} className="text-slate-400" /> Druckansicht öffnen
              </button>
              <button onClick={handleExportJSON} className="w-full flex items-center justify-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
                <Download size={20} className="text-slate-400" /> Als JSON herunterladen
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};
