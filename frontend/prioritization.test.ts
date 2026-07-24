import { describe, test, expect } from 'vitest';
import { startOfLocalDay, daysBetweenLocal } from './utils';
import { Finding } from './types';

describe('Prioritization Logic', () => {
  test('deadline due today is eligible for urgent prioritization', () => {
    const today = startOfLocalDay();
    const finding: Finding = {
      id: 'f-today',
      title: 'Due Today',
      consequence: 'Test Consequence',
      source: 'Test Source',
      evidenceLevel: 'Calculated',
      category: 'Deadline',
      actionLabel: 'Action',
      status: 'Open',
      date: today.toISOString()
    };

    const d = new Date(finding.date!);
    const diff = daysBetweenLocal(today, d);
    
    const isUrgent = diff >= 0 && diff <= 14;
    expect(isUrgent).toBe(true);
  });
});
