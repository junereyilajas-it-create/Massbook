import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface PendingRequest {
  id: number;
  title: string;
  type: string;
  requester_name: string;
  event_date: string;
  location: string;
  status: string;
}

function AdminDashboardPage() {
  const [pendingItems, setPendingItems] = useState<PendingRequest[]>([]);
  const [selectedTab, setSelectedTab] = useState<'Week' | 'Month'>('Week');
  const [message, setMessage] = useState('');
  const [loadingPending, setLoadingPending] = useState(true);

  useEffect(() => {
    // Fetch pending requests
    apiFetch('/requests')
      .then((data) => {
        const pending = Array.isArray(data) 
          ? data.filter((r: any) => r.status === 'Pending' || r.status === 'pending').slice(0, 5)
          : [];
        setPendingItems(pending);
      })
      .catch(() => setPendingItems([]))
      .finally(() => setLoadingPending(false));
  }, []);

  const handleApprove = async (id: number, title: string) => {
    try {
      await apiFetch(`/requests/${id}/approve`, { method: 'POST' });
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
      setMessage(`${title} approved and added to schedule.`);
    } catch (error) {
      setMessage(`Error approving request: ${(error as Error).message}`);
    }
  };

  const handleDecline = async (id: number, title: string) => {
    try {
      await apiFetch(`/requests/${id}/decline`, { method: 'POST' });
      setPendingItems((prev) => prev.filter((item) => item.id !== id));
      setMessage(`${title} declined.`);
    } catch (error) {
      setMessage(`Error declining request: ${(error as Error).message}`);
    }
  };

  const handleReports = () => {
    setMessage('Opening report view...');
  };

  const handleTabChange = (tab: 'Week' | 'Month') => {
    setSelectedTab(tab);
  };

  return (
    <MainLayout>
      <TopBar title="Dashboard" subtitle="Manage your upcoming sacraments and parish activities with peace and clarity." />

      {message && <div className="feedback-message">{message}</div>}
      <section className="admin-top-grid">
        <div className="panel pending-approvals-card">
          <div className="section-heading">Pending Approvals</div>
          <div className="approval-list">
            {!loadingPending && pendingItems.length ? (
              pendingItems.map((item) => (
                <div key={item.id} className="approval-item">
                  <div>
                    <strong>{item.title || item.type}</strong>
                    <p className="body-text">{item.event_date ? new Date(item.event_date).toLocaleDateString() : 'TBD'} • {item.location || 'Location TBD'}</p>
                  </div>
                  <div className="approval-actions">
                    <button className="ghost-link" type="button" onClick={() => handleDecline(item.id, item.title || item.type)}>
                      ✕
                    </button>
                    <button className="ghost-link" type="button" onClick={() => handleApprove(item.id, item.title || item.type)}>
                      ✓
                    </button>
                  </div>
                </div>
              ))
            ) : !loadingPending ? (
              <div className="body-text">No pending approvals remaining.</div>
            ) : (
              <div className="body-text">Loading pending approvals...</div>
            )}
          </div>
          <Link to="/pending-approvals" className="button button-secondary view-all-link">
            View All Requests
          </Link>
        </div>

        <div className="panel presiding-card">
          <div className="section-heading">Now Presiding</div>
          <strong className="presiding-name">Fr. Niel</strong>
          <p className="body-text presiding-event">Daily Noon Mass - Main Altar</p>
          <div className="presiding-contact">
            <span className="tag">Emergency:</span>
            <strong>(555) 012-3456</strong>
          </div>
        </div>
      </section>

      <section className="admin-bottom-grid">
        <div className="panel quick-actions-card">
          <div className="section-heading">Quick Actions</div>
          <div className="quick-actions-grid">
              <Link to="/admin/mass-schedule" className="action-card">
              <span>✏️</span>
              <div>
                <strong>Edit Schedule</strong>
              </div>
            </Link>
            <button className="action-card" type="button" onClick={handleReports}>
              <span>📄</span>
              <div>
                <strong>Reports</strong>
              </div>
            </button>
          </div>
        </div>

        <div className="panel priest-assignments-card">
          <div className="assignments-header">
            <div>
              <div className="section-heading">Priest Assignments</div>
              <p className="body-text">October 2023</p>
            </div>
            <div className="assignments-tabs">
              <button
                className={`tab ${selectedTab === 'Week' ? 'active' : ''}`}
                type="button"
                onClick={() => handleTabChange('Week')}
              >
                Week
              </button>
              <button
                className={`tab ${selectedTab === 'Month' ? 'active' : ''}`}
                type="button"
                onClick={() => handleTabChange('Month')}
              >
                Month
              </button>
            </div>
          </div>

          <div className="assignment-calendar">
            <div className="calendar-row header-row">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                <div key={day} className="calendar-cell header-cell">{day}</div>
              ))}
            </div>
            <div className="calendar-row body-row">
              {Array.from({ length: 7 }).map((_, index) => (
                <div key={index} className={`calendar-cell ${index === 5 ? 'today-cell' : ''}`}>
                  {index === 5 ? 'Today' : ''}
                  {index === 5 ? <span className="calendar-event">3 Weddings</span> : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default AdminDashboardPage;