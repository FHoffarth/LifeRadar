import { EvidenceLevel, Status, Category, Finding } from './types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(amount);
};

export const formatDate = (isoString: string, format: 'short' | 'long' | 'datetime' = 'short'): string => {
  const date = new Date(isoString);
  if (format === 'datetime') {
    const datePart = new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
    const timePart = new Intl.DateTimeFormat('de-DE', { hour: '2-digit', minute: '2-digit' }).format(date);
    return `${datePart}, ${timePart} Uhr`;
  }
  if (format === 'long') {
    return new Intl.DateTimeFormat('de-DE', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
  }
  return new Intl.DateTimeFormat('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(date);
};

export const startOfLocalDay = (date: Date = new Date()): Date => {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
};

export const daysBetweenLocal = (start: Date, end: Date): number => {
  const startDay = startOfLocalDay(start).getTime();
  const endDay = startOfLocalDay(end).getTime();
  // Use Math.round to safely handle Daylight Saving Time transitions
  return Math.round((endDay - startDay) / (1000 * 60 * 60 * 24));
};

export const getRelativeDateLabel = (dateString?: string): string | null => {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  const diff = daysBetweenLocal(new Date(), d);
  if (diff < 0) return 'Überfällig';
  if (diff === 0) return 'Heute';
  if (diff === 1) return 'Morgen';
  return `In ${diff} Tagen`;
};

export const translateEvidence = (level: EvidenceLevel): string => {
  const map: Record<EvidenceLevel, string> = {
    Observed: 'Beobachtet',
    Calculated: 'Berechnet',
    Estimated: 'Geschätzt',
    Unknown: 'Unbekannt',
  };
  return map[level];
};

export const translateStatus = (status: Status): string => {
  const map: Record<Status, string> = {
    Open: 'Offen',
    Reviewed: 'Geprüft',
    Resolved: 'Erledigt',
    Snoozed: 'Zurückgestellt',
    'Needs Clarification': 'Klärung erforderlich',
  };
  return map[status];
};

export const translateCategory = (category: Category): string => {
  const map: Record<Category, string> = {
    Money: 'Geld & Ansprüche',
    Deadline: 'Wichtige Fristen',
    Inbox: 'Deine Quellen',
  };
  return map[category];
};

export const downloadFile = (content: string, filename: string, mimeType: string) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const generateCSV = (findings: Finding[]): string => {
  const header = ['Titel', 'Kategorie', 'Status', 'Grundlage', 'Quelle', 'Betrag', 'Frist', 'Konsequenz'].join(';');
  const rows = findings.map(f => {
    return [
      `"${f.title.replace(/"/g, '""')}"`,
      `"${translateCategory(f.category)}"`,
      `"${translateStatus(f.status)}"`,
      `"${translateEvidence(f.evidenceLevel)}"`,
      `"${f.source.replace(/"/g, '""')}"`,
      `"${f.amount ? formatCurrency(f.amount) : ''}"`,
      `"${f.date ? formatDate(f.date, 'short') : ''}"`,
      `"${f.consequence.replace(/"/g, '""')}"`
    ].join(';');
  });
  // Add BOM for Excel UTF-8 recognition
  return '﻿' + [header, ...rows].join('\n');
};

export const escapeICS = (str: string) => {
  return str.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
};

export const generateICS = (finding: Finding, event: { title: string, date: string, time: string, duration: number, description: string }): string => {
  const now = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  
  let startStr = '';
  let endStr = '';
  
  if (event.time) {
    const startDate = new Date(`${event.date}T${event.time}:00`);
    startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const endDate = new Date(startDate.getTime() + event.duration * 60000);
    endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  } else {
    startStr = event.date.replace(/-/g, '');
    const endDate = new Date(event.date);
    endDate.setDate(endDate.getDate() + 1);
    endStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
  }

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LifeRadar//Demo//DE',
    'BEGIN:VEVENT',
    `UID:${finding.id}-${Date.now()}@liferadar.demo`,
    `DTSTAMP:${now}`,
    event.time ? `DTSTART:${startStr}` : `DTSTART;VALUE=DATE:${startStr}`,
    event.time ? `DTEND:${endStr}` : `DTEND;VALUE=DATE:${endStr}`,
    `SUMMARY:${escapeICS(event.title)}`,
    `DESCRIPTION:${escapeICS(event.description)}`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

export const generateGoogleCalendarUrl = (event: { title: string, date: string, time: string, duration: number, description: string }): string => {
  let startStr = '';
  let endStr = '';
  
  if (event.time) {
    const startDate = new Date(`${event.date}T${event.time}:00`);
    startStr = startDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    
    const endDate = new Date(startDate.getTime() + event.duration * 60000);
    endStr = endDate.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  } else {
    startStr = event.date.replace(/-/g, '');
    const endDate = new Date(event.date);
    endDate.setDate(endDate.getDate() + 1);
    endStr = endDate.toISOString().split('T')[0].replace(/-/g, '');
  }

  const url = new URL('https://calendar.google.com/calendar/render');
  url.searchParams.append('action', 'TEMPLATE');
  url.searchParams.append('text', event.title);
  url.searchParams.append('dates', `${startStr}/${endStr}`);
  url.searchParams.append('details', event.description);
  
  return url.toString();
};

export const printFinding = (finding: Finding) => {
  const win = window.open('', '_blank');
  if (!win) return;
  win.document.write(`
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <title>LifeRadar Demo-Export</title>
      <style>
        body { font-family: system-ui, -apple-system, sans-serif; padding: 2rem; max-width: 800px; margin: 0 auto; color: #0f172a; line-height: 1.5; }
        h1 { font-size: 1.5rem; color: #4f46e5; border-bottom: 2px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 2rem; }
        h2 { font-size: 1.25rem; margin-bottom: 1.5rem; }
        .row { margin-bottom: 1rem; display: flex; }
        .label { font-weight: 600; width: 200px; flex-shrink: 0; color: #475569; }
        .value { flex-grow: 1; }
        .footer { margin-top: 3rem; padding-top: 1rem; border-top: 1px solid #e2e8f0; font-size: 0.875rem; color: #64748b; text-align: center; }
      </style>
    </head>
    <body>
      <h1>LifeRadar Demo-Export</h1>
      <h2>${finding.title}</h2>
      
      <div class="row"><div class="label">Kategorie:</div><div class="value">${translateCategory(finding.category)}</div></div>
      <div class="row"><div class="label">Status:</div><div class="value">${translateStatus(finding.status)}</div></div>
      <div class="row"><div class="label">Grundlage:</div><div class="value">${translateEvidence(finding.evidenceLevel)}</div></div>
      <div class="row"><div class="label">Quelle:</div><div class="value">${finding.source}</div></div>
      <div class="row"><div class="label">Konsequenz:</div><div class="value">${finding.consequence}</div></div>
      ${finding.amount ? `<div class="row"><div class="label">Betrag:</div><div class="value">${formatCurrency(finding.amount)}</div></div>` : ''}
      ${finding.date ? `<div class="row"><div class="label">Frist:</div><div class="value">${formatDate(finding.date, 'long')}</div></div>` : ''}
      <div class="row"><div class="label">Nächster Schritt:</div><div class="value">${finding.actionLabel}</div></div>
      
      <div class="footer">Dieser Export wurde aus dem LifeRadar Prototyp generiert. Es besteht kein Anspruch auf rechtliche Gültigkeit.</div>
      <script>
        window.onload = () => { window.print(); window.close(); }
      </script>
    </body>
    </html>
  `);
  win.document.close();
};
