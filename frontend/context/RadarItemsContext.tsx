import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { RadarItem, CreateRadarItemInput, UpdateRadarItemInput } from '../types';
import { radarItemRepository, Result, isStorageAvailable } from '../repository/radarItemRepository';

interface RadarItemsContextType {
  items: RadarItem[];
  loading: boolean;
  error: string | null;
  createItem: (input: CreateRadarItemInput) => Promise<RadarItem | null>;
  updateItem: (id: string, changes: UpdateRadarItemInput) => Promise<RadarItem | null>;
  deleteItem: (id: string) => Promise<boolean>;
  toggleStatus: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
  storageAvailable: boolean;
}

const RadarItemsContext = createContext<RadarItemsContextType | undefined>(undefined);

interface RadarItemsProviderProps {
  children: ReactNode;
}

export const RadarItemsProvider: React.FC<RadarItemsProviderProps> = ({ children }) => {
  const [items, setItems] = useState<RadarItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageAvailable, setStorageAvailable] = useState(false);

  const loadItems = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = radarItemRepository.list();
      if (!res.ok) throw new Error(res.error);
      setItems(res.value);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Fehler beim Laden');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const available = isStorageAvailable();
    setStorageAvailable(available);
    if (available) {
      loadItems();
    } else {
      setError('Lokaler Speicher nicht verfügbar');
      setLoading(false);
    }
  }, []);

  const createItem = async (input: CreateRadarItemInput): Promise<RadarItem | null> => {
    try {
      const res = radarItemRepository.create(input);
      if (!res.ok) {
        setError(res.error);
        return null;
      }
      setItems(prev => [...prev, res.value].sort((a, b) => {
        if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
        return a.relevantDate.localeCompare(b.relevantDate);
      }));
      return res.value;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erstellung fehlgeschlagen');
      return null;
    }
  };

  const updateItem = async (id: string, changes: UpdateRadarItemInput): Promise<RadarItem | null> => {
    const res = radarItemRepository.update(id, changes);
    if (!res.ok) {
      setError(res.error);
      return null;
    }
    setItems(prev => prev.map(item => item.id === id ? res.value : item));
    return res.value;
  };

  const deleteItem = async (id: string): Promise<boolean> => {
    const res = radarItemRepository.remove(id);
    if (!res.ok) {
      setError(res.error);
      return false;
    }
    setItems(prev => prev.filter(item => item.id !== id));
    return true;
  };

  const toggleStatus = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;
    const newStatus = item.status === 'active' ? 'completed' : 'active';
    await updateItem(id, { status: newStatus });
  };

  const refresh = async () => {
    await loadItems();
  };

  return (
    <RadarItemsContext.Provider value={{
      items,
      loading,
      error,
      createItem,
      updateItem,
      deleteItem,
      toggleStatus,
      refresh,
      storageAvailable,
    }}>
      {children}
    </RadarItemsContext.Provider>
  );
};

export const useRadarItems = () => {
  const context = useContext(RadarItemsContext);
  if (!context) {
    throw new Error('useRadarItems must be used within a RadarItemsProvider');
  }
  return context;
};