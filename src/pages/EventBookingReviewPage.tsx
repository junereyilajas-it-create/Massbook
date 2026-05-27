import { useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';

import MainLayout from '../components/MainLayout';

import TopBar from '../components/TopBar';

import { apiFetch } from '../utils/api';

import { clearBookingDraft, loadBookingDraft } from '../utils/bookingStorage';



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

    { name: 'Child\u2019s Birth Certificate', description: 'Required for registration' },

    { name: 'Parents\u2019 Marriage Certificate', description: 'Required for validation' },

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



function EventBookingReviewPage() {

  const bookingDraft = loadBookingDraft();

  const [isProcessing, setIsProcessing] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string>('');

  const [statusMessage, setStatusMessage] = useState<string>('');

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [showWhatHappensNextModal, setShowWhatHappensNextModal] = useState(false);

  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [showGcashQrModal, setShowGcashQrModal] = useState(false);

  const [paymentMethod, setPaymentMethod] = useState<'gcash' | 'physical' | ''>('');

  const navigate = useNavigate();



  const normalizeEventType = (value: unknown): string => {

    if (!value) return '';

    return String(value).trim();

  };



  const rawEventType = normalizeEventType(bookingDraft.eventType);

  const normalizedKey = Object.keys(documentsMap).find(

    (key) => key.toLowerCase() === rawEventType.toLowerCase()

  );



  const eventType = normalizedKey || 'Wedding';

  const documents = documentsMap[eventType] || documentsMap['Wedding'];



  const getPrice = () => {

    const variant = bookingDraft.eventVariant?.toLowerCase();

    // If it's a feast date, wedding and baptism are free
    if (bookingDraft.isFeastDate && (eventType === 'Wedding' || eventType === 'Baptism')) {
      return 0;
    }

    if (eventType === 'Wedding') {

      return variant === 'special' ? 6000 : 0;

    } else if (eventType === 'Baptism') {

      return variant === 'special' ? 1500 : 0;

    } else if (eventType === 'Funeral') {

      return 1500;

    }

    return 0;

  };



  const price = getPrice();



  const parseLegacyTime = (value: string) => {

    const legacyMatch = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);

    if (legacyMatch) {
      let hour = Number(legacyMatch[1]);
      const minute = legacyMatch[2];
      const period = legacyMatch[3].toUpperCase();

      if (hour === 12) {
        hour = period === 'AM' ? 0 : 12;
      } else if (period === 'PM') {
        hour += 12;
      }

      return `${String(hour).padStart(2, '0')}:${minute}:00`;
    }

    const twentyFourHourMatch = value.match(/^(\d{2}):(\d{2})$/);
    if (twentyFourHourMatch) {
      return `${value}:00`;
    }

    return value;
  };





  const buildBookingPayload = () => {
    const authUser = localStorage.getItem('authUser') ? JSON.parse(localStorage.getItem('authUser') || '{}') : null;
    const eventTypeMap: Record<string, number> = {
      Wedding: 1,
      Baptism: 2,
      Funeral: 3,
      'Mass Intention': 4,
    };

    const selectedVariant = bookingDraft.eventVariant?.trim() || 'Normal';
    const variantLabel = selectedVariant.charAt(0).toUpperCase() + selectedVariant.slice(1);
    const selectedLocation = bookingDraft.location?.trim() || 'Not specified';
    const selectedDate = bookingDraft.eventDate && bookingDraft.eventDate !== 'to-be-announced'
      ? bookingDraft.eventDate
      : new Date().toISOString().split('T')[0];

    return {
      event_type_id: eventTypeMap[bookingDraft.eventType] || 1,
      type: bookingDraft.eventType || 'Wedding',
      title: `${bookingDraft.eventType || 'Wedding'}${bookingDraft.eventVariant ? ` - ${variantLabel}` : ''}`,
      description: `Variant: ${variantLabel}; Location: ${selectedLocation}; Time: ${bookingDraft.eventTime || '2:00 PM'}`,
      requester_name: authUser?.name || 'Guest Parishioner',
      email: authUser?.email || 'guest@massbook.church',
      contact_number: authUser?.phone || '(555) 123-4567',
      event_date: selectedDate,
      start_time: parseLegacyTime(bookingDraft.eventTime || '2:00 PM'),
      end_time: parseLegacyTime(bookingDraft.eventTime || '2:00 PM'),
      location: selectedLocation,
      submitted_date: new Date().toISOString().split('T')[0],
      notes: [
        bookingDraft.notes || '',
        `Variant: ${variantLabel}`,
        `Location: ${selectedLocation}`,
        bookingDraft.isFeastDate && bookingDraft.feastName ? `Feast date: ${bookingDraft.feastName}` : '',
      ].filter(Boolean).join('; '),
    };
  };

  const handleSubmitBooking = () => {
    if (isProcessing) {
      return;
    }

    if (!paymentMethod) {
      setShowPaymentModal(true);
    } else {
      setShowWhatHappensNextModal(true);
    }
  };

  const handlePaymentMethodSelect = (method: 'gcash' | 'physical') => {
    setPaymentMethod(method);
    setShowPaymentModal(false);

    if (method === 'gcash') {
      setShowGcashQrModal(true);
    }
  };

  const handleGcashConfirm = () => {
    setShowGcashQrModal(false);
  };

  const handleConfirmSubmitBooking = async () => {
    setShowWhatHappensNextModal(false);
    setIsProcessing(true);

    setErrorMessage('');

    setStatusMessage('Processing booking...');



    try {

      const payload = buildBookingPayload();

      await apiFetch('/bookings', {

        method: 'POST',

        body: JSON.stringify(payload),

      });



      clearBookingDraft();

      setStatusMessage('');

      setErrorMessage('');

      setShowSuccessModal(true);

    } catch (bookingError) {

      setErrorMessage((bookingError as Error).message || 'Booking could not be completed.');

      setStatusMessage('');

    } finally {

      setIsProcessing(false);

    }

  };



  return (

    <MainLayout>

      <TopBar title="Event Booking" subtitle="Schedule a sacred rite and manage parish event requests." badge="Step 4: Review & Submit" />



      <section className="event-booking-grid">

        <div className="booking-main">

          {statusMessage && <div className="feedback-message success">{statusMessage}</div>}

          {errorMessage && <div className="feedback-message error">{errorMessage}</div>}

          {isProcessing && <div className="feedback-message">Please wait while we submit your booking...</div>}

          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <button
              className="button button-primary small"
              type="button"
              onClick={handleSubmitBooking}
              disabled={isProcessing || !paymentMethod}
              style={{ background: 'linear-gradient(135deg, #0f2147 0%, #162c5c 100%)', boxShadow: '0 8px 20px rgba(15, 33, 71, 0.15)' }}
            >
              {isProcessing ? 'Processing...' : paymentMethod ? 'Submit Booking' : 'Select Payment Method'}
            </button>
            <Link to="/event-booking" className="button button-secondary small" style={{ textAlign: 'center' }}>Back</Link>
          </div>

          <div className="verification-section">

            <div className="section-heading">Final Review</div>

            <div className="review-card">

              <div className="review-row">

                <span>Event Type</span>

                <strong>{eventType} Mass</strong>

              </div>

              <div className="review-row">

                <span>Date & Time</span>

                <strong>
                  {bookingDraft.isFeastDate ? 'To be announced' : (bookingDraft.eventDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }))} at {bookingDraft.eventTime || '2:00 PM'}
                  {bookingDraft.isFeastDate && bookingDraft.feastName && ` (${bookingDraft.feastName})`}
                </strong>

              </div>

              <div className="review-row">

                <span>Location</span>

                <strong>{bookingDraft.location || 'Select a location'}</strong>

              </div>

              <div className="review-row">

                <span>Duration</span>

                <strong>90 Minutes</strong>

              </div>

              <div className="review-row">

                <span>Variant</span>

                <strong>{bookingDraft.eventVariant || 'Normal'}</strong>

              </div>

              <div className="review-row">

                <span>Status</span>

                <span className="status-pill pending">Ready for Submission</span>

              </div>

            </div>

          </div>



        </div>



        <aside className="booking-sidebar">



          <div className="panel payment-panel">

            <div className="section-heading">Payment Information</div>

            <div className="payment-method">

              <div className="payment-row">

                <span>Event Type</span>

                <strong>{eventType}</strong>

              </div>

              <div className="payment-row">

                <span>Variant</span>

                <strong>{bookingDraft.eventVariant || 'Normal'}</strong>

              </div>

              <div className="payment-row total">

                <span>Total Fee</span>

                <strong>{price === 0 ? 'Free' : `₱${price.toLocaleString()}`}</strong>

              </div>

            </div>

            {!paymentMethod && (
              <button
                className="button button-primary"
                type="button"
                onClick={() => setShowPaymentModal(true)}
                style={{ width: '100%', marginTop: '16px', padding: '12px 20px', fontSize: '1rem' }}
              >
                Select Payment Method
              </button>
            )}

            {paymentMethod && (
              <div style={{ marginTop: '16px', padding: '12px', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', borderRadius: '8px', border: '1px solid #0ea5e9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.2rem' }}>{paymentMethod === 'gcash' ? '💳' : '🏛️'}</span>
                  <strong style={{ color: '#0f2147' }}>
                    {paymentMethod === 'gcash' ? 'GCash Payment' : 'Physical Payment at Church'}
                  </strong>
                </div>
                <button
                  className="button button-secondary small"
                  type="button"
                  onClick={() => {
                    setPaymentMethod('');
                    setShowPaymentModal(true);
                  }}
                  style={{ marginTop: '8px', width: '100%', padding: '8px 16px', fontSize: '0.9rem' }}
                >
                  Change Payment Method
                </button>
              </div>
            )}

          </div>



        </aside>

      </section>

      {showPaymentModal && (
        <div className="modal-overlay" onClick={() => setShowPaymentModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)',
              boxShadow: '0 32px 80px rgba(15, 33, 71, 0.28)',
              padding: '44px 40px',
              borderRadius: '28px',
              maxWidth: '560px',
              textAlign: 'center',
              border: '1px solid rgba(15, 33, 71, 0.08)',
            }}
          >
            <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>💳</div>
            <h2
              style={{
                fontSize: '1.8rem',
                color: '#0f2147',
                margin: '0 0 16px',
                fontWeight: 700,
              }}
            >
              Select Payment Method
            </h2>
            <p
              className="body-text"
              style={{
                marginBottom: '32px',
                color: '#5f7096',
                lineHeight: '1.7',
                fontSize: '1.05rem',
              }}
            >
              How would you like to pay for your booking?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px', margin: '0 auto' }}>
              <button
                type="button"
                className="button button-primary"
                onClick={() => handlePaymentMethodSelect('gcash')}
                style={{
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  boxShadow: '0 8px 20px rgba(0, 123, 255, 0.15)',
                  padding: '16px 24px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>💳</span>
                Pay via GCash
              </button>
              <button
                type="button"
                className="button button-secondary"
                onClick={() => handlePaymentMethodSelect('physical')}
                style={{
                  padding: '16px 24px',
                  fontSize: '1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>🏛️</span>
                Pay Physically at Church
              </button>
            </div>
            <button
              type="button"
              className="button button-secondary small"
              onClick={() => setShowPaymentModal(false)}
              style={{ marginTop: '24px', padding: '10px 20px', fontSize: '0.95rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showGcashQrModal && (
        <div className="modal-overlay" onClick={() => setShowGcashQrModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)',
              boxShadow: '0 32px 80px rgba(15, 33, 71, 0.28)',
              padding: '44px 40px',
              borderRadius: '28px',
              maxWidth: '500px',
              textAlign: 'center',
              border: '1px solid rgba(15, 33, 71, 0.08)',
            }}
          >
            <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>💳</div>
            <h2
              style={{
                fontSize: '1.8rem',
                color: '#0f2147',
                margin: '0 0 16px',
                fontWeight: 700,
              }}
            >
              Scan to Pay via GCash
            </h2>
            <p
              className="body-text"
              style={{
                marginBottom: '24px',
                color: '#5f7096',
                lineHeight: '1.7',
                fontSize: '1.05rem',
              }}
            >
              Scan the QR code below with your GCash app to complete your payment of {price === 0 ? 'Free' : `₱${price.toLocaleString()}`}
            </p>
            <div
              style={{
                background: '#ffffff',
                padding: '24px',
                borderRadius: '16px',
                marginBottom: '24px',
                border: '2px dashed #0ea5e9',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '200px',
                  height: '200px',
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '12px',
                  border: '1px solid #0ea5e9',
                }}
              >
                <div style={{ fontSize: '4rem' }}>📱</div>
                <div style={{ fontSize: '0.9rem', color: '#5f7096', textAlign: 'center' }}>
                  GCash QR Code
                </div>
                <div style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center' }}>
                  (Demo QR Code)
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                type="button"
                className="button button-primary"
                onClick={handleGcashConfirm}
                style={{
                  background: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)',
                  boxShadow: '0 8px 20px rgba(0, 123, 255, 0.15)',
                  padding: '14px 24px',
                  fontSize: '1rem',
                }}
              >
                Confirm Payment & Return to Booking
              </button>
              <button
                type="button"
                className="button button-secondary small"
                onClick={() => setShowGcashQrModal(false)}
                style={{ padding: '10px 20px', fontSize: '0.95rem' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {showWhatHappensNextModal && (
        <div className="modal-overlay" onClick={() => setShowWhatHappensNextModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)',
              boxShadow: '0 32px 80px rgba(15, 33, 71, 0.28)',
              padding: '44px 40px',
              borderRadius: '28px',
              maxWidth: '560px',
              textAlign: 'center',
              border: '1px solid rgba(15, 33, 71, 0.08)',
            }}
          >
            <div style={{ fontSize: '2.8rem', marginBottom: '16px' }}>📌</div>
            <p
              className="body-text"
              style={{
                marginBottom: '28px',
                color: '#0f2147',
                lineHeight: '1.8',
                fontSize: '1.1rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
              }}
            >
              your booking will be reviewed by the Parish Office within 2-3 business days. You'll receive a confirmation email once approved.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button
                type="button"
                className="button button-primary"
                onClick={handleConfirmSubmitBooking}
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(135deg, #0f2147 0%, #162c5c 100%)',
                  boxShadow: '0 8px 20px rgba(15, 33, 71, 0.15)',
                  padding: '12px 24px',
                  fontSize: '1rem',
                }}
              >
                confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.99) 0%, rgba(248, 251, 255, 0.99) 100%)', boxShadow: '0 32px 80px rgba(15, 33, 71, 0.2)', padding: '40px', borderRadius: '28px', maxWidth: '500px', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '20px' }}>✓</div>
            <h2 style={{ fontSize: '1.8rem', color: '#0f2147', margin: '0 0 16px' }}>Booking Submitted Successfully!</h2>
            <p className="body-text" style={{ marginBottom: '32px', color: '#5f7096', lineHeight: '1.7' }}>
              Your booking will be reviewed by the Parish Office within 2-3 business days. You'll receive a confirmation email once approved.
            </p>
            <button className="button button-primary" onClick={() => {
              setShowSuccessModal(false);
              navigate('/dashboard');
            }} style={{ padding: '14px 32px', fontSize: '1rem', background: 'linear-gradient(135deg, #0f2147 0%, #162c5c 100%)', boxShadow: '0 8px 20px rgba(15, 33, 71, 0.15)' }}>
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </MainLayout>

  );

}



export default EventBookingReviewPage;