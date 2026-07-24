import { describe, test, expect } from 'vitest';
import { escapeICS, generateICS, generateGoogleCalendarUrl } from './utils';
import { Finding } from './types';

describe('Calendar Export Foundation', () => {
  const mockFinding: Finding = {
    id: 'f123',
    title: 'Test Finding',
    consequence: 'Test Consequence',
    source: 'Test Source',
    evidenceLevel: 'Observed',
    category: 'Deadline',
    actionLabel: 'Test Action',
    status: 'Open'
  };

  const mockEvent = {
    title: 'Test Event, with comma; and semicolon\\ and \n newline',
    date: '2026-07-24',
    time: '14:30',
    duration: 60,
    description: 'Test Description\nLine 2'
  };

  test('escapeICS escapes special characters correctly', () => {
    const escaped = escapeICS(mockEvent.title);
    expect(escaped).toBe('Test Event\\, with comma\\; and semicolon\\\\ and \\n newline');
  });

  test('generateICS creates valid structure and handles timezones', () => {
    const ics = generateICS(mockFinding, mockEvent);
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('VERSION:2.0');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('UID:f123-');
    expect(ics).toMatch(/DTSTART:\d{8}T\d{6}Z/);
    expect(ics).toMatch(/DTEND:\d{8}T\d{6}Z/);
    expect(ics).toContain('SUMMARY:Test Event\\, with comma\\; and semicolon\\\\ and \\n newline');
    expect(ics).toContain('END:VEVENT');
    expect(ics).toContain('END:VCALENDAR');
  });

  test('generateGoogleCalendarUrl creates correct URL', () => {
    const url = generateGoogleCalendarUrl(mockEvent);
    expect(url).toContain('https://calendar.google.com/calendar/render?action=TEMPLATE');
    expect(url).toContain('text=Test+Event');
    expect(url).toContain('dates=');
    expect(url).toContain('details=Test+Description');
  });
});
