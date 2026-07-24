import React from 'react';
import { useAppState } from '../StateContext';
import { Shield, Moon, Sun, Monitor, Database, RefreshCw, Info, Download, Trash2, Bell, Palette, ShieldCheck, CreditCard, Sliders } from 'lucide-react';
import { generateCSV, downloadFile, formatDate } from '../utils';

export const SettingsScreen: React.FC = () => {
  const { theme, setTheme, resetDemo, findings, reminders, deleteReminder, clearReminders } = useAppState();

  const handleExportMoneyCSV = () => {
    const moneyFindings = findings.filter(f => f.category === 'Money' && (f.status === 'Open' || f.status === 'Needs Clarification'));
    const csv = generateCSV(moneyFindings);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(csv, `liferadar-geld-${dateStr}.csv`, 'text/csv;charset=utf-8');
  };

  const handleExportDeadlinesCSV = () => {
    const deadlineFindings = findings.filter(f => f.category === 'Deadline' && (f.status === 'Open' || f.status === 'Needs Clarification'));
    const csv = generateCSV(deadlineFindings);
    const dateStr = new Date().toISOString().split('T')[0];
    downloadFile(csv, `liferadar-fristen-${dateStr}.csv`, 'text/csv;charset=utf-8');
  };

  const handleExportAllJSON = () => {
    const json = JSON.stringify({ _exportNote: 'LifeRadar Demo-Export', findings }, null, 2);
    downloadFile(json, `liferadar-demo-uebersicht.json`, 'application/json;charset=utf-8');
  };

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 break-words">
          Einstellungen
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Präferenzen, Datenschutz und Prototyp-Steuerung.
        </p>
      </header>

      {/* Appearance */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Palette size={18} className="text-slate-400 dark:text-slate-500" /> Erscheinungsbild
        </h2>
        <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-2 flex flex-wrap gap-2 shadow-sm">
          {[
            { id: 'system', label: 'System', icon: Monitor },
            { id: 'light', label: 'Hell', icon: Sun },
            { id: 'dark', label: 'Dunkel', icon: Moon },
          ].map((t) => {
            const Icon = t.icon;
            const isActive = theme === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] ${
                  isActive 
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <Icon size={16} />
                {t.label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Exports & Reminders */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Download size={18} className="text-slate-400 dark:text-slate-500" /> Exporte & Erinnerungen
        </h2>
        <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-6 shadow-sm">
          
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Kalender- und Erinnerungsfunktionen arbeiten in diesem Prototyp lokal. Verwendete Zeitzone: <span className="font-medium">{Intl.DateTimeFormat().resolvedOptions().timeZone}</span>.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Bell size={16} className="text-slate-400" /> Lokale Erinnerungen ({reminders.length})
            </h3>
            {reminders.length > 0 ? (
              <div className="space-y-2 mb-4">
                {reminders.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700">
                    <div className="min-w-0 pr-4">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">{r.title}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">{formatDate(r.date, 'short')} {r.time}</p>
                    </div>
                    <button onClick={() => deleteReminder(r.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95" aria-label="Erinnerung löschen">
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
                <button onClick={clearReminders} className="text-xs font-medium text-red-600 dark:text-red-400 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-1">
                  Alle Erinnerungen löschen
                </button>
              </div>
            ) : (
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">Keine lokalen Erinnerungen gespeichert.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 space-y-2">
            <h3 className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-3">Listen exportieren</h3>
            <button onClick={handleExportMoneyCSV} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm text-slate-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
              <span>Geld & Ansprüche (CSV)</span>
              <Download size={16} className="text-slate-400" />
            </button>
            <button onClick={handleExportDeadlinesCSV} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm text-slate-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
              <span>Wichtige Fristen (CSV)</span>
              <Download size={16} className="text-slate-400" />
            </button>
            <button onClick={handleExportAllJSON} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm text-slate-700 dark:text-slate-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98]">
              <span>Kompletter Demo-Export (JSON)</span>
              <Download size={16} className="text-slate-400" />
            </button>
          </div>

        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <ShieldCheck size={18} className="text-slate-400 dark:text-slate-500" /> Vertrauens- & Datenschutzprinzipien
        </h2>
        <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-start gap-3">
            <Shield className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Lokale Verarbeitung zuerst</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Dokumente werden nach Möglichkeit lokal verarbeitet. Es werden keine persönlichen Daten verkauft.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Info className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Keine automatischen Aktionen</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                LifeRadar kündigt niemals einen Vertrag oder sendet eine E-Mail ohne ausdrückliche Bestätigung.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Database className="text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">Nachvollziehbare Grundlage</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Jedes Ergebnis zeigt genau, woher es stammt (Beobachtet, Berechnet, Geschätzt oder Unbekannt).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Business Model Concept (Subtle) */}
      <section className="space-y-4">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <CreditCard size={18} className="text-slate-400 dark:text-slate-500" /> Kontomodell (Konzept)
        </h2>
        <div className="bg-slate-50 dark:bg-slate-900/50 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-5 sm:p-6">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
            Dieser Prototyp demonstriert den Kernnutzen. Ein echtes Produkt würde Folgendes bieten:
          </p>
          <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-2.5 list-disc pl-5">
            <li><strong className="font-medium text-slate-700 dark:text-slate-300">Kostenlos:</strong> Manuelle Importe, grundlegende Fristenerinnerungen.</li>
            <li><strong className="font-medium text-slate-700 dark:text-slate-300">Premium:</strong> Regelmäßige Überwachung, erweiterte Quellenanbindungen.</li>
            <li><strong className="font-medium text-slate-700 dark:text-slate-300">Optionale Erfolgsgebühr:</strong> Nur für tatsächlich zurückgewonnenes Geld, nach ausdrücklicher Zustimmung.</li>
          </ul>
          <p className="text-xs text-slate-500 mt-5 italic">Keine Werbung. Keine gesponserten Platzierungen.</p>
        </div>
      </section>

      {/* Prototype Controls */}
      <section className="space-y-4 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Sliders size={18} className="text-slate-400 dark:text-slate-500" /> Prototyp-Steuerung
        </h2>
        <button
          onClick={resetDemo}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-sm font-medium text-slate-700 dark:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-[0.98] shadow-sm"
        >
          <RefreshCw size={16} />
          Demo-Daten zurücksetzen
        </button>
      </section>
      
      <div className="pb-8"></div>
    </div>
  );
};
