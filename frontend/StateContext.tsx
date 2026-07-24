import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Finding, InboxItem, Status, Theme, Reminder } from './types';
import { DEMO_FINDINGS, DEMO_INBOX_ITEMS } from './constants';

interface StateContextType {
  findings: Finding[];
  inboxItems: InboxItem[];
  reminders: Reminder[];
  theme: Theme;
  toastMessage: string | null;
  setTheme: (theme: Theme) => void;
  updateFindingStatus: (id: string, status: Status) => void;
  simulateUpload: () => void;
  resetDemo: () => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  updateReminder: (reminder: Reminder) => void;
  deleteReminder: (id: string) => void;
  clearReminders: () => void;
  showToast: (msg: string) => void;
}

const StateContext = createContext<StateContextType | undefined>(undefined);

export const StateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [findings, setFindings] = useState<Finding[]>(DEMO_FINDINGS);
  const [inboxItems, setInboxItems] = useState<InboxItem[]>(DEMO_INBOX_ITEMS);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [theme, setThemeState] = useState<Theme>('system');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load persisted data
  useEffect(() => {
    const savedTheme = localStorage.getItem('liferadar-theme') as Theme;
    if (savedTheme) setThemeState(savedTheme);

    const savedReminders = localStorage.getItem('liferadar-reminders');
    if (savedReminders) {
      try {
        setReminders(JSON.parse(savedReminders));
      } catch (e) {
        console.error('Failed to parse reminders', e);
      }
    }
  }, []);

  // Theme handling
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem('liferadar-theme', theme);
  }, [theme]);

  // Persist reminders
  useEffect(() => {
    localStorage.setItem('liferadar-reminders', JSON.stringify(reminders));
  }, [reminders]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const updateFindingStatus = (id: string, status: Status) => {
    setFindings(prev => prev.map(f => f.id === id ? { ...f, status } : f));
  };

  const simulateUpload = () => {
    const newItemId = `i${Date.now()}`;
    const newFindingId = `f${Date.now()}`;
    
    const newInboxItem: InboxItem = {
      id: newItemId,
      sourceName: 'Simulated_Upload_Doc.pdf',
      dateAdded: new Date().toISOString(),
      parsingStatus: 'Parsed',
      detectedCategory: 'Deadline',
      status: 'Needs Review',
      linkedFindingId: newFindingId
    };

    const newFinding: Finding = {
      id: newFindingId,
      title: 'Simuliertes Ergebnis aus neuem Upload',
      consequence: 'Dies ist eine Demo-Konsequenz',
      source: 'Simulated_Upload_Doc.pdf',
      evidenceLevel: 'Estimated',
      category: 'Deadline',
      actionLabel: 'Simuliertes Ergebnis prüfen',
      status: 'Open',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    setInboxItems(prev => [newInboxItem, ...prev]);
    setFindings(prev => [newFinding, ...prev]);
  };

  const resetDemo = () => {
    setFindings(DEMO_FINDINGS);
    setInboxItems(DEMO_INBOX_ITEMS);
    setReminders([]);
  };

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder = { ...reminder, id: `r${Date.now()}` };
    setReminders(prev => [...prev, newReminder]);
  };

  const updateReminder = (reminder: Reminder) => {
    setReminders(prev => prev.map(r => r.id === reminder.id ? reminder : r));
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(r => r.id !== id));
  };

  const clearReminders = () => {
    setReminders([]);
  };

  return (
    <StateContext.Provider value={{
      findings,
      inboxItems,
      reminders,
      theme,
      toastMessage,
      setTheme,
      updateFindingStatus,
      simulateUpload,
      resetDemo,
      addReminder,
      updateReminder,
      deleteReminder,
      clearReminders,
      showToast
    }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
};
