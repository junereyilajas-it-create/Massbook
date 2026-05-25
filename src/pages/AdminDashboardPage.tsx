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
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [announcementTitle, setAnnouncementTitle] = useState('');
  const [announcementMessage, setAnnouncementMessage] = useState('');
  const [announcementType, setAnnouncementType] = useState('general');
  const [isCreatingAnnouncement, setIsCreatingAnnouncement] = useState(false);

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

  const handleTabChange = (tab: 'Week' | 'Month') => {
    setSelectedTab(tab);
  };

  const handleCreateAnnouncement = async () => {
    if (!announcementTitle || !announcementMessage) {
      setMessage('Please fill in both title and message.');
      return;
    }

    setIsCreatingAnnouncement(true);
    try {
      await apiFetch('/announcements', {
        method: 'POST',
        body: JSON.stringify({
          title: announcementTitle,
          message: announcementMessage,
          type: announcementType,
        }),
      });
      setMessage('Announcement created successfully!');
      setAnnouncementTitle('');
      setAnnouncementMessage('');
      setAnnouncementType('general');
      setShowAnnouncementModal(false);
    } catch {
      setMessage('Failed to create announcement. Please try again.');
    } finally {
      setIsCreatingAnnouncement(false);
    }
  };

  const handleOpenAnnouncementModal = () => {
    setShowAnnouncementModal(true);
    setAnnouncementTitle('');
    setAnnouncementMessage('');
    setAnnouncementType('general');
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
                  <Link to={`/pending-approvals/${item.id}`} className="ghost-link">
                    Review
                  </Link>
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
            <Link to="/admin/reports" className="action-card">
              <span>📄</span>
              <div>
                <strong>Reports</strong>
              </div>
            </Link>
            <button className="action-card" onClick={handleOpenAnnouncementModal}>
              <span>📢</span>
              <div>
                <strong>Create Announcement</strong>
              </div>
            </button>
          </div>
        </div>

        <div className="panel priest-assignments-card">
          <div className="assignments-header">
            <div>
              <div className="section-heading">Schedules</div>
              <p className="body-text">{new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</p>
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

      {showAnnouncementModal && (
        <div className="modal-overlay" onClick={() => setShowAnnouncementModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Announcement</h2>
              <button className="modal-close" onClick={() => setShowAnnouncementModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label className="small-label">Title</label>
                  <input
                    className="input-field"
                    type="text"
                    value={announcementTitle}
                    onChange={(e) => setAnnouncementTitle(e.target.value)}
                    placeholder="Announcement title"
                  />
                </div>
                <div>
                  <label className="small-label">Type</label>
                  <select
                    className="input-field"
                    value={announcementType}
                    onChange={(e) => setAnnouncementType(e.target.value)}
                  >
                    <option value="general">General</option>
                    <option value="feast">Feast/Special Event</option>
                  </select>
                </div>
                <div>
                  <label className="small-label">Message</label>
                  <textarea
                    className="input-field"
                    value={announcementMessage}
                    onChange={(e) => setAnnouncementMessage(e.target.value)}
                    placeholder="Announcement message"
                    rows={3}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="button button-secondary" onClick={() => setShowAnnouncementModal(false)}>
                Cancel
              </button>
              <button
                className="button button-primary"
                onClick={handleCreateAnnouncement}
                disabled={isCreatingAnnouncement}
              >
                {isCreatingAnnouncement ? 'Creating...' : 'Create Announcement'}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
}

export default AdminDashboardPage;