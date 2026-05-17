import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { loadBookingDraft, saveBookingDraft } from '../utils/bookingStorage';

function EventBookingStep1Page() {
  const existingDraft = loadBookingDraft();
  const [selectedType, setSelectedType] = useState(existingDraft.eventType || 'Wedding');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const bookingTypes = [
    { title: 'Wedding', subtitle: 'The celebration of Holy Matrimony between two baptized persons.' },
    { title: 'Baptism', subtitle: 'Welcoming a new member into the Christian community and parish.' },
    { title: 'Funeral', subtitle: 'A dignified Rite of Christian Burial for a departed loved one.' },
    { title: 'Mass Intention', subtitle: 'Requesting a specific intention for a scheduled daily or Sunday Mass.' },
  ];

  const handleSelectType = (title: string) => {
    setSelectedType(title);
    saveBookingDraft({ eventType: title });
    setMessage(`${title} selected. Continue to Step 2 when ready.`);
  };

  const handleUpload = () => setMessage('Upload dialog opened.');
  const handleContinue = () => {
    if (!selectedType) {
      setMessage('Select an event type before continuing.');
      return;
    }
    saveBookingDraft({ eventType: selectedType });
    navigate('/event-booking/step2');
  };

  return (
    <MainLayout>
      <TopBar title="Event Booking" subtitle="Schedule a sacred rite and manage parish event requests." badge="Step 1: Event Type" />

      <section className="event-booking-grid">
        <div className="booking-main">
          {message && <div className="feedback-message">{message}</div>}
          <div className="step-tracker">
            <span className="step active">1</span>
            <span className="step-line" />
            <span className="step">2</span>
            <span className="step-line" />
            <span className="step">3</span>
            <span className="step-line" />
            <span className="step">4</span>
          </div>

          <div className="event-type-grid">
            {bookingTypes.map((type) => (
              <button
                key={type.title}
                type="button"
                className={`event-type-card ${selectedType === type.title ? 'selected-card' : ''}`}
                onClick={() => handleSelectType(type.title)}
              >
                <strong>{type.title}</strong>
                <p className="body-text">{type.subtitle}</p>
              </button>
            ))}
          </div>

          <div className="booking-footer-cards">
            <div className="panel mini-panel">
              <strong>Step 2: Calendar</strong>
              <p className="body-text">Select your preferred date from our liturgical calendar availability.</p>
            </div>
            <div className="panel mini-panel">
              <strong>Step 3: Documents</strong>
              <p className="body-text">Upload your official sacramental records for verification.</p>
            </div>
            <div className="panel mini-panel">
              <strong>Step 4: Review</strong>
              <p className="body-text">Final review and submission of your booking request.</p>
            </div>
          </div>
        </div>

        <aside className="booking-sidebar">
          <div className="panel booking-summary-panel">
            <div className="summary-label">Booking Summary</div>
            <div className="document-row">
              <div>
                <strong>{selectedType} Mass</strong>
                <span className="body-text">{selectedType === 'Mass Intention' ? 'Requested Mass Intention' : `Sacrament of ${selectedType}`}</span>
              </div>
              <button className="ghost-button small" type="button" onClick={() => setMessage('Booking summary edit started.')}>Edit</button>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <strong>90 Minutes</strong>
            </div>
            <div className="summary-row">
              <span>Fee</span>
              <strong>$250.00</strong>
            </div>
          </div>

          <div className="panel document-panel">
            <div className="section-heading">Required Documentation</div>
            <div className="document-row">
              <div>
                <strong>Baptismal Certificate (Child)</strong>
                <span className="body-text">Uploaded on Oct 12, 2023</span>
              </div>
              <span className="status-pill success">Verified</span>
            </div>
            <div className="document-row">
              <div>
                <strong>Confirmation Record</strong>
                <span className="body-text">Uploaded on Oct 14, 2023</span>
              </div>
              <span className="status-pill success">Verified</span>
            </div>
            <div className="document-row upload-row">
              <div>
                <strong>Marriage License</strong>
                <span className="body-text">Upload the final certificate before submission.</span>
              </div>
              <button className="button button-secondary" type="button" onClick={handleUpload}>Upload</button>
            </div>
          </div>

          <button className="button button-primary full-width" type="button" onClick={handleContinue}>Continue to Step 2</button>
          <Link to="/dashboard" className="button button-secondary full-width">Back to Dashboard</Link>
        </aside>
      </section>
    </MainLayout>
  );
}

export default EventBookingStep1Page;