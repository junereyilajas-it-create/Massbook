import { useEffect, useMemo, useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { Link, useSearchParams } from 'react-router-dom';
import { matchesQuery } from '../utils/searchRecords';
import { apiFetch } from '../utils/api';
import { Calendar } from 'lucide-react';

function MassSchedulePage() {
  const [viewMode, setViewMode] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [filter, setFilter] = useState<'All Masses' | 'Daily' | 'Sunday'>('All Masses');
  const [schedule, setSchedule] = useState<{ day: string; time: string; title: string; date?: string }[]>([]);
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    apiFetch('/schedules')
      .then((data) => setSchedule(data))
      .catch((error) => setMessage(`Unable to load schedule: ${error.message}`))
      .finally(() => setIsLoading(false));
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
    setCurrentMonth(new Date());
    setMessage('Jumped to today in the schedule.');
  };

  const handleFilter = (value: 'All Masses' | 'Daily' | 'Sunday') => {
    setFilter(value);
    setMessage(`Filtered schedule by ${value}.`);
  };

  const handleViewMode = (mode: 'today' | 'weekly' | 'monthly') => {
    setViewMode(mode);
    if (mode === 'today') {
      setCurrentMonth(new Date());
    }
    setMessage(`${mode === 'today' ? 'Today' : mode === 'weekly' ? 'Weekly' : 'Monthly'} view selected.`);
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
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
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[date.getDay()];
    return filteredSlots.filter(slot => slot.day === dayName);
  };

  const getTodaySchedule = () => {
    const today = new Date();
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dayName = dayNames[today.getDay()];
    return filteredSlots.filter(slot => slot.day === dayName);
  };

  const getWeekSchedule = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return dayNames.map(dayName => ({
      day: dayName,
      schedules: filteredSlots.filter(slot => slot.day === dayName)
    }));
  };

  return (
    <MainLayout>
      <TopBar title="Mass Schedule" subtitle="Review the liturgical calendar and manage mass intentions." badge="Mass Schedule" />

      <section className="schedule-page">
        <div className="panel priest-assignments-card">
          <div className="assignments-header">
            <div>
              <div className="section-heading">Mass Schedule</div>
              <p className="body-text">{viewMode === 'monthly' ? getMonthName(currentMonth) : viewMode === 'weekly' ? 'This Week' : 'Today'}</p>
            </div>
            <div className="assignments-tabs">
              <button
                className={`tab ${viewMode === 'today' ? 'active' : ''}`}
                type="button"
                onClick={() => handleViewMode('today')}
                style={{ fontSize: '1.1rem', fontWeight: '700', color: '#4a5568', border: viewMode === 'today' ? '2px solid #0f2147' : 'none' }}
              >
                Today
              </button>
              <button
                className={`tab ${viewMode === 'weekly' ? 'active' : ''}`}
                type="button"
                onClick={() => handleViewMode('weekly')}
                style={{ fontSize: '1.1rem', fontWeight: '700', color: '#4a5568', border: viewMode === 'weekly' ? '2px solid #0f2147' : 'none' }}
              >
                Week
              </button>
              <button
                className={`tab ${viewMode === 'monthly' ? 'active' : ''}`}
                type="button"
                onClick={() => handleViewMode('monthly')}
                style={{ fontSize: '1.1rem', fontWeight: '700', color: '#4a5568', border: viewMode === 'monthly' ? '2px solid #0f2147' : 'none' }}
              >
                Month
              </button>
            </div>
          </div>
          {viewMode === 'monthly' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '12px', fontSize: '1.2rem', fontWeight: '600' }}>
              <button 
                className="button button-secondary" 
                onClick={handlePreviousMonth}
                style={{ padding: '8px 16px', fontSize: '1.2rem' }}
              >
                ←
              </button>
              <span>{currentMonth.toLocaleDateString('en-US', { month: 'long' })} {currentMonth.getFullYear()}</span>
              <button 
                className="button button-secondary" 
                onClick={handleNextMonth}
                style={{ padding: '8px 16px', fontSize: '1.2rem' }}
              >
                →
              </button>
            </div>
          )}
        </div>

        <div className="panel priest-assignments-card">
          {isLoading ? (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <p className="body-text">Loading schedule...</p>
            </div>
          ) : (
            <div className="assignment-calendar">
              {viewMode === 'monthly' ? (
                <div className="calendar-grid">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="calendar-cell header-cell" style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f2147', backgroundColor: '#e2e8f0', padding: '12px' }}>{day}</div>
                  ))}
                  {getCalendarDays(currentMonth).map((date, index) => {
                    if (!date) {
                      return <div key={`empty-${index}`} className="calendar-cell empty-cell" />;
                    }
                    const daySchedule = getScheduleForDay(date);
                    return (
                      <div
                        key={date.toISOString()}
                        className={`calendar-cell ${isToday(date) ? 'today-cell' : ''} ${daySchedule.length > 0 ? 'has-events' : ''}`}
                      >
                        <div className="calendar-date">
                          <strong>{date.getDate()}</strong>
                        </div>
                        {daySchedule.length > 0 && (
                          <div className="calendar-events">
                            {daySchedule.map((slot, idx) => (
                              <div key={idx} className="calendar-event-item">
                                <span className="event-time">{slot.time}</span>
                                <span className="event-title">{slot.title}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : viewMode === 'weekly' ? (
                <div className="calendar-row body-row">
                  {getWeekSchedule().map(({ day, schedules }) => (
                    <div key={day} className={`calendar-cell ${day === new Date().toLocaleDateString('en-US', { weekday: 'short' }) ? 'today-cell' : ''}`}>
                      <strong>{day}</strong>
                      {schedules.map((slot, idx) => (
                        <span key={idx} className="calendar-event">{slot.time} - {slot.title}</span>
                      ))}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="calendar-grid">
                  <div className="section-heading">Today's Schedule</div>
                  {getTodaySchedule().length > 0 ? (
                    getTodaySchedule().map((slot, idx) => (
                      <div key={idx} className="calendar-cell">
                        <span className="event-time">{slot.time}</span>
                        <span className="event-title">{slot.title}</span>
                      </div>
                    ))
                  ) : (
                    <p className="body-text">No masses scheduled for today.</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/dashboard" className="button button-secondary">Back</Link>
      </div>
    </MainLayout>
  );
}

export default MassSchedulePage;
