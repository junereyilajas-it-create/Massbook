import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

function PendingApprovalsPage() {
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({ total: 0, weddings: 0, baptisms: 0, funerals: 0 });

  useEffect(() => {
    apiFetch('/requests')
      .then((data) => {
        const allRequests = Array.isArray(data) ? data : [];
        setRequests(allRequests);
        
        // Calculate metrics from pending requests
        const pendingOnly = allRequests.filter((r: any) => r.status === 'Pending' || r.status === 'pending');
        const weddings = pendingOnly.filter((r: any) => r.type?.toLowerCase().includes('wedding') || r.type?.toLowerCase().includes('matrimony')).length;
        const baptisms = pendingOnly.filter((r: any) => r.type?.toLowerCase().includes('baptism')).length;
        const funerals = pendingOnly.filter((r: any) => r.type?.toLowerCase().includes('funeral')).length;
        
        setMetrics({
          total: pendingOnly.length,
          weddings,
          baptisms,
          funerals,
        });
      })
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MainLayout>
      <TopBar title="Pending Approvals" subtitle="Manage and review incoming sacramental and event requests." badge="Pending Approvals" />

      <div className="approvals-toprow">
        <div className="metric-card">
          <span>Total Pending</span>
          <strong>{metrics.total}</strong>
          <span className="metric-note">Awaiting review</span>
        </div>
        <div className="metric-card">
          <span>Weddings</span>
          <strong>{metrics.weddings}</strong>
          <span className="metric-note">Awaiting prep</span>
        </div>
        <div className="metric-card">
          <span>Baptisms</span>
          <strong>{metrics.baptisms}</strong>
          <span className="metric-note">Next 30 days</span>
        </div>
        <div className="metric-card">
          <span>Funerals</span>
          <strong>{metrics.funerals}</strong>
          <span className="metric-note">Pending</span>
        </div>
      </div>

      <div className="panel approvals-table-panel">
        <div className="table-header">
          <span>Event Type</span>
          <span>Requester Name</span>
          <span>Requested Date</span>
          <span>Submission Date</span>
          <span>Status</span>
          <span>Actions</span>
        </div>
        {loading ? (
          <div className="body-text">Loading pending requests…</div>
        ) : requests.length ? (
          requests.map((request) => (
            <div key={request.id} className="table-row">
              <span>{request.type}</span>
              <span>{request.name}</span>
              <span>{request.requested}</span>
              <span>{request.submitted}</span>
              <span className={`status-pill ${request.status === 'Pending' ? 'pending' : 'success'}`}>{request.status}</span>
              <Link to={`/pending-approvals/${request.id}`} className="ghost-link">
                Review
              </Link>
            </div>
          ))
        ) : (
          <div className="body-text">No pending requests found.</div>
        )}
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/admin-dashboard" className="button button-secondary">Back to Admin Dashboard</Link>
      </div>
    </MainLayout>
  );
}

export default PendingApprovalsPage;
