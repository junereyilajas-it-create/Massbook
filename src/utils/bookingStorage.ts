export type BookingDraft = {
  eventType: string;
  eventDate: string;
  eventTime: string;
  location: string;
  notes: string;
};

const STORAGE_KEY = 'massbookBookingDraft';

export const defaultBookingDraft: BookingDraft = {
  eventType: 'Wedding',
  eventDate: '2024-10-15',
  eventTime: '2:00 PM',
  location: 'St. Jude Thaddeus Cathedral',
  notes: 'Booking request submitted through the MassBook portal.',
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
