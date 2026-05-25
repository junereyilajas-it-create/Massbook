export type BookingDraft = {
  eventType: string;
  eventVariant: string;
  eventDate: string;
  eventTime: string;
  location: string;
  notes: string;
  paymentMethod: string;
  requirementsSubmissionMethod: string;
  isFeastDate?: boolean;
  feastName?: string | null;
};

export type DocumentUploadMap = Record<string, { uploadedAt: string }>;


const STORAGE_KEY = 'massbookBookingDraft';

export const defaultBookingDraft: BookingDraft = {
  eventType: 'Wedding',
  eventVariant: 'normal',
  eventDate: new Date().toISOString().split('T')[0],
  eventTime: '2:00 PM',
  location: 'St. Jude Thaddeus Cathedral',
  notes: 'Booking request submitted through the MassBook portal.',
  paymentMethod: '',
  requirementsSubmissionMethod: '',
};

export function loadBookingDraft(): BookingDraft {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultBookingDraft;
    return { ...defaultBookingDraft, ...JSON.parse(raw) };
  } catch {
    return defaultBookingDraft;
  }
}

export function saveBookingDraft(draft: Partial<BookingDraft>) {
  const existing = loadBookingDraft();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...existing, ...draft }));
}

export function clearBookingDraft() {
  localStorage.removeItem(STORAGE_KEY);
}
