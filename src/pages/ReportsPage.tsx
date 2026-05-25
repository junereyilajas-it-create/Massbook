import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { apiFetch } from '../utils/api';

type ReportSummary = {
  totalUsers: number;
  eventStatus: { status: string; count: number }[];
  eventType: { name: string; count: number }[];
  totalSchedules: number;
};

function ReportsPage() {
  const [report, setReport] = useState<ReportSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    apiFetch('/reports/summary')
      .then((data) => setReport(data))
      .catch((err) => setError(`Failed to load reports: ${err.message}`))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <TopBar title="Reports" subtitle="Loading metrics..." />
        <div style={{ padding: '24px' }}>Loading...</div>
      </MainLayout>
    );
  }

  if (error || !report) {
    return (
      <MainLayout>
        <TopBar title="Reports" subtitle="System Metrics & Analytics" />
        <div style={{ padding: '24px' }} className="feedback-message error">
          {error || 'Unable to load report data.'}
        </div>
      </MainLayout>
    );
  }

  const pendingEvents = report.eventStatus.find((s) => s.status.toLowerCase() === 'pending')?.count || 0;
  const approvedEvents = report.eventStatus.find((s) => s.status.toLowerCase() === 'approved')?.count || 0;

  return (
    <MainLayout>
      <TopBar title="Reports" subtitle="System Metrics & Analytics" badge="Admin View" />

      <div style={{ padding: '24px' }}>
        <div className="dashboard-grid">
          <section className="admin-top-grid">
            <div className="panel hero-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="section-heading">Key Metrics</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '16px' }}>
                <div className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="small-label">Total Users</span>
                  <strong style={{ fontSize: '2rem' }}>{report.totalUsers}</strong>
                </div>
                <div className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="small-label">Schedules</span>
                  <strong style={{ fontSize: '2rem' }}>{report.totalSchedules}</strong>
                </div>
                <div className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="small-label">Pending Req</span>
                  <strong style={{ fontSize: '2rem' }}>{pendingEvents}</strong>
                </div>
                <div className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                  <span className="small-label">Approved Req</span>
                  <strong style={{ fontSize: '2rem' }}>{approvedEvents}</strong>
                </div>
              </div>
            </div>

            <div className="panel quick-actions-card">
              <div className="section-heading">Event Breakdown</div>
              <div className="list-card" style={{ marginTop: '16px', overflow: 'visible', maxHeight: 'none' }}>
                {report.eventType.length > 0 ? (
                  report.eventType.map((evt, idx) => (
                    <div key={idx} className="list-item">
                      <strong>{evt.name || 'Unknown Type'}</strong>
                      <span className="badge success" style={{ fontSize: '1rem', padding: '6px 12px' }}>
                        {evt.count}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="body-text">No events recorded yet.</p>
                )}
              </div>
            </div>
          </section>
        </div>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <Link to="/admin-dashboard" className="button button-secondary">
            Back
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}

export default ReportsPage;
