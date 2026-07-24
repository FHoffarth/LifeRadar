import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { useAppState } from '../StateContext';

export const Toast: React.FC = () => {
  const { toastMessage } = useAppState();
  
  if (!toastMessage) return null;
  
  return (
    <div className="fixed bottom-24 md:bottom-10 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300 motion-reduce:animate-none pointer-events-none">
      <div 
        className="bg-slate-800 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 pointer-events-auto" 
        role="status" 
        aria-live="polite"
      >
        <CheckCircle2 size={18} className="text-emerald-400 dark:text-emerald-600 shrink-0" />
        <span className="text-sm font-medium">{toastMessage}</span>
      </div>
    </div>
  );
};
