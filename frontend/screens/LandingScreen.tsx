import React from 'react';
import { ArrowRight, Play, Clock, Eye, CheckCircle2, HardDrive, MousePointerClick, FileText } from 'lucide-react';
import { BrandLockup } from '../components/Logo';

interface LandingScreenProps {
  onStart: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const scrollToDemo = () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.getElementById('demo-example')?.scrollIntoView({ 
      behavior: prefersReducedMotion ? 'auto' : 'smooth' 
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-100/50 via-slate-50 to-slate-50 dark:from-slate-800/30 dark:via-slate-900 dark:to-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Header */}
      <header className="px-6 py-6 flex justify-between items-center max-w-7xl mx-auto w-full z-10">
        <BrandLockup size="md" />
        <button 
          onClick={onStart} 
          className="text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded px-2 py-1"
        >
          LifeRadar öffnen
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-6 max-w-7xl mx-auto w-full flex flex-col justify-center py-12 lg:py-20">
        <div className="grid lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left: Copy */}
          <div className="lg:col-span-7 space-y-10 max-w-2xl">
            <div className="space-y-6">
              <span className="inline-block text-sm font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
                Wir haben dein Leben auf dem Schirm.
              </span>
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-slate-900 dark:text-white tracking-tight leading-[1.15] sm:leading-[1.1] break-words hyphens-auto">
                Was du sonst zu spät bemerken würdest.
              </h1>
              <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl">
                LifeRadar macht Fristen, stille Kosten und offene Ansprüche sichtbar — und zeigt dir, was als Nächstes sinnvoll ist.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart} 
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all duration-200 motion-reduce:transition-none shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-[0.98]"
              >
                LifeRadar öffnen
              </button>
              <button 
                onClick={scrollToDemo} 
                className="inline-flex items-center justify-center px-7 py-3.5 text-base font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 motion-reduce:transition-none shadow-sm hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 active:scale-[0.98]"
              >
                <Play size={18} className="mr-2.5 opacity-70" /> Demo ansehen
              </button>
            </div>

            <div className="flex flex-col gap-4 pt-4">
              <div className="flex items-center gap-3.5 text-slate-700 dark:text-slate-300">
                <Clock size={20} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span className="text-base font-medium">Fristen früh erkennen</span>
              </div>
              <div className="flex items-center gap-3.5 text-slate-700 dark:text-slate-300">
                <Eye size={20} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span className="text-base font-medium">Stille Kosten sichtbar machen</span>
              </div>
              <div className="flex items-center gap-3.5 text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={20} className="text-indigo-500 dark:text-indigo-400 shrink-0" />
                <span className="text-base font-medium">Offene Ansprüche nicht verlieren</span>
              </div>
            </div>
          </div>

          {/* Right: Example Card */}
          <div id="demo-example" className="lg:col-span-5 relative w-full max-w-md mx-auto lg:ml-auto lg:mr-0 scroll-mt-12">
            {/* Decorative background blur */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-100/80 to-slate-100 dark:from-indigo-900/20 dark:to-slate-800/20 rounded-[2rem] blur-2xl opacity-60 dark:opacity-40 pointer-events-none"></div>
            
            <div className="bg-white dark:bg-slate-850 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-7 sm:p-8 shadow-xl shadow-slate-200/40 dark:shadow-2xl dark:shadow-slate-900/50 relative overflow-hidden">
              
              <div className="flex flex-wrap gap-2.5 mb-6">
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                  Demo-Beispiel
                </span>
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-300 dark:border-indigo-800/50">
                  <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-indigo-500"></span>
                  Grundlage: Beobachtet
                </span>
              </div>

              <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 mb-3 tabular-nums">
                Mögliche Mehrkosten: 204,00 € pro Jahr
              </p>
              
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-8 leading-snug break-words hyphens-auto">
                Dein Internetvertrag wird nächsten Monat 17,00 € teurer.
              </h3>
              
              <div className="space-y-1 text-sm text-slate-600 dark:text-slate-400 mb-8">
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="font-medium text-slate-900 dark:text-slate-200">Quelle</span>
                  <span>Beispielrechnung</span>
                </div>
                <div className="flex justify-between py-3 border-b border-slate-100 dark:border-slate-800/60">
                  <span className="font-medium text-slate-900 dark:text-slate-200">Grundlage</span>
                  <span>Beobachtet</span>
                </div>
                <div className="flex justify-between py-3">
                  <span className="font-medium text-slate-900 dark:text-slate-200">Status</span>
                  <span className="text-slate-500 dark:text-slate-400">Demo-Beispiel</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60">
                <button 
                  onClick={onStart} 
                  className="group w-full flex items-center justify-between text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-lg px-2 py-1.5 -ml-2 active:scale-[0.98]"
                >
                  Kündigungsoptionen prüfen 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform motion-reduce:transition-none" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Strip */}
        <div className="mt-24 lg:mt-32 pt-10 border-t border-slate-200/80 dark:border-slate-800/80 pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6">
            <div className="flex items-center gap-4">
              <div className="text-slate-400 dark:text-slate-500 shrink-0">
                <HardDrive size={24}/>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Lokal gedacht</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-slate-400 dark:text-slate-500 shrink-0">
                <MousePointerClick size={24}/>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Keine automatischen Aktionen</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-slate-400 dark:text-slate-500 shrink-0">
                <FileText size={24}/>
              </div>
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Jede Empfehlung mit Quelle</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
