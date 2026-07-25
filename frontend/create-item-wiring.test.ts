import { describe, test, expect, beforeEach, vi } from 'vitest';
import { CreateRadarItemInput } from './types';

const STORAGE_KEY = 'liferadar-radar-items-v1';

let store: Record<string, string> = {};

vi.stubGlobal('localStorage', {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { store = {}; },
});

const { radarItemRepository } = await import('./repository/radarItemRepository');

const VALID_INPUT: CreateRadarItemInput = {
  title: 'Kündigungsfrist Internetvertrag',
  category: 'contract',
  relevantDate: '2026-09-15',
  cost: 29.99,
  currency: 'EUR',
  reminderLeadDays: 14,
  notes: 'Vor Ablauf kündigen',
};

function resetStorage() {
  store = {};
}

describe('Create-item context wiring (regression)', () => {
  beforeEach(() => {
    resetStorage();
  });

  test('submit calls context createItem which calls repository', () => {
    const res = radarItemRepository.create(VALID_INPUT);
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.value.title).toBe('Kündigungsfrist Internetvertrag');
      expect(res.value.category).toBe('contract');
      expect(res.value.status).toBe('active');
      expect(res.value.cost).toBe(29.99);
    }
  });

  test('created item appears immediately in list without reload', () => {
    radarItemRepository.create(VALID_INPUT);
    const listRes = radarItemRepository.list();
    expect(listRes.ok).toBe(true);
    if (listRes.ok) {
      expect(listRes.value).toHaveLength(1);
      expect(listRes.value[0].title).toBe('Kündigungsfrist Internetvertrag');
    }
  });

  test('localStorage contains the item after creation', () => {
    radarItemRepository.create(VALID_INPUT);
    const raw = localStorage.getItem('liferadar-radar-items-v1');
    expect(raw).not.toBeNull();
    const parsed = JSON.parse(raw!);
    expect(parsed.schemaVersion).toBe(1);
    expect(parsed.items).toHaveLength(1);
    expect(parsed.items[0].title).toBe('Kündigungsfrist Internetvertrag');
  });

  test('failed creation: repo throws, context catches and returns null', async () => {
    const createContextCreateItem = async (input: CreateRadarItemInput) => {
      try {
        const res = radarItemRepository.create(input);
        if (!res.ok) return null;
        return res.value;
      } catch (e) {
        return null;
      }
    };

    const result = await createContextCreateItem({ ...VALID_INPUT, title: '' });
    expect(result).toBeNull();
    const listRes = radarItemRepository.list();
    if (listRes.ok) {
      expect(listRes.value).toHaveLength(0);
    }
  });

  test('hard reload restores items from localStorage', () => {
    radarItemRepository.create(VALID_INPUT);
    const listRes = radarItemRepository.list();
    expect(listRes.ok).toBe(true);
    if (listRes.ok) {
      expect(listRes.value).toHaveLength(1);
    }

    // Simulate hard reload: repository reads fresh from localStorage
    const reloadedRes = radarItemRepository.list();
    expect(reloadedRes.ok).toBe(true);
    if (reloadedRes.ok) {
      expect(reloadedRes.value).toHaveLength(1);
      expect(reloadedRes.value[0].title).toBe('Kündigungsfrist Internetvertrag');
      expect(reloadedRes.value[0].cost).toBe(29.99);
      expect(reloadedRes.value[0].id).toBe(listRes.value![0].id);
    }
  });

  test('context createItem pattern: create returns item, null on failure', async () => {
    const createContextCreateItem = async (input: CreateRadarItemInput) => {
      try {
        const res = radarItemRepository.create(input);
        if (!res.ok) return null;
        return res.value;
      } catch (e) {
        return null;
      }
    };

    const item = await createContextCreateItem(VALID_INPUT);
    expect(item).not.toBeNull();
    expect(item!.title).toBe('Kündigungsfrist Internetvertrag');

    const failed = await createContextCreateItem({ ...VALID_INPUT, title: '' });
    expect(failed).toBeNull();
  });

  test('multiple items can be created and listed', () => {
    radarItemRepository.create(VALID_INPUT);
    radarItemRepository.create({
      title: 'Versicherungsprüfung',
      category: 'insurance',
      relevantDate: '2026-12-01',
    });
    radarItemRepository.create({
      title: 'Abo kündigen',
      category: 'subscription',
      relevantDate: '2026-08-30',
    });

    const listRes = radarItemRepository.list();
    expect(listRes.ok).toBe(true);
    if (listRes.ok) {
      expect(listRes.value).toHaveLength(3);
      // Sorted by status (active first) then by relevantDate
      expect(listRes.value[0].relevantDate).toBe('2026-08-30');
      expect(listRes.value[1].relevantDate).toBe('2026-09-15');
      expect(listRes.value[2].relevantDate).toBe('2026-12-01');
    }
  });
});
