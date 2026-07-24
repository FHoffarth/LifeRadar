import React, { useState } from 'react';
import { useAppState } from '../StateContext';
import { UploadCloud, FileText, CheckCircle2, Clock, AlertCircle, Mail, Image as ImageIcon, File } from 'lucide-react';
import { Badge } from '../components/Badge';
import { formatDate, translateCategory } from '../utils';

export const InboxScreen: React.FC = () => {
  const { inboxItems, simulateUpload } = useAppState();
  const [isUploading, setIsUploading] = useState(false);

  const handleSimulateUpload = () => {
    setIsUploading(true);
    // Simulate network/parsing delay
    setTimeout(() => {
      simulateUpload();
      setIsUploading(false);
    }, 1500);
  };

  const getFileMeta = (filename: string) => {
    const lower = filename.toLowerCase();
    if (lower.endsWith('.pdf')) return { label: 'PDF', icon: FileText };
    if (lower.endsWith('.eml')) return { label: 'E-Mail', icon: Mail };
    if (lower.endsWith('.jpg') || lower.endsWith('.png') || lower.endsWith('.jpeg')) return { label: 'Bild', icon: ImageIcon };
    return { label: 'Text', icon: File };
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-2 break-words">
          Deine Quellen
        </h1>
        <p className="text-slate-600 dark:text-slate-400 text-sm">
          Dokumente, E-Mails und Hinweise, aus denen LifeRadar seine Funde ableitet.
        </p>
      </header>

      {/* Upload Simulator Area */}
      <div className="bg-white dark:bg-slate-850 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-8 text-center transition-colors hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-300 dark:hover:border-indigo-600/50">
        <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <UploadCloud size={24} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Dokumenteneingang simulieren</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-6">
          Füge ein Dokument hinzu, um zu simulieren, wie LifeRadar Fristen, Kosten und Ansprüche findet. (Nur Demo, es findet kein echter Upload statt).
        </p>
        <button
          onClick={handleSimulateUpload}
          disabled={isUploading}
          className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-xl transition-colors disabled:opacity-70 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-850 active:scale-[0.98]"
        >
          {isUploading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Demo-Dokument wird ausgewertet ...
            </>
          ) : (
            'Upload simulieren'
          )}
        </button>
      </div>

      {/* Inbox List */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Letzte Aktivitäten
        </h2>
        <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl overflow-hidden shadow-sm">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {inboxItems.map((item) => {
              const fileMeta = getFileMeta(item.sourceName);
              const FileIcon = fileMeta.icon;
              
              return (
                <li key={item.id} className="p-4 sm:p-5 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="mt-1 p-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-500 dark:text-slate-400 shrink-0">
                      <FileIcon size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate">
                            {item.sourceName}
                          </p>
                          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                            {fileMeta.label}
                          </span>
                        </div>
                        <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums whitespace-nowrap">
                          {formatDate(item.dateAdded, 'datetime')}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {item.parsingStatus === 'Parsed' ? (
                          <span className="inline-flex items-center text-xs font-medium text-emerald-600 dark:text-emerald-400">
                            <CheckCircle2 size={14} className="mr-1" /> Verarbeitet
                          </span>
                        ) : item.parsingStatus === 'Pending' ? (
                          <span className="inline-flex items-center text-xs font-medium text-amber-600 dark:text-amber-400">
                            <Clock size={14} className="mr-1" /> Prüfung ausstehend
                          </span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-medium text-red-600 dark:text-red-400">
                            <AlertCircle size={14} className="mr-1" /> Fehlgeschlagen
                          </span>
                        )}

                        {item.detectedCategory && (
                          <>
                            <span className="text-slate-300 dark:text-slate-700">•</span>
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              Kategorie: {translateCategory(item.detectedCategory)}
                            </span>
                          </>
                        )}
                        
                        <div className="ml-auto">
                           <Badge 
                            text={item.status === 'Resolved' ? 'Erledigt' : 'Prüfung erforderlich'} 
                            variant={item.status === 'Resolved' ? 'success' : 'warning'} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
