import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';

function EventBookingStep3Page() {
  const [message, setMessage] = useState('');
  const [agreement, setAgreement] = useState([false, false, false]);
  const navigate = useNavigate();

  const handleUpload = (documentName: string) => {
    setMessage(`${documentName} upload dialog opened.`);
  };

  const handleCheckboxChange = (index: number) => {
    setAgreement((current) => current.map((value, idx) => (idx === index ? !value : value)));
  };

  const handleContinue = () => {
    if (!agreement.every(Boolean)) {
      setMessage('Please agree to all terms before continuing.');
      return;
    }
    navigate('/event-booking/step4');
  };

  return (
    <MainLayout>
      <TopBar title="Event Booking" subtitle="Schedule a sacred rite and manage parish event requests." badge="Step 3: Document Verification" />

      <section className="event-booking-grid">
        <div className="booking-main">
          {message && <div className="feedback-message">{message}</div>}
          <div className="step-tracker">
            <span className="step">1</span>
            <span className="step-line active" />
            <span className="step">2</span>
            <span className="step-line active" />
            <span className="step active">3</span>
            <span className="step-line" />
            <span className="step">4</span>
          </div>

          <div className="verification-section">
            <div className="section-heading">Document Verification Required</div>
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
            </div>
          </div>

          <div className="document-verification">
            <div className="section-heading">Upload Required Documents</div>
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
              <div className="document-row upload-row">
                <div>
                  <strong>Marriage License</strong>
                  <span className="body-text">Required for civil registration - Upload the final certificate</span>
                </div>
                <button type="button" className="button button-secondary" onClick={() => handleUpload('Marriage License')}>Upload Document</button>
              </div>
              <div className="document-row upload-row">
                <div>
                  <strong>Pre-Marital Counseling Certificate</strong>
                  <span className="body-text">Required by diocesan guidelines</span>
                </div>
                <button type="button" className="button button-secondary" onClick={() => handleUpload('Pre-Marital Counseling Certificate')}>Upload Document</button>
              </div>
            </div>
          </div>

          <div className="terms-section">
            <div className="section-heading">Terms & Conditions</div>
            <label className="checkbox-row">
              <input type="checkbox" checked={agreement[0]} onChange={() => handleCheckboxChange(0)} />
              <span>I agree to the Parish Terms and Conditions for sacramental bookings.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={agreement[1]} onChange={() => handleCheckboxChange(1)} />
              <span>I understand that all documents must be verified before the ceremony.</span>
            </label>
            <label className="checkbox-row">
              <input type="checkbox" checked={agreement[2]} onChange={() => handleCheckboxChange(2)} />
              <span>I acknowledge that payment is required to secure the booking.</span>
            </label>
          </div>
        </div>

        <aside className="booking-sidebar">
          <div className="panel booking-summary-panel">
            <div className="summary-label">Booking Summary</div>
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
          </div>

          <div className="panel document-panel">
            <div className="section-heading">Verification Status</div>
            <div className="document-row">
              <div>
                <strong>Documents Required</strong>
                <span className="body-text">2 of 4 documents uploaded</span>
              </div>
              <span className="status-pill pending">In Progress</span>
            </div>
          </div>

          <Link to="/event-booking/step4" className="button button-primary full-width">Continue to Review</Link>
          <Link to="/event-booking/step2" className="button button-secondary full-width">Back to Step 2</Link>
        </aside>
      </section>
    </MainLayout>
  );
}

export default EventBookingStep3Page;