import { useMemo, useRef } from 'react';

interface DateTimeLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: string;
  selectedDate: string;
  selectedTime: string;
  locations: string[];
  onLocationSelect: (location: string) => void;
  onDateSelect: (date: string) => void;
  onTimeSelect: (time: string) => void;
  message: string;
}

const getDateInputValue = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
};

function DateTimeLocationModal({
  isOpen,
  onClose,
  selectedLocation,
  selectedDate,
  selectedTime,
  locations,
  onLocationSelect,
  onDateSelect,
  onTimeSelect,
  message
}: DateTimeLocationModalProps) {
  const dateInputRef = useRef<HTMLInputElement>(null);
  const minDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    return getDateInputValue(tomorrow);
  }, []);

  const handleDateClick = () => {
    const input = dateInputRef.current;
    if (!input) return;

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.focus();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-content-large" onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)', boxShadow: '0 32px 80px rgba(15, 33, 71, 0.2)' }}>
        <div className="modal-header" style={{ borderBottom: '1px solid rgba(15, 33, 71, 0.08)', paddingBottom: '20px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', color: '#0f2147', margin: 0 }}>Select Date, Time & Location</h2>
          <button className="modal-close" onClick={onClose} style={{ fontSize: '2rem', color: '#5f7096', background: 'transparent', border: 'none', cursor: 'pointer', padding: '0 8px' }}>×</button>
        </div>

        <div className="modal-body">
          {message && <div className="feedback-message" style={{ marginBottom: '20px', padding: '14px 18px', borderRadius: '14px', background: '#e8f0fe', color: '#0a2760', border: '1px solid #c7d8ff', fontSize: '0.95rem' }}>{message}</div>}

          <div className="modal-form-grid" style={{ gap: '20px' }}>
            <div className="field-card" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(15, 33, 71, 0.08)' }}>
              <span className="small-label" style={{ marginBottom: '8px', display: 'block', color: '#5f7096', fontWeight: '600' }}>Location</span>
              <select
                value={selectedLocation}
                onChange={(e) => onLocationSelect(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(15, 33, 71, 0.12)', background: '#ffffff', color: '#10203d', fontSize: '1rem' }}
              >
                <option value="">Select a location</option>
                {locations.map((location) => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              <p className="body-text" style={{ marginTop: '10px', marginBottom: 0, color: '#5f7096', lineHeight: '1.5' }}>Pick the chapel or parish where the rite will happen.</p>
            </div>

            <div className="field-card" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(15, 33, 71, 0.08)' }}>
              <span className="small-label" style={{ marginBottom: '8px', display: 'block', color: '#5f7096', fontWeight: '600' }}>Date</span>
              <input
                ref={dateInputRef}
                type="date"
                value={selectedDate}
                min={minDate}
                onClick={handleDateClick}
                onFocus={handleDateClick}
                onChange={(e) => onDateSelect(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(15, 33, 71, 0.12)', background: '#ffffff', color: '#10203d', fontSize: '1rem' }}
              />
              <p className="body-text" style={{ marginTop: '10px', marginBottom: 0, color: '#5f7096', lineHeight: '1.5' }}>Click the field to open the calendar and choose a future date.</p>
            </div>

            <div className="field-card" style={{ background: 'linear-gradient(135deg, #f8fbff 0%, #f1f5fb 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(15, 33, 71, 0.08)' }}>
              <span className="small-label" style={{ marginBottom: '8px', display: 'block', color: '#5f7096', fontWeight: '600' }}>Time</span>
              <input
                type="time"
                value={selectedTime}
                step="1800"
                min="08:00"
                max="20:00"
                onChange={(e) => onTimeSelect(e.target.value)}
                style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(15, 33, 71, 0.12)', background: '#ffffff', color: '#10203d', fontSize: '1rem' }}
              />
              <p className="body-text" style={{ marginTop: '10px', marginBottom: 0, color: '#5f7096', lineHeight: '1.5' }}>Use the clock picker for a quick 30-minute selection.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer" style={{ borderTop: '1px solid rgba(15, 33, 71, 0.08)', paddingTop: '24px', marginTop: '24px' }}>
          <div className="modal-actions">
            <button className="button button-primary" onClick={onClose} style={{ padding: '12px 24px', fontSize: '0.95rem' }}>
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DateTimeLocationModal;
