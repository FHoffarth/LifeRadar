export type EvidenceLevel = 'Observed' | 'Calculated' | 'Estimated' | 'Unknown';
export type Category = 'Money' | 'Deadline' | 'Inbox';
export type Status = 'Open' | 'Reviewed' | 'Resolved' | 'Snoozed' | 'Needs Clarification';
export type Theme = 'system' | 'light' | 'dark';

export interface Finding {
  id: string;
  title: string;
  consequence: string;
  source: string;
  evidenceLevel: EvidenceLevel;
  category: Category;
  actionLabel: string;
  status: Status;
  date?: string; // ISO string for deadlines or dates
  amount?: number; // For money related items
  isPriority?: boolean; // To force it to 'Today' view
}

export interface InboxItem {
  id: string;
  sourceName: string;
  dateAdded: string;
  parsingStatus: 'Parsed' | 'Pending' | 'Failed';
  detectedCategory?: Category;
  status: 'Resolved' | 'Needs Review';
  linkedFindingId?: string;
}

export interface Reminder {
  id: string;
  findingId: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  note: string;
  advanceNotice: '0' | '1' | '3' | '7';
}
