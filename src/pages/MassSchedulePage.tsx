import { useEffect, useMemo, useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { Link, useSearchParams } from 'react-router-dom';
import { matchesQuery } from '../utils/searchRecords';
import { apiFetch } from '../utils/api';

function MassSchedulePage() {
  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');
  const [filter, setFilter] = useState<'All Masses' | 'Daily' | 'Sunday'>('All Masses');
  const [schedule, setSchedule] = useState<{ day: string; time: string; title: string }[]>([]);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';

  useEffect(() => {
    apiFetch('/schedules')
      .then((data) => setSchedule(data))
      .catch((error) => setMessage(`Unable to load schedule: ${error.message}`));
  }, []);

  const filteredSlots = useMemo(() => {
    if (!query.trim()) return schedule;
    return schedule.filter((slot) =>
      matchesQuery(`${slot.day} ${slot.time} ${slot.title}`, query),
    );
  }, [query, schedule]);


  const handleNewIntention = () => {
    // intentionally left blank (removed auto-add/new intention behavior)
    setMessage('');
  };

  const handleAutoAdd = () => {
    // removed auto-add mass behavior
    setMessage('');
  };

  const handleGoToToday = () => {
    setMessage('Jumped to today in the schedule.');
  };

  const handleFilter = (value: 'All Masses' | 'Daily' | 'Sunday') => {
    setFilter(value);
    setMessage(`Filtered schedule by ${value}.`);
  };

  const handleViewMode = (mode: 'weekly' | 'monthly') => {
    setViewMode(mode);
    setMessage(`${mode === 'weekly' ? 'Weekly' : 'Monthly'} view selected.`);
  };

  return (
    <MainLayout>
      <TopBar title="Mass Schedule" subtitle="Review the liturgical calendar and manage mass intentions." badge="Mass Schedule" />

      <section className="schedule-page">
        <div className="schedule-header">
          <div className="schedule-tabs">
            <button
              className={`button button-secondary ${viewMode === 'weekly' ? 'active' : ''}`}
              onClick={() => handleViewMode('weekly')}
            >
              Weekly View
            </button>
            <button
              className={`button button-secondary ${viewMode === 'monthly' ? 'active' : ''}`}
              onClick={() => handleViewMode('monthly')}
            >
              Monthly View
            </button>
          </div>
          <div className="schedule-filters">
            {(['All Masses', 'Daily', 'Sunday'] as const).map((value) => (
              <span
                key={value}
                className={`filter-pill ${filter === value ? 'active' : ''}`}
                onClick={() => handleFilter(value)}
                role="button"
                tabIndex={0}
              >
                {value}
              </span>
            ))}
          </div>
          <div className="schedule-actions">
            {/* Auto-add mass / new intention controls removed */}
          </div>
        </div>

        <div className="schedule-board">
          <div className="schedule-range">
            <span>October 21 – 27, 2024</span>
            <button className="ghost-link" onClick={handleGoToToday}>Go to Today</button>
          </div>
          {message && <div className="feedback-message">{message}</div>}
          <div className="schedule-grid">
            {filteredSlots.map((slot) => (
              <div key={slot.day} className={`schedule-card ${slot.day === 'Wed' ? 'active-day' : ''}`}>
                <span className="schedule-time">{slot.time}</span>
                <strong>{slot.title}</strong>
                <p className="body-text">{slot.day === 'Sat' ? 'Anticipated Mass' : slot.day === 'Sun' ? 'Sunday High Mass' : slot.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/dashboard" className="button button-secondary">Back to Dashboard</Link>
      </div>
    </MainLayout>
  );
}

export default MassSchedulePage;
