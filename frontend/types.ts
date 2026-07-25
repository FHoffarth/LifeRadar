export type EvidenceLevel = 'Observed' | 'Calculated' | 'Estimated' | 'Unknown';
export type Category = 'Money' | 'Deadline' | 'Inbox';
export type Status = 'Open' | 'Reviewed' | 'Resolved' | 'Snoozed' | 'Needs Clarification';
export type Theme = 'system' | 'light' | 'dark';

export type RadarItemCategory =
  | 'contract'
  | 'insurance'
  | 'subscription'
  | 'tax'
  | 'warranty'
  | 'application'
  | 'other';

export type RadarItemCertainty = 'self-entered' | 'calculated' | 'estimated' | 'unknown';

export type RadarItemStatus = 'active' | 'completed';

export interface RadarItem {
  id: string;
  title: string;
  category: RadarItemCategory;
  relevantDate: string;
  cost?: number;
  currency?: string;
  reminderLeadDays?: number;
  status: RadarItemStatus;
  certainty: RadarItemCertainty;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRadarItemInput {
  title: string;
  category: RadarItemCategory;
  relevantDate: string;
  cost?: number;
  currency?: string;
  reminderLeadDays?: number;
  notes?: string;
}

export interface UpdateRadarItemInput {
  title?: string;
  category?: RadarItemCategory;
  relevantDate?: string;
  cost?: number | undefined;
  currency?: string;
  reminderLeadDays?: number | undefined;
  status?: RadarItemStatus;
  notes?: string | null;
}

export interface Finding {
  id: string;
  title: string;
  consequence: string;
  source: string;
  evidenceLevel: EvidenceLevel;
  category: Category;
  actionLabel: string;
  status: Status;
  date?: string;
  amount?: number;
  isPriority?: boolean;
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
  date: string;
  time: string;
  note: string;
  advanceNotice: '0' | '1' | '3' | '7';
}