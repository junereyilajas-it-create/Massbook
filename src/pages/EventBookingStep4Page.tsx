import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { apiFetch } from '../utils/api';
import { clearBookingDraft, loadBookingDraft } from '../utils/bookingStorage';

function EventBookingStep4Page() {
  const bookingDraft = loadBookingDraft();
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const [errorMessage, setErrorMessage] = useState<string>('');
  const [statusMessage, setStatusMessage] = useState<string>('');

  const parseLegacyTime = (value: string) => {
    const match = value.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
    if (!match) return value;
    let hour = Number(match[1]);
    const minute = match[2];
    const period = match[3].toUpperCase();
    if (hour === 12) {
      hour = period === 'AM' ? 0 : 12;
    } else if (period === 'PM') {
      hour += 12;
    }
    return `${String(hour).padStart(2, '0')}:${minute}:00`;
  };


  const handlePaymentSubmit = async () => {
    setIsProcessing(true);
    setErrorMessage('');
    setStatusMessage('Processing booking...');

    try {
      const user = localStorage.getItem('authUser');
      const authUser = user ? JSON.parse(user) : null;
      const eventTypeMap: Record<string, number> = {
        Wedding: 1,
        Baptism: 2,
        Funeral: 3,
        'Mass Intention': 4,
      };
      const payload = {
        event_type_id: eventTypeMap[bookingDraft.eventType] || 1,
        requester_name: authUser?.name || 'Guest Parishioner',
        email: authUser?.email || 'guest@massbook.church',
        contact_number: authUser?.phone || '(555) 123-4567',
        event_date: bookingDraft.eventDate || '2024-10-15',
        start_time: parseLegacyTime(bookingDraft.eventTime || '2:00 PM'),
        end_time: parseLegacyTime(bookingDraft.eventTime || '2:00 PM'),
        notes: bookingDraft.notes,
      };

      await apiFetch('/bookings', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      clearBookingDraft();
      setStatusMessage('Booking submitted successfully! Confirmation email sent.');
      setErrorMessage('');
      setTimeout(() => navigate('/dashboard'), 2000);
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
          {isProcessing && <div className="feedback-message">Please wait while we confirm your payment...</div>}
          <div className="step-tracker">
            <span className="step">1</span>
            <span className="step-line active" />
            <span className="step">2</span>
            <span className="step-line active" />
            <span className="step">3</span>
            <span className="step-line active" />
            <span className="step active">4</span>
          </div>

          <div className="verification-section">
            <div className="section-heading">Final Review</div>
            <div className="review-card">
              <div className="review-row">
                <span>Event Type</span>
                <strong>Wedding Mass</strong>
              </div>
              <div className="review-row">
                <span>Date & Time</span>
                <strong>October 15, 2024 at 2:00 PM</strong>
              </div>
              <div className="review-row">
                <span>Location</span>
                <strong>St. Jude Thaddeus Cathedral</strong>
              </div>
              <div className="review-row">
                <span>Duration</span>
                <strong>90 Minutes</strong>
              </div>
              <div className="review-row">
                <span>Total Fee</span>
                <strong>$250.00</strong>
              </div>
              <div className="review-row">
                <span>Status</span>
                <span className="status-pill pending">Ready for Submission</span>
              </div>
            </div>
          </div>

          <div className="document-verification">
            <div className="section-heading">All Documents Verified</div>
            <div className="document-list">
              <div className="document-row">
                <div>
                  <strong>Baptismal Certificate</strong>
                  <span className="body-text">Required for sacrament validity</span>
                </div>
                <span className="status-pill success">Verified</span>
              </div>
              <div className="document-row">
                <div>
                  <strong>Confirmation Record</strong>
                  <span className="body-text">Required for sacrament validity</span>
                </div>
                <span className="status-pill success">Verified</span>
              </div>
              <div className="document-row">
                <div>
                  <strong>Marriage License</strong>
                  <span className="body-text">Required for civil registration</span>
                </div>
                <span className="status-pill success">Verified</span>
              </div>
            </div>
          </div>

          <div className="terms-section">
            <div className="section-heading">Terms & Conditions</div>
            <div className="review-card">
              <div className="checkbox-row">
                <input type="checkbox" defaultChecked disabled />
                <span>I agree to the Parish Terms and Conditions for sacramental bookings.</span>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" defaultChecked disabled />
                <span>I understand that all documents must be verified before the ceremony.</span>
              </div>
              <div className="checkbox-row">
                <input type="checkbox" defaultChecked disabled />
                <span>I acknowledge that payment is required to secure the booking.</span>
              </div>
            </div>
          </div>
        </div>

        <aside className="booking-sidebar">
          <div className="panel booking-summary-panel">
            <div className="summary-label">Final Booking Summary</div>
            <div className="document-row">
              <div>
                <strong>Wedding Mass</strong>
                <span className="body-text">Sacrament of Matrimony</span>
              </div>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <strong>October 15, 2024</strong>
            </div>
            <div className="summary-row">
              <span>Time</span>
              <strong>2:00 PM</strong>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <strong>90 Minutes</strong>
            </div>
            <div className="summary-row">
              <span>Fee</span>
              <strong>$250.00</strong>
            </div>
            <div className="summary-row">
              <span>Status</span>
              <span className="status-pill pending">Pending Approval</span>
            </div>
          </div>

          <div className="panel payment-panel">
            <div className="section-heading">Payment Information</div>
            <div className="payment-method">
              <div className="payment-row">
                <span>Base Booking Fee</span>
                <strong>$200.00</strong>
              </div>
              <div className="payment-row">
                <span>Liturgical Music</span>
                <strong>$50.00</strong>
              </div>
              <div className="payment-row total">
                <span>Total</span>
                <strong>$250.00</strong>
              </div>
            </div>
            <button className="button button-primary full-width" type="button" onClick={handlePaymentSubmit} disabled={isProcessing}>
              {isProcessing ? 'Processing...' : 'Complete Payment & Submit'}
            </button>
          </div>

          <div className="panel success-panel">
            <div className="section-heading">What Happens Next?</div>
            <p className="body-text">After submission, your booking will be reviewed by the Parish Office within 2-3 business days. You'll receive a confirmation email once approved.</p>
          </div>

          <Link to="/event-booking/step3" className="button button-secondary full-width">Back to Step 3</Link>
        </aside>
      </section>
    </MainLayout>
  );
}

export default EventBookingStep4Page;