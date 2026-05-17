import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { apiFetch } from '../utils/api';

function RequestDetailsPage() {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState<any | null>(null);
  const [status, setStatus] = useState('Pending Review');
  const [actionNote, setActionNote] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!requestId) return;

    apiFetch(`/requests/${requestId}`)
      .then((data) => {
        setRequest(data);
        setStatus(data.status ?? 'Pending Review');
      })
      .catch(() => setError('Unable to load request details.'))
      .finally(() => setLoading(false));
  }, [requestId]);

  if (loading) {
    return (
      <MainLayout>
        <TopBar
          title="Request Details"
          subtitle="Loading request data..."
          badge="Pending Approvals"
        />
        <div className="page-body">
          <div className="panel" style={{ padding: 24 }}>
            <p className="body-text">Fetching request details from the backend.</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!request || error) {
    return (
      <MainLayout>
        <TopBar
          title="Request Details"
          subtitle="The requested record could not be found."
          badge="Pending Approvals"
        />
        <div className="page-body">
          <div className="panel" style={{ padding: 24 }}>
            <p className="body-text">{error || 'No request was found for this ID.'}</p>
            <Link to="/pending-approvals" className="button button-secondary">
              Back to Pending Approvals
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleApprove = async () => {
    if (!requestId) return;
    try {
      await apiFetch(`/requests/${requestId}/approve`, { method: 'POST' });
      setStatus('Approved');
      setActionNote('Request approved successfully! Added to schedule.');
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (error) {
      setActionNote(`Error: ${(error as Error).message}`);
    }
  };

  const handleDecline = async () => {
    if (!requestId) return;
    try {
      await apiFetch(`/requests/${requestId}/decline`, { method: 'POST' });
      setStatus('Declined');
      setActionNote('Request declined.');
      setTimeout(() => navigate('/pending-approvals'), 1500);
    } catch (error) {
      setActionNote(`Error: ${(error as Error).message}`);
    }
  };

  const handleRequestChanges = () => {
    setStatus('Change Requested');
  };

  return (
    <MainLayout>
      <TopBar
        title={`${request.title} Request Details`}
        subtitle="Review the request and update approval status for this event."
        badge="Pending Approvals"
      />

      {actionNote && (
        <div className={`feedback-message ${status === 'Approved' ? 'success' : status === 'Declined' ? 'error' : ''}`}>
          {actionNote}
        </div>
      )}

      <div className="request-details-grid">
        <section className="panel request-details-panel">
          <div className="request-actions-bar">
            <button className="button button-secondary" onClick={handleRequestChanges}>
              Request Changes
            </button>
            <button className="button button-danger" onClick={handleDecline}>
              Decline
            </button>
            <button className="button button-primary" onClick={handleApprove}>
              Approve
            </button>
          </div>

          <div className="request-summary-card">
            <div className="request-summary-head">
              <div>
                <p className="small-label">Event Details</p>
                <h2>{request.eventTitle}</h2>
                <p className="body-text" style={{ margin: '12px 0 0' }}>
                  {request.massType}
                </p>
              </div>
              <div className="request-status-block">
                <span className={`status-pill ${status === 'Pending Review' ? 'pending' : status === 'Approved' ? 'success' : status === 'Declined' ? 'declined' : 'warning'}`}>
                  {status}
                </span>
                <span className="request-id-pill">{request.id}</span>
              </div>
            </div>

            <div className="details-grid">
              <div className="detail-item">
                <span className="small-label">Preferred Celebrant</span>
                <strong>{request.preferredCelebrant}</strong>
              </div>
              <div className="detail-item">
                <span className="small-label">Location</span>
                <strong>{request.location}</strong>
              </div>
              <div className="detail-item">
                <span className="small-label">Proposed Date</span>
                <strong>{request.proposedDate}</strong>
              </div>
              <div className="detail-item">
                <span className="small-label">Time</span>
                <strong>{request.proposedTime}</strong>
              </div>
              <div className="detail-item">
                <span className="small-label">Expected Guests</span>
                <strong>{request.expectedGuests}</strong>
              </div>
            </div>

            <div className="detail-box">
              <p className="small-label">Additional Notes</p>
              <p className="body-text" style={{ margin: 0 }}>{request.notes}</p>
            </div>
          </div>

          <div className="panel request-contact-panel">
            <div className="section-heading">Parishioner Info</div>
            <div className="contact-grid">
              {[request.primaryContact, request.secondaryContact].map((person: any) => (
                <div key={person.email} className="contact-card">
                  <div className="contact-avatar">{person.name.split(' ').map((segment: any) => segment[0]).join('').slice(0, 2)}</div>
                  <div className="contact-details">
                    <p className="small-label" style={{ marginBottom: 6 }}>{person.role}</p>
                    <strong>{person.name}</strong>
                    <p className="body-text" style={{ margin: '8px 0 0' }}>{person.email}</p>
                    <p className="body-text" style={{ margin: 4 }}>{person.phone}</p>
                    <span className="badge success">{person.tag}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="panel request-side-panel">
          <div className="section-heading">Uploaded Documents</div>
          <div className="document-list">
            {request.documents.map((doc: any) => (
              <div key={doc.label} className={`document-row ${doc.status === 'missing' ? 'document-missing' : ''}`}>
                <div>
                  <strong>{doc.label}</strong>
                  <p className="body-text" style={{ margin: '6px 0 0' }}>
                    {doc.fileType} • {doc.size}
                  </p>
                </div>
                <div className="document-actions">
                  {doc.status === 'view' ? (
                    <button className="ghost-link">View</button>
                  ) : (
                    <span className="missing-text">Missing</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="section-heading" style={{ marginTop: 24 }}>Request History</div>
          <div className="history-list">
            {request.history.map((entry: any) => (
              <div key={entry.title} className="history-item">
                <div className="history-title-row">
                  <strong>{entry.title}</strong>
                  <span className="history-timestamp">{entry.timestamp}</span>
                </div>
                <p className="body-text" style={{ margin: '6px 0 0' }}>{entry.summary}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <div className="request-footer-actions">
        <button className="button button-secondary" onClick={() => navigate('/pending-approvals')}>
          Back to Pending Approvals
        </button>
        <div className="footer-note body-text">Changes are saved locally for review and approval workflows.</div>
      </div>
    </MainLayout>
  );
}

export default RequestDetailsPage;
