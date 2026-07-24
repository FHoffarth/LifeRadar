import React from 'react';
import { LayoutDashboard, Wallet, CalendarClock, Inbox, Settings } from 'lucide-react';
import { BrandLockup } from './Logo';
import { Toast } from './Toast';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'today', label: 'Heute', shortLabel: 'Heute', icon: LayoutDashboard },
    { id: 'money', label: 'Geld & Ansprüche', shortLabel: 'Geld', icon: Wallet },
    { id: 'deadlines', label: 'Wichtige Fristen', shortLabel: 'Fristen', icon: CalendarClock },
    { id: 'inbox', label: 'Deine Quellen', shortLabel: 'Quellen', icon: Inbox },
    { id: 'settings', label: 'Einstellungen', shortLabel: 'Einstellungen', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 dark:bg-slate-900">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-850 fixed h-full z-10">
        <div className="p-6">
          <BrandLockup size="md" />
        </div>
        
        <nav className="flex-1 px-4 space-y-1.5 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 active:scale-[0.98] ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' 
                    : 'text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800/50'
                }`}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} className={isActive ? 'text-indigo-600 dark:text-indigo-400' : 'opacity-70'} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 m-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
            Prototyp-Umgebung<br/>Keine externe Verbindung
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pb-20 md:pb-0 min-h-screen relative">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 dark:bg-slate-850/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center">
          <BrandLockup size="sm" />
        </header>
        
        <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 animate-in fade-in duration-300 motion-reduce:animate-none">
          {children}
        </div>
        
        <Toast />
      </main>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 w-full bg-white dark:bg-slate-850 border-t border-slate-200 dark:border-slate-800 pb-safe z-20">
        <div className="flex justify-around items-center h-16 px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] space-y-1 transition-colors duration-200 motion-reduce:transition-none rounded-lg mx-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-indigo-500 active:scale-95 ${
                  isActive 
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
                aria-label={item.label}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={20} className={`shrink-0 ${isActive ? 'stroke-[2.5px]' : 'stroke-2 opacity-80'}`} />
                <span className="text-[10px] font-medium text-center leading-tight px-0.5 w-full truncate">
                  {item.shortLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
