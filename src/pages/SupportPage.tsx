import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { apiFetch } from '../utils/api';

function SupportPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [ticketData, setTicketData] = useState({
    name: 'Father Thomas',
    parishId: 'MB-8921',
    subject: 'Technical Issue',
    message: 'How can we assist you with MassBook today?',
  });

  const handleSearch = () => {
    setError('');
    setMessage(`Searching for: "${searchQuery}"...`);
  };

  const handleGuideClick = (title: string) => {
    setError('');
    setMessage(`Opening guide: ${title}`);
  };

  const handleTicketChange = (field: string, value: string) => {
    setTicketData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSendTicket = async () => {
    setError('');
    setMessage('');
    try {
      const response = await apiFetch('/support/ticket', {
        method: 'POST',
        body: JSON.stringify(ticketData),
      });
      setMessage(response.message || 'Support ticket sent successfully.');
    } catch (sendError) {
      setError((sendError as Error).message);
    }
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
            <strong>Mastering Sacramental Records</strong>
            <p className="body-text">Learn the protocols for digitizing and archiving parish registers with our step-by-step guide.</p>
            <button className="ghost-link" type="button" onClick={() => handleGuideClick('Mastering Sacramental Records')}>Read Full Guide</button>
          </div>
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

          <div className="panel contact-panel">
            <div className="section-heading">Submit a Ticket</div>
            <div className="field-card">
              <label className="small-label">Name</label>
              <input className="input-field" value={ticketData.name} onChange={(e) => handleTicketChange('name', e.target.value)} />
            </div>
            <div className="field-card">
              <label className="small-label">Parish ID</label>
              <input className="input-field" value={ticketData.parishId} onChange={(e) => handleTicketChange('parishId', e.target.value)} />
            </div>
            <div className="field-card">
              <label className="small-label">Subject</label>
              <input className="input-field" value={ticketData.subject} onChange={(e) => handleTicketChange('subject', e.target.value)} />
            </div>
            <div className="field-card">
              <label className="small-label">Message</label>
              <textarea className="input-field" rows={4} value={ticketData.message} onChange={(e) => handleTicketChange('message', e.target.value)} />
            </div>
            <button className="button button-primary" type="button" onClick={handleSendTicket}>Send Support Ticket</button>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/dashboard" className="button button-secondary">Back to Dashboard</Link>
      </div>
    </MainLayout>
  );
}

export default SupportPage;




