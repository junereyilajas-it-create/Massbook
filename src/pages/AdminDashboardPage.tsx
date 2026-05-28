import { useEffect, useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import { formatDateKey } from '../utils/dateUtils';

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
  const [schedule, setSchedule] = useState<{ id: number; event_date: string; day: string; time: string; title: string; description: string; celebrant: string; requester: string; stipend: string; notes: string }[]>([]);
  const [viewMode, setViewMode] = useState<'today' | 'weekly' | 'monthly'>('weekly');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loadingPending, setLoadingPending] = useState(true);
  const [loadingSchedule, setLoadingSchedule] = useState(true);
  const [message, setMessage] = useState('');
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

    // Fetch schedule for dashboard summary
    apiFetch('/schedules')
      .then((data) => {
        setSchedule(Array.isArray(data) ? data : []);
      })
      .catch(() => setMessage('Unable to load schedule.'))
      .finally(() => setLoadingSchedule(false));
  }, []);

  const handleViewMode = (mode: 'today' | 'weekly' | 'monthly') => {
    setViewMode(mode);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDay = firstDay.getDay();
    const totalDays = lastDay.getDate();

    const days = [];
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= totalDays; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const getScheduleForDay = (date: Date) => {
    const dateStr = formatDateKey(date);
    return schedule.filter(slot => slot.event_date === dateStr);
  };

  const getTodaySchedule = () => {
    const today = new Date();
    const todayStr = formatDateKey(today);
    return schedule
      .filter(slot => slot.event_date === todayStr)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getWeekSchedule = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return dayNames.map(dayName => {
      const dayIndex = dayNames.indexOf(dayName);
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + dayIndex);

      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;

      return {
        day: dayName,
        date: dateStr,
        schedules: schedule
          .filter(slot => slot.event_date === dateStr)
          .sort((a, b) => a.time.localeCompare(b.time)),
      };
    });
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
                className={`tab ${viewMode === 'today' ? 'active' : ''}`}
                type="button"
                onClick={() => handleViewMode('today')}
              >
                Today
              </button>
              <button
                className={`tab ${viewMode === 'weekly' ? 'active' : ''}`}
                type="button"
                onClick={() => handleViewMode('weekly')}
              >
                Week
              </button>
              <button
                className={`tab ${viewMode === 'monthly' ? 'active' : ''}`}
                type="button"
                onClick={() => handleViewMode('monthly')}
              >
                Month
              </button>
            </div>
          </div>

          <div className="assignment-calendar">
            {loadingSchedule ? (
              <div style={{ padding: '30px', textAlign: 'center' }}>
                <p className="body-text">Loading schedule...</p>
              </div>
            ) : viewMode === 'monthly' ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', marginBottom: '16px' }}>
                  <button className="button button-secondary" type="button" onClick={handlePreviousMonth}>←</button>
                  <span style={{ fontWeight: 700 }}>{getMonthName(currentMonth)}</span>
                  <button className="button button-secondary" type="button" onClick={handleNextMonth}>→</button>
                </div>
                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="calendar-cell header-cell" style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f2147', backgroundColor: '#e2e8f0', padding: '14px' }}>{day}</div>
                  ))}
                  {getCalendarDays(currentMonth).map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="calendar-cell empty-cell" />;
                    }
                    const daySchedule = getScheduleForDay(date);
                    return (
                      <div key={date.toISOString()} className={`calendar-cell ${isToday(date) ? 'today-cell' : ''} ${daySchedule.length > 0 ? 'has-events' : ''}`}>
                        <div className="calendar-date"><strong>{date.getDate()}</strong></div>
                        {daySchedule.length > 0 && (
                          <div className="calendar-events">
                            {daySchedule.map((slot, idx) => (
                              <div key={idx} className="calendar-event-item">
                                <span className="event-time" style={{ fontWeight: '600' }}>{formatTime12Hour(slot.time)}</span>
                                <span className="event-title" style={{ fontWeight: '600' }}>{slot.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : viewMode === 'weekly' ? (
              <div className="calendar-row body-row">
                {getWeekSchedule().map(({ day, date, schedules }) => {
                  const isCurrentDay = formatDateKey(new Date()) === date;
                  return (
                    <div key={day} className={`calendar-cell ${isCurrentDay ? 'today-cell' : ''}`}>
                      <strong style={{ fontSize: '1.1rem', fontWeight: '800', color: '#0f2147' }}>{day}</strong>
                      <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '8px' }}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      {schedules.length > 0 ? (
                        schedules.map((slot, idx) => (
                          <div key={idx} className="calendar-event-item">
                            <span className="event-time" style={{ fontWeight: '600' }}>{formatTime12Hour(slot.time)}</span>
                            <span className="event-title" style={{ fontWeight: '600' }}>{slot.title}</span>
                          </div>
                        ))
                      ) : (
                        <div style={{ fontSize: '0.9rem', color: '#94a3b8', fontStyle: 'italic', fontWeight: '500' }}>No masses</div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ padding: '20px' }}>
                <div className="section-heading" style={{ marginBottom: '18px', fontSize: '1.3rem', fontWeight: '800', color: '#0f2147' }}>
                  Today's Schedule - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                {getTodaySchedule().length > 0 ? (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {getTodaySchedule().map((slot, idx) => (
                      <div key={idx} className="calendar-event-item" style={{ padding: '14px' }}>
                        <span className="event-time" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f2147' }}>{formatTime12Hour(slot.time)}</span>
                        <span className="event-title" style={{ fontSize: '1rem', fontWeight: '600', color: '#1e3a5f' }}>{slot.title}</span>
                        {slot.celebrant && <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#4a5568', marginTop: '6px' }}>Celebrant: {slot.celebrant}</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="panel" style={{ padding: '24px', textAlign: 'center', background: '#f8fbff' }}>
                    <p className="body-text" style={{ fontSize: '1.05rem', fontWeight: '600' }}>No masses scheduled for today.</p>
                  </div>
                )}
              </div>
            )}
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