import { Finding, InboxItem } from './types';

export const DEMO_FINDINGS: Finding[] = [
  {
    id: 'f1',
    title: 'Dein Internetvertrag wird im nächsten Monat 17,00 € teurer.',
    consequence: '204,00 € zusätzliche Kosten pro Jahr',
    source: 'Beispielrechnung PDF (Vodafone)',
    evidenceLevel: 'Observed',
    category: 'Money',
    actionLabel: 'Kündigungsoptionen prüfen',
    status: 'Open',
    amount: 204,
    isPriority: true,
  },
  {
    id: 'f2',
    title: 'Für Flug LH123 könnte noch ein Entschädigungsanspruch bestehen.',
    consequence: 'Potenzieller Anspruch verfällt in 14 Tagen',
    source: 'Beispiel-Buchungsbestätigung',
    evidenceLevel: 'Calculated',
    category: 'Money',
    actionLabel: 'Anspruchs-Checkliste öffnen',
    status: 'Open',
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    isPriority: true,
  },
  {
    id: 'f3',
    title: 'Dein Reisepass läuft vor der geplanten Japanreise ab.',
    consequence: 'Mögliche Probleme beim Boarding oder der Einreise',
    source: 'Beispiel-Passkopie & Reisebuchung',
    evidenceLevel: 'Calculated',
    category: 'Deadline',
    actionLabel: 'Schritte zur Verlängerung prüfen',
    status: 'Open',
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    isPriority: true,
  },
  {
    id: 'f4',
    title: 'Ungenutztes Abonnement erkannt: „FitnessApp Pro“',
    consequence: '12,99 € monatliche Abbuchung ohne Nutzung',
    source: 'Kontoauszugsanalyse (Simuliert)',
    evidenceLevel: 'Estimated',
    category: 'Money',
    actionLabel: 'Abonnement prüfen',
    status: 'Open',
    amount: 155.88,
  },
  {
    id: 'f5',
    title: 'Frist für die Steuererklärung rückt näher',
    consequence: 'Mögliche Verspätungszuschläge',
    source: 'Systemkalender (Simuliert)',
    evidenceLevel: 'Calculated',
    category: 'Deadline',
    actionLabel: 'Unterlagen vorbereiten',
    status: 'Open',
    date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'f6',
    title: 'Doppelte Abbuchung für „Cloud Storage“ erkannt',
    consequence: '9,99 € zu viel abgebucht in diesem Monat',
    source: 'Rechnungsabgleich (Simuliert)',
    evidenceLevel: 'Unknown',
    category: 'Money',
    actionLabel: 'Abbuchungen prüfen',
    status: 'Open',
    amount: 9.99,
  }
];

export const DEMO_INBOX_ITEMS: InboxItem[] = [
  {
    id: 'i1',
    sourceName: 'Vodafone_Invoice_Oct.pdf',
    dateAdded: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    parsingStatus: 'Parsed',
    detectedCategory: 'Money',
    status: 'Resolved',
    linkedFindingId: 'f1'
  },
  {
    id: 'i2',
    sourceName: 'Lufthansa_Booking_LH123.eml',
    dateAdded: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    parsingStatus: 'Parsed',
    detectedCategory: 'Money',
    status: 'Resolved',
    linkedFindingId: 'f2'
  },
  {
    id: 'i3',
    sourceName: 'Unknown_Receipt_Scan.jpg',
    dateAdded: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    parsingStatus: 'Pending',
    status: 'Needs Review'
  }
];
