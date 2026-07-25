import {
  RadarItem,
  CreateRadarItemInput,
  UpdateRadarItemInput,
  RadarItemCategory,
  RadarItemStatus,
  RadarItemCertainty,
} from '../types';

const STORAGE_KEY = 'liferadar-radar-items-v1';
const SCHEMA_VERSION = 1;

export interface StoredRadarData {
  schemaVersion: number;
  items: RadarItem[];
}

export interface RepositoryResult<T> {
  ok: true;
  value: T;
}

export interface RepositoryError {
  ok: false;
  error: string;
}

export type Result<T> = RepositoryResult<T> | RepositoryError;

function ok<T>(value: T): RepositoryResult<T> {
  return { ok: true, value };
}

function err(error: string): RepositoryError {
  return { ok: false, error };
}

function generateId(): string {
  return `ri_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

function nowISO(): string {
  return new Date().toISOString();
}

function validateTitle(title: string): string {
  const trimmed = title.trim();
  if (!trimmed) throw new Error('Titel ist erforderlich');
  if (trimmed.length > 120) throw new Error('Titel darf maximal 120 Zeichen lang sein');
  return trimmed;
}

function validateCategory(category: string): RadarItemCategory {
  const validCategories: RadarItemCategory[] = [
    'contract', 'insurance', 'subscription', 'tax', 'warranty', 'application', 'other',
  ];
  if (!validCategories.includes(category as RadarItemCategory)) {
    throw new Error('Ungültige Kategorie');
  }
  return category as RadarItemCategory;
}

function validateRelevantDate(date: string): string {
  const match = date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) throw new Error('relevantDate muss YYYY-MM-DD sein');
  const [, y, m, d] = match.map(Number);
  const d0 = new Date(y, m - 1, d);
  if (d0.getFullYear() !== y || d0.getMonth() !== m - 1 || d0.getDate() !== d) {
    throw new Error('Ungültiges Datum');
  }
  return date;
}

function validateCost(cost: number | undefined | null): number | undefined {
  if (cost === undefined || cost === null) return undefined;
  if (!Number.isFinite(cost) || cost < 0) throw new Error('Kosten müssen eine nicht-negative endliche Zahl sein');
  return cost;
}

function validateCurrency(currency: string | undefined, hasCost: boolean): string | undefined {
  if (!currency) return undefined;
  if (!hasCost) throw new Error('Währung nur erlaubt wenn Kosten angegeben sind');
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error('Währung muss 3-stelliger ISO-Code sein');
  return currency;
}

function validateReminderLeadDays(days: number | undefined | null): number | undefined {
  if (days === undefined || days === null) return undefined;
  if (!Number.isInteger(days) || days < 0) throw new Error('reminderLeadDays muss eine nicht-negative Ganzzahl sein');
  return days;
}

function validateNotes(notes: string | undefined | null): string | undefined {
  if (!notes) return undefined;
  const trimmed = notes.trim();
  if (!trimmed) return undefined;
  if (trimmed.length > 2000) throw new Error('Notizen dürfen maximal 2000 Zeichen lang sein');
  return trimmed;
}

function validateStatus(status: string): RadarItemStatus {
  if (status !== 'active' && status !== 'completed') throw new Error('Ungültiger Status');
  return status as RadarItemStatus;
}

function validateCertainty(certainty: string): RadarItemCertainty {
  const valid: RadarItemCertainty[] = ['self-entered', 'calculated', 'estimated', 'unknown'];
  if (!valid.includes(certainty as RadarItemCertainty)) throw new Error('Ungültige Gewissheit');
  return certainty as RadarItemCertainty;
}

function validateItem(item: unknown): RadarItem {
  if (!item || typeof item !== 'object') throw new Error('Kein Objekt');
  const i = item as Record<string, unknown>;

  const id = typeof i.id === 'string' ? i.id : '';
  const title = typeof i.title === 'string' ? i.title : '';
  const category = typeof i.category === 'string' ? i.category : '';
  const relevantDate = typeof i.relevantDate === 'string' ? i.relevantDate : '';
  const cost = typeof i.cost === 'number' ? i.cost : i.cost === undefined ? undefined : null;
  const currency = typeof i.currency === 'string' ? i.currency : i.currency === undefined ? undefined : null;
  const reminderLeadDays = typeof i.reminderLeadDays === 'number' ? i.reminderLeadDays : i.reminderLeadDays === undefined ? undefined : null;
  const status = typeof i.status === 'string' ? i.status : '';
  const certainty = typeof i.certainty === 'string' ? i.certainty : '';
  const notes = typeof i.notes === 'string' ? i.notes : i.notes === undefined ? undefined : null;
  const createdAt = typeof i.createdAt === 'string' ? i.createdAt : '';
  const updatedAt = typeof i.updatedAt === 'string' ? i.updatedAt : '';

  if (!id) throw new Error('Fehlende ID');
  validateTitle(title);
  validateCategory(category);
  validateRelevantDate(relevantDate);
  if (cost !== undefined) validateCost(cost);
  if (currency !== undefined) validateCurrency(currency, cost !== undefined);
  if (reminderLeadDays !== undefined) validateReminderLeadDays(reminderLeadDays);
  validateStatus(status);
  validateCertainty(certainty);
  if (notes !== undefined) validateNotes(notes);
  if (!createdAt) throw new Error('Fehlendes createdAt');
  if (!updatedAt) throw new Error('Fehlendes updatedAt');

  return {
    id,
    title,
    category,
    relevantDate,
    cost,
    currency,
    reminderLeadDays,
    status,
    certainty,
    notes,
    createdAt,
    updatedAt,
  };
}

function readStorage(): Result<StoredRadarData> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return ok({ schemaVersion: SCHEMA_VERSION, items: [] });
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('Ungültiges Speicherformat');
    const version = typeof parsed.schemaVersion === 'number' ? parsed.schemaVersion : 0;
    if (version !== SCHEMA_VERSION) {
      return err(`Nicht unterstützte Schema-Version ${version}, erwartet ${SCHEMA_VERSION}`);
    }
    if (!Array.isArray(parsed.items)) throw new Error('Items kein Array');
    return ok({ schemaVersion: SCHEMA_VERSION, items: parsed.items });
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Speicher konnte nicht gelesen werden');
  }
}

function writeStorage(data: StoredRadarData): Result<void> {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return ok(undefined);
  } catch (e) {
    return err(e instanceof Error ? e.message : 'Speichern fehlgeschlagen');
  }
}

export const radarItemRepository = {
  list(): Result<RadarItem[]> {
    const res = readStorage();
    if (!res.ok) return res;
    const valid: RadarItem[] = [];
    for (const item of res.value.items) {
      try {
        valid.push(validateItem(item));
      } catch {
        // Malformed records skipped, valid ones preserved
      }
    }
    return ok(valid.sort((a, b) => {
      if (a.status !== b.status) return a.status === 'active' ? -1 : 1;
      return a.relevantDate.localeCompare(b.relevantDate);
    }));
  },

  create(input: CreateRadarItemInput): Result<RadarItem> {
    const title = validateTitle(input.title);
    const category = validateCategory(input.category);
    const relevantDate = validateRelevantDate(input.relevantDate);
    const cost = validateCost(input.cost);
    const currency = validateCurrency(input.currency, cost !== undefined);
    const reminderLeadDays = validateReminderLeadDays(input.reminderLeadDays);
    const notes = validateNotes(input.notes);
    const now = nowISO();

    const item: RadarItem = {
      id: generateId(),
      title,
      category,
      relevantDate,
      cost,
      currency,
      reminderLeadDays,
      status: 'active',
      certainty: 'self-entered',
      notes,
      createdAt: now,
      updatedAt: now,
    };

    const readRes = readStorage();
    if (!readRes.ok) return readRes;
    const data: StoredRadarData = { schemaVersion: SCHEMA_VERSION, items: [...readRes.value.items, item] };
    const writeRes = writeStorage(data);
    if (!writeRes.ok) return writeRes;
    return ok(item);
  },

  update(id: string, changes: UpdateRadarItemInput): Result<RadarItem> {
    const readRes = readStorage();
    if (!readRes.ok) return readRes;
    const idx = readRes.value.items.findIndex(i => i.id === id);
    if (idx === -1) return err('Eintrag nicht gefunden');

    const current = readRes.value.items[idx];
    try {
      const title = changes.title !== undefined ? validateTitle(changes.title) : current.title;
      const category = changes.category !== undefined ? validateCategory(changes.category) : current.category;
      const relevantDate = changes.relevantDate !== undefined ? validateRelevantDate(changes.relevantDate) : current.relevantDate;
      const cost = changes.cost !== undefined ? validateCost(changes.cost) : current.cost;
      const currency = changes.currency !== undefined ? validateCurrency(changes.currency, cost !== undefined) : current.currency;
      const reminderLeadDays = changes.reminderLeadDays !== undefined ? validateReminderLeadDays(changes.reminderLeadDays) : current.reminderLeadDays;
      const status = changes.status !== undefined ? validateStatus(changes.status) : current.status;
      const notes = changes.notes !== undefined ? validateNotes(changes.notes) : current.notes;

      const updated: RadarItem = {
        ...current,
        title,
        category,
        relevantDate,
        cost,
        currency,
        reminderLeadDays,
        status,
        notes,
        updatedAt: nowISO(),
      };

      const data: StoredRadarData = {
        schemaVersion: SCHEMA_VERSION,
        items: readRes.value.items.map((item, i) => i === idx ? updated : item),
      };
      const writeRes = writeStorage(data);
      if (!writeRes.ok) return writeRes;
      return ok(updated);
    } catch (e) {
      return err(e instanceof Error ? e.message : 'Validierung fehlgeschlagen');
    }
  },

  remove(id: string): Result<void> {
    const readRes = readStorage();
    if (!readRes.ok) return readRes;
    if (!readRes.value.items.some(i => i.id === id)) return err('Eintrag nicht gefunden');
    const data: StoredRadarData = {
      schemaVersion: SCHEMA_VERSION,
      items: readRes.value.items.filter(i => i.id !== id),
    };
    return writeStorage(data);
  },

  clear(): Result<void> {
    return writeStorage({ schemaVersion: SCHEMA_VERSION, items: [] });
  },
};

export function isStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}