import { describe, test, expect } from 'vitest';
import { startOfLocalDay, daysBetweenLocal } from './utils';

describe('Date Boundary Logic', () => {
  test('deadline due today in the morning is 0 days away', () => {
    const today = new Date();
    const morning = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 8, 0, 0);
    expect(daysBetweenLocal(today, morning)).toBe(0);
  });

  test('deadline due today late in the evening is 0 days away', () => {
    const today = new Date();
    const evening = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
    expect(daysBetweenLocal(today, evening)).toBe(0);
  });

  test('deadline tomorrow is 1 day away', () => {
    const today = new Date();
    const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 12, 0, 0);
    expect(daysBetweenLocal(today, tomorrow)).toBe(1);
  });

  test('deadline exactly 14 days away is 14', () => {
    const today = new Date();
    const future = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14, 12, 0, 0);
    expect(daysBetweenLocal(today, future)).toBe(14);
  });

  test('deadline 15 days away is 15', () => {
    const today = new Date();
    const future = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 15, 12, 0, 0);
    expect(daysBetweenLocal(today, future)).toBe(15);
  });

  test('expired deadline (yesterday) is -1', () => {
    const today = new Date();
    const yesterday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1, 12, 0, 0);
    expect(daysBetweenLocal(today, yesterday)).toBe(-1);
  });

  test('invalid date returns NaN or is handled safely', () => {
    const today = new Date();
    const invalidDate = new Date('invalid-date-string');
    expect(Number.isNaN(daysBetweenLocal(today, invalidDate))).toBe(true);
  });
});
