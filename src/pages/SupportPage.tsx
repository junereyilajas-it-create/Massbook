import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';

function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSearch = () => {
    setError('');
    setMessage(`Searching for: "${searchQuery}"...`);
  };

  const handleGuideClick = (title: string) => {
    setError('');
    setMessage(`Opening guide: ${title}`);
  };

  return (
    <MainLayout>
      <div className="support-grid">
        <div className="support-hero panel">
          <div>
            <p className="small-label">Support Center</p>
            <h2>How can we help you today?</h2>
            <p className="body-text">Search our extensive knowledge base for liturgical guides, administrative tasks, and sacramental record management.</p>
          </div>
          {error && <div className="feedback-message error">{error}</div>}
          {message && <div className="feedback-message success">{message}</div>}
          <div className="search-card">
            <div className="header-search">
              <span className="search-icon">🔍</span>
              <input
                type="search"
                placeholder="Search FAQ, guides, and tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="button button-primary" type="button" onClick={handleSearch}>Search</button>
          </div>
        </div>

        <div className="support-cards">
          <div className="resource-card">
            <strong>Optimizing Priest Management</strong>
            <p className="body-text">Effectively coordinate multi-parish clergy schedules and mass intentions for festive seasons.</p>
            <button className="ghost-link" type="button" onClick={() => handleGuideClick('Optimizing Priest Management')}>Learn More</button>
          </div>
          <div className="resource-card secondary-card">
            <strong>User Handbook</strong>
            <p className="body-text">A comprehensive PDF covering all basic and advanced MassBook features.</p>
            <button className="ghost-link" type="button" onClick={() => setMessage('Downloading User Handbook PDF...')}>Download PDF</button>
          </div>
          <div className="resource-card">
            <strong>Keyboard Shortcuts</strong>
            <p className="body-text">Speed up your workflow with these time-saving keyboard shortcuts.</p>
            <button className="ghost-link" type="button" onClick={() => setMessage('Opening keyboard shortcuts guide...')}>View Shortcuts</button>
          </div>
        </div>

        <div className="panel" style={{ marginTop: '24px' }}>
          <div className="section-heading">Frequently Asked Questions</div>
          <div style={{ display: 'grid', gap: '16px', marginTop: '16px' }}>
            <div className="field-card">
              <strong>How do I book a sacrament?</strong>
              <p className="body-text">Navigate to Event Booking from the dashboard and follow the step-by-step wizard to select your event type, date, and upload required documents.</p>
            </div>
            <div className="field-card">
              <strong>What documents are required for weddings?</strong>
              <p className="body-text">Weddings require: Baptismal Certificate, Confirmation Certificate, PSA Birth Certificate, Marriage License, CENOMAR, Pre-Cana Seminar Certificate, Wedding Banns, and valid IDs.</p>
            </div>
            <div className="field-card">
              <strong>How do I cancel a booking?</strong>
              <p className="body-text">Click the "Cancel Booking" button in any step of the booking process. A confirmation dialog will appear to prevent accidental cancellations.</p>
            </div>
            <div className="field-card">
              <strong>What keyboard shortcuts are available?</strong>
              <p className="body-text">Press Enter to submit forms or continue to the next step. Press Escape to cancel operations or close dialogs.</p>
            </div>
          </div>
        </div>

        <div className="support-bottom-grid">
          <div className="panel">
            <div className="section-heading">Technical Support</div>
            <p className="body-text">Email us at support@massbook.church</p>
            <p className="body-text">Office Hours: Mon - Fri, 9am - 5pm EST</p>
            <div className="status-card">
              <strong>Status: Normal</strong>
              <p className="body-text">All MassBook cloud services are currently operational and performing within normal parameters.</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/dashboard" className="button button-secondary">Back</Link>
      </div>
    </MainLayout>
  );
}

export default SupportPage;




