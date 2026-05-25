import { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import MainLayout from '../components/MainLayout';

import TopBar from '../components/TopBar';

import EventSelectionModal from '../components/EventSelectionModal';

import DateTimeLocationModal from '../components/DateTimeLocationModal';

import { loadBookingDraft, saveBookingDraft, type DocumentUploadMap } from '../utils/bookingStorage';

import { apiFetch } from '../utils/api';

const feastDates = [
  { month: 5, day: 24, name: 'St. John the Baptist' },
  { month: 11, day: 1, name: 'All Saints Day' },
  { month: 11, day: 2, name: 'All Souls Day' },
  { month: 11, day: 30, name: 'St. Andrew' },
  { month: 11, day: 25, name: 'Christmas' },
];

const isFeastDate = (month: number, day: number) => {
  return feastDates.some((feast) => feast.month === month && feast.day === day);
};

const getFeastName = (month: number, day: number) => {
  const feast = feastDates.find((item) => item.month === month && item.day === day);
  return feast ? feast.name : null;
};

const documentsMap: Record<string, { name: string; description: string }[]> = {
  Wedding: [
    { name: 'Baptismal Certificate', description: 'Required for sacrament validity' },
    { name: 'Confirmation Certificate', description: 'Required for sacrament validity' },
    { name: 'Birth Certificate (PSA)', description: 'Required for civil registration' },
    { name: 'Marriage License', description: 'Required for civil registration' },
    { name: 'CENOMAR', description: 'Certificate of No Marriage' },
    { name: 'Pre-Cana Seminar Certificate', description: 'Required by diocesan guidelines' },
    { name: 'Wedding Banns', description: 'Required announcement' },
    { name: 'Valid IDs', description: 'Government issued IDs' },
  ],
  Baptism: [
    { name: 'Child’s Birth Certificate', description: 'Required for registration' },
    { name: 'Parents’ Marriage Certificate', description: 'Required for validation' },
    { name: 'Baptismal Seminar Certificate', description: 'Required by diocesan guidelines' },
    { name: 'Valid IDs of Parents', description: 'Government issued IDs' },
    { name: 'Valid IDs of Godparents', description: 'Government issued IDs' },
  ],
  Funeral: [
    { name: 'Death Certificate', description: 'Required for registration' },
    { name: 'Burial Permit', description: 'Required for burial' },
    { name: 'Valid ID of Family Representative', description: 'Government issued ID' },
  ],
  'Mass Intention': [
    { name: 'Mass Intention Form', description: 'Required form' },
    { name: 'Valid ID (optional depending on parish)', description: 'Government issued ID' },
  ],
};

const UPLOADS_KEY = 'massbookUploadsByBookingDraft';

const formatTimeLabel = (value: string) => {
  if (!value) return 'Choose a time';

  const legacyMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (legacyMatch) {
    return value;
  }

  const timeMatch = value.match(/^(\d{2}):(\d{2})$/);
  if (!timeMatch) {
    return value;
  }

  const hour = Number(timeMatch[1]);
  const minute = timeMatch[2];
  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${period}`;
};

const formatDateLabel = (value: string) => {
  if (!value) return 'Choose a date';

  const parsedDate = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsedDate.getTime())) {
    return 'Choose a date';
  }

  return parsedDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

function EventBookingPage() {
  const draft = loadBookingDraft();

  const [selectedType, setSelectedType] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');
  const [selectedDateValue, setSelectedDateValue] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [message, setMessage] = useState('');
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [showDateTimeModal, setShowDateTimeModal] = useState(false);
  const [existingBookings, setExistingBookings] = useState<any[]>([]);

  const navigate = useNavigate();

  const bookingTypes = [
    {
      title: 'Wedding',
      subtitle: 'The celebration of Holy Matrimony between two baptized persons.',
      variants: [
        { name: 'Normal', price: 0, description: 'Standard wedding ceremony' },
        { name: 'Special', price: 6000, description: 'Special wedding ceremony with additional services' },
      ],
    },
    {
      title: 'Baptism',
      subtitle: 'Welcoming a new member into the Christian community and parish.',
      variants: [
        { name: 'Normal', price: 0, description: 'Standard baptism ceremony' },
        { name: 'Special', price: 1500, description: 'Special baptism ceremony with additional services' },
      ],
    },
    {
      title: 'Funeral',
      subtitle: 'A dignified Rite of Christian Burial for a departed loved one.',
      variants: [{ name: 'Standard', price: 1500, description: 'Standard funeral service' }],
    },
    {
      title: 'Mass Intention',
      subtitle: 'Requesting a specific intention for a scheduled daily or Sunday Mass.',
      variants: [{ name: 'Normal', price: 0, description: 'Standard mass intention' }],
    },
  ];

  const locations = [
    'St. John the Baptist Parish — Main Catholic parish in Poblacion.',
    'Sto. Nino Chapel (Kauswagan Church)',
    'Saint Francis De Assisi Chapel',
    'Lumbo Chapel',
    'Gaston Chapel',
    'Banglay Chapel',
    'Dampil Chapel',
    'Our Lady Of Fatima Shrine',
  ];

  useEffect(() => {
    apiFetch('/bookings')
      .then((data) => setExistingBookings(data || []))
      .catch(() => setExistingBookings([]));
  }, []);

  const normalizeEventType = (value: unknown): string => {
    if (!value) return '';
    return String(value).trim();
  };

  const rawEventType = normalizeEventType(draft.eventType);
  const normalizedKey = Object.keys(documentsMap).find((key) => key.toLowerCase() === rawEventType.toLowerCase());
  const eventType = normalizedKey || 'Wedding';
  const documents = documentsMap[eventType] || documentsMap['Wedding'];

  const handleSelectType = (title: string) => {
    setSelectedType(title);
    setSelectedVariant('');
    saveBookingDraft({ eventType: title, eventVariant: '' });
    setMessage(`${title} selected. Choose a variant below.`);
  };

  const handleSelectVariant = (variant: string) => {
    setSelectedVariant(variant);
    saveBookingDraft({ eventVariant: variant });
    setMessage(`${variant} ${selectedType} selected.`);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    saveBookingDraft({ location });
    setMessage(`Selected: ${location}`);
  };

  const getUploads = (): DocumentUploadMap => {
    try {
      const raw = localStorage.getItem(UPLOADS_KEY);
      if (!raw) return {};
      return JSON.parse(raw);
    } catch {
      return {};
    }
  };

  const setUploads = (next: DocumentUploadMap) => {
    localStorage.setItem(UPLOADS_KEY, JSON.stringify(next));
  };

  const handleUpload = (documentName: string) => {
    setMessage(`${documentName} uploaded successfully (demo).`);
    const uploads = getUploads();
    setUploads({ ...uploads, [documentName]: { uploadedAt: new Date().toISOString() } });
  };

  const handleContinue = () => {
    if (!selectedType) {
      setMessage('Select an event type before continuing.');
      return;
    }
    if (!selectedVariant) {
      setMessage('Select a variant before continuing.');
      return;
    }
    if (!selectedLocation) {
      setMessage('Please select a location before continuing.');
      return;
    }
    if (!selectedDateValue) {
      setMessage('Please choose a date before continuing.');
      return;
    }
    if (!selectedTime) {
      setMessage('Please choose a time before continuing.');
      return;
    }

    const [year, month, day] = selectedDateValue.split('-').map(Number);
    const selectedDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate <= today) {
      setMessage('Invalid date. You can only book events for future dates (tomorrow or later).');
      return;
    }

    const feastName = getFeastName(month - 1, day);
    const isFeast = isFeastDate(month - 1, day);

    saveBookingDraft({
      eventType: selectedType,
      eventVariant: selectedVariant,
      eventDate: selectedDateValue,
      eventTime: selectedTime,
      location: selectedLocation,
      isFeastDate: isFeast,
      feastName,
    });

    navigate('/event-booking/review');
  };

  const handleCancel = () => {
    setShowCancelDialog(true);
  };

  const confirmCancel = () => {
    localStorage.removeItem('massbookBookingDraft');
    navigate('/dashboard');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleCancel();
      }
      if (e.key === 'Enter' && selectedType && selectedVariant && selectedLocation && selectedDateValue && selectedTime) {
        e.preventDefault();
        handleContinue();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedType, selectedVariant, selectedLocation, selectedDateValue, selectedTime]);

  return (
    <MainLayout>
      <TopBar title="Event Booking" subtitle="Schedule a sacred rite and manage parish event requests." badge="Step 1: Booking Details" />

      <section className="event-booking-grid">
        <div className="booking-main">
          {message && <div className="feedback-message">{message}</div>}

          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button type="button" className="button button-primary small" onClick={handleContinue}>
              Continue to Review
            </button>
            <button type="button" className="button button-secondary small" onClick={handleCancel}>
              Cancel Booking
            </button>
          </div>

          <div className="panel" style={{ marginBottom: '28px', padding: '28px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 251, 255, 0.98) 100%)' }}>
            <div className="section-heading" style={{ marginBottom: '16px', color: '#0f2147', fontWeight: '700' }}>Event Selection</div>
            <div className="document-row" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(15, 33, 71, 0.08)' }}>
              <div>
                <strong style={{ fontSize: '1.15rem', color: '#0f2147', marginBottom: '4px', display: 'block' }}>
                  {selectedType ? `${selectedType} - ${selectedVariant ? selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1) : 'Select a variant'}` : 'Choose an event'}
                </strong>
                <span className="body-text" style={{ color: '#5f7096' }}>
                  {selectedType
                    ? bookingTypes.find((type) => type.title === selectedType)?.subtitle
                    : 'Pick the ceremony type and variant you want to book.'}
                </span>
              </div>
              <button className="button button-secondary" type="button" onClick={() => setShowEventModal(true)} style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                {selectedType ? 'Change Event' : 'Select Event'}
              </button>
            </div>
          </div>

          <div className="panel" style={{ marginBottom: '28px', padding: '28px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 251, 255, 0.98) 100%)' }}>
            <div className="section-heading" style={{ marginBottom: '16px', color: '#0f2147', fontWeight: '700' }}>Date, Time & Location</div>
            <div className="document-row" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(15, 33, 71, 0.08)' }}>
              <div>
                <strong style={{ fontSize: '1.15rem', color: '#0f2147', marginBottom: '4px', display: 'block' }}>{selectedLocation || 'Choose a location'}</strong>
                <span className="body-text" style={{ color: '#5f7096' }}>
                  {selectedDateValue ? formatDateLabel(selectedDateValue) : 'Choose a date'}
                  {selectedTime ? ` at ${formatTimeLabel(selectedTime)}` : ' and choose a time'}
                </span>
              </div>
              <button className="button button-secondary" type="button" onClick={() => setShowDateTimeModal(true)} style={{ padding: '10px 18px', fontSize: '0.9rem' }}>
                {selectedDateValue || selectedTime ? 'Change Selection' : 'Set Date & Time'}
              </button>
            </div>
          </div>

        </div>

        <aside className="booking-sidebar">
          {selectedType ? (
            <div className="panel document-panel">
              <div className="section-heading">Documents Required</div>
              <div className="document-row">
                <div>
                  <strong>Upload Status</strong>
                  <span className="body-text">{Object.keys(getUploads()).length} of {documents.length} documents uploaded</span>
                </div>
                <span className={`status-pill ${Object.keys(getUploads()).length >= documents.length ? 'success' : 'pending'}`}>{Object.keys(getUploads()).length >= documents.length ? 'Done' : 'In Progress'}</span>
              </div>
              {documents.map((doc, idx) => {
                const isUploaded = getUploads()[doc.name];
                return (
                  <div key={idx} className="document-row upload-row">
                    <div>
                      <strong>{doc.name}</strong>
                      <span className="body-text">{doc.description}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isUploaded ? (
                        <button type="button" className="button button-primary" disabled>
                          Uploaded
                        </button>
                      ) : (
                        <button type="button" className="button button-secondary" onClick={() => handleUpload(doc.name)}>
                          Upload
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="panel document-panel">
              <div className="section-heading">Documents Required</div>
              <div className="document-row">
                <div>
                  <strong>Select an event</strong>
                  <span className="body-text">Documents will appear after you choose the event type and variant.</span>
                </div>
              </div>
            </div>
          )}

          {showCancelDialog && (
            <div className="panel" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1000, padding: '32px', maxWidth: '420px', boxShadow: '0 24px 80px rgba(15, 33, 71, 0.25)', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)' }}>
              <h3 style={{ margin: '0 0 20px', fontSize: '1.4rem', color: '#0f2147' }}>Cancel Booking?</h3>
              <p className="body-text" style={{ marginBottom: '28px', color: '#5f7096', lineHeight: '1.7' }}>
                This will clear your booking draft and return you to the dashboard. This action cannot be undone.
              </p>
              <div style={{ display: 'flex', gap: '14px', justifyContent: 'flex-end' }}>
                <button className="button button-secondary small" type="button" onClick={() => setShowCancelDialog(false)} style={{ padding: '12px 20px', fontSize: '0.95rem' }}>
                  Keep Draft
                </button>
                <button className="button button-danger small" type="button" onClick={confirmCancel} style={{ padding: '12px 20px', fontSize: '0.95rem', background: 'linear-gradient(135deg, #c53030 0%, #a02626 100%)' }}>
                  Cancel Booking
                </button>
              </div>
            </div>
          )}

          <EventSelectionModal
            isOpen={showEventModal}
            onClose={() => setShowEventModal(false)}
            bookingTypes={bookingTypes}
            selectedType={selectedType}
            selectedVariant={selectedVariant}
            onSelectType={handleSelectType}
            onSelectVariant={handleSelectVariant}
          />

          <DateTimeLocationModal
            isOpen={showDateTimeModal}
            onClose={() => setShowDateTimeModal(false)}
            selectedLocation={selectedLocation}
            selectedDate={selectedDateValue}
            selectedTime={selectedTime}
            locations={locations}
            onLocationSelect={handleLocationSelect}
            onDateSelect={(date: string) => {
              const selectedDate = new Date(`${date}T00:00:00`);
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              selectedDate.setHours(0, 0, 0, 0);

              if (selectedDate <= today) {
                setMessage('Invalid date. You can only book events for future dates (tomorrow or later).');
                return;
              }

              setSelectedDateValue(date);
              saveBookingDraft({ eventDate: date });
              setMessage(`Selected ${formatDateLabel(date)}.`);
            }}
            onTimeSelect={(time: string) => {
              setSelectedTime(time);
              saveBookingDraft({ eventTime: time });
              setMessage(`Selected ${formatTimeLabel(time)} for your booking.`);
            }}
            message={message}
          />
        </aside>
      </section>
    </MainLayout>
  );
}

export default EventBookingPage;

