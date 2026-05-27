import { FormEvent, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { apiFetch } from '../utils/api';

type MassEntry = {
  id?: number;
  event_date: string;
  day?: string;
  title?: string;
  massType: string;
  celebrant: string;
  time: string;
  description: string;
  requester: string;
  stipend: string;
  notes: string;
};

const initialFormState: MassEntry = {
  massType: 'Daily Mass',
  celebrant: 'Fr. Niel Limbaco',
  event_date: '',
  time: '08:00',
  description: '',
  requester: '',
  stipend: 'Standard',
  notes: '',
};

function AdminMassSchedulePage() {
  const [schedule, setSchedule] = useState<MassEntry[]>([]);
  const [addedMasses, setAddedMasses] = useState<MassEntry[]>([]);
  const [massForm, setMassForm] = useState<MassEntry>(initialFormState);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [viewMode, setViewMode] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [filterMode, setFilterMode] = useState<'all' | 'ordinary' | 'feasts'>('all');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const filteredSchedule = schedule.filter((slot) => {
    if (filterMode === 'feasts') return slot.title?.toLowerCase().includes('feast');
    if (filterMode === 'ordinary') return !slot.title?.toLowerCase().includes('feast');
    return true;
  });

  const formatTime12Hour = (time24: string) => {
    const [hours, minutes] = time24.split(':');
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  const getFilteredSlots = () => {
    let filtered = filteredSchedule;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (viewMode === 'today') {
      filtered = filteredSchedule.filter(slot => {
        const [year, month, day] = slot.event_date.split('-').map(Number);
        const slotDate = new Date(year, month - 1, day);
        slotDate.setHours(0, 0, 0, 0);
        return slotDate.getTime() === today.getTime();
      });
    } else if (viewMode === 'weekly') {
      const startOfWeek = new Date(today);
      startOfWeek.setDate(today.getDate() - today.getDay());
      startOfWeek.setHours(0, 0, 0, 0);
      
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      endOfWeek.setHours(23, 59, 59, 999);
      
      filtered = filteredSchedule.filter(slot => {
        const [year, month, day] = slot.event_date.split('-').map(Number);
        const slotDate = new Date(year, month - 1, day);
        return slotDate >= startOfWeek && slotDate <= endOfWeek;
      });
    } else if (viewMode === 'monthly') {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
      startOfMonth.setHours(0, 0, 0, 0);
      
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
      endOfMonth.setHours(23, 59, 59, 999);
      
      filtered = filteredSchedule.filter(slot => {
        const [year, month, day] = slot.event_date.split('-').map(Number);
        const slotDate = new Date(year, month - 1, day);
        return slotDate >= startOfMonth && slotDate <= endOfMonth;
      });
    }
    
    return filtered;
  };

  useEffect(() => {
    apiFetch('/schedules')
      .then((data) => setSchedule(data))
      .catch((error) => setSuccessMessage(`Unable to load schedule: ${error.message}`));
  }, []);

  const getCurrentWeekRange = () => {
    const now = new Date();
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} – ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  };

  const getCurrentMonthRange = () => {
    return currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleGoToToday = () => {
    setCurrentMonth(new Date());
    setViewMode('today');
    setFilterMode('all');
  };

  const getTodaySchedule = () => {
    return getFilteredSlots().sort((a, b) => a.time.localeCompare(b.time));
  };

  const getWeekSchedule = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    startOfWeek.setHours(0, 0, 0, 0);
    
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const filtered = getFilteredSlots();
    
    return dayNames.map(dayName => {
      const dayIndex = dayNames.indexOf(dayName);
      const targetDate = new Date(startOfWeek);
      targetDate.setDate(startOfWeek.getDate() + dayIndex);
      
      // Format date in local timezone
      const year = targetDate.getFullYear();
      const month = String(targetDate.getMonth() + 1).padStart(2, '0');
      const day = String(targetDate.getDate()).padStart(2, '0');
      const dateStr = `${year}-${month}-${day}`;
      
      return {
        day: dayName,
        date: dateStr,
        schedules: filtered.filter(slot => slot.event_date === dateStr).sort((a, b) => a.time.localeCompare(b.time))
      };
    });
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

  const formatDateStr = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getScheduleForDay = (date: Date) => {
    const dateStr = formatDateStr(date);
    return getFilteredSlots().filter(slot => slot.event_date === dateStr);
  };

  const updateForm = (field: keyof MassEntry, value: string) => {
    setMassForm((prev) => ({ ...prev, [field]: value }));
    setSuccessMessage('');
  };

  const handleAddMass = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const dayName = massForm.event_date
        ? new Date(massForm.event_date).toLocaleDateString('en-US', { weekday: 'short' })
        : 'New';

      const newSchedule = await apiFetch('/schedules', {
        method: 'POST',
        body: JSON.stringify({
          event_date: massForm.event_date,
          day: dayName,
          time: massForm.time,
          title: massForm.massType,
          description: massForm.description,
          celebrant: massForm.celebrant,
          requester: massForm.requester,
          stipend: massForm.stipend,
          notes: massForm.notes,
        }),
      });

      setAddedMasses((prev) => [massForm, ...prev]);
      setSchedule((prev) => [newSchedule, ...prev]);
      setMassForm(initialFormState);
      setShowForm(false);
      setSuccessMessage('Mass added successfully.');
      setShowSuccessModal(true);
    } catch (error) {
      setSuccessMessage(`Could not add mass: ${(error as Error).message}`);
      setShowSuccessModal(true);
    }
  };

  return (
    <MainLayout>
      <TopBar
        title="Mass Schedule"
        subtitle="Manage priest assignments, mass intentions, and the parish liturgical calendar."
        badge="Admin Mass Schedule"
      />

      <section className="schedule-page">
        <div className="panel priest-assignments-card">
          <div className="assignments-header">
            <div className="assignments-tabs">
              <button
                className={`tab ${viewMode === 'today' ? 'active' : ''}`}
                type="button"
                onClick={() => setViewMode('today')}
              >
                Today
              </button>
              <button
                className={`tab ${viewMode === 'weekly' ? 'active' : ''}`}
                type="button"
                onClick={() => setViewMode('weekly')}
              >
                Week
              </button>
              <button
                className={`tab ${viewMode === 'monthly' ? 'active' : ''}`}
                type="button"
                onClick={() => setViewMode('monthly')}
              >
                Month
              </button>
            </div>
            <button className="button button-primary" onClick={() => setShowForm((prev) => !prev)}>
              {showForm ? 'Cancel' : 'Add Mass'}
            </button>
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

        {showForm && (
          <div className="modal-overlay" onClick={() => setShowForm(false)}>
            <div className="modal-card panel" onClick={(event) => event.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <div className="section-heading">Add Mass</div>
                  <p className="body-text">Schedule a liturgy and assign prayer intentions.</p>
                </div>
                <button type="button" className="modal-close-button" onClick={() => setShowForm(false)}>
                  ×
                </button>
              </div>

              <form onSubmit={handleAddMass} className="modal-form-grid">
                <div className="field-card">
                  <span className="small-label">Mass Type</span>
                  <select
                    value={massForm.massType}
                    onChange={(event) => updateForm('massType', event.target.value)}
                  >
                    <option>Daily Mass</option>
                    <option>Sunday Mass</option>
                    <option>Wedding Mass</option>
                    <option>Baptism Mass</option>
                  </select>
                </div>

                <div className="field-card">
                  <span className="small-label">Date</span>
                  <input
                    type="date"
                    value={massForm.event_date}
                    onChange={(event) => updateForm('event_date', event.target.value)}
                  />
                </div>

                <div className="field-card">
                  <span className="small-label">Time</span>
                  <input
                    type="time"
                    value={massForm.time}
                    onChange={(event) => updateForm('time', event.target.value)}
                  />
                </div>

                <div className="modal-fieldset full-width">
                  <div className="modal-fieldset-heading">Mass Intentions</div>
                  <textarea
                    rows={4}
                    value={massForm.description}
                    onChange={(event) => updateForm('description', event.target.value)}
                    placeholder="e.g. For the soul of John Doe, In Thanksgiving for the Smith family..."
                  />
                </div>

                <div className="field-card">
                  <span className="small-label">Requester's Name</span>
                  <input
                    type="text"
                    value={massForm.requester}
                    onChange={(event) => updateForm('requester', event.target.value)}
                    placeholder="Name of individual or family"
                  />
                </div>

                <div className="modal-fieldset full-width">
                  <div className="modal-fieldset-heading">Internal Administrative Notes</div>
                  <textarea
                    rows={3}
                    value={massForm.notes}
                    onChange={(event) => updateForm('notes', event.target.value)}
                    placeholder="Add liturgical or scheduling notes..."
                  />
                </div>

                <div className="modal-footer full-width">
                  <button type="button" className="button button-secondary" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                  <button className="button button-primary" type="submit">
                    Schedule Mass
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="panel priest-assignments-card">
          <div className="assignment-calendar">
          {viewMode === 'monthly' ? (
            <div className="calendar-grid">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calendar-cell header-cell" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f2147', backgroundColor: '#e2e8f0', padding: '14px' }}>{day}</div>
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
          ) : viewMode === 'weekly' ? (
            <div className="calendar-row body-row">
              {getWeekSchedule().map(({ day, date, schedules }) => {
                const today = new Date();
                const todayStr = formatDateStr(today);
                const isDayToday = todayStr === date;
                return (
                  <div key={day} className={`calendar-cell ${isDayToday ? 'today-cell' : ''}`}>
                    <strong style={{ fontSize: '1.3rem', fontWeight: '800', color: '#0f2147' }}>{day}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '8px', fontWeight: '600' }}>{new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
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
              <div className="section-heading" style={{ marginBottom: '20px', fontSize: '1.4rem', fontWeight: '800', color: '#0f2147' }}>Today's Schedule - {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
              {getTodaySchedule().length > 0 ? (
                <div style={{ display: 'grid', gap: '12px' }}>
                  {getTodaySchedule().map((slot, idx) => (
                    <div key={idx} className="calendar-event-item" style={{ padding: '16px' }}>
                      <span className="event-time" style={{ fontSize: '1.2rem', fontWeight: '700', color: '#0f2147' }}>{formatTime12Hour(slot.time)}</span>
                      <span className="event-title" style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e3a5f' }}>{slot.title}</span>
                      {slot.celebrant && <div style={{ fontSize: '0.95rem', fontWeight: '500', color: '#4a5568', marginTop: '6px' }}>Celebrant: {slot.celebrant}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="panel" style={{ padding: '40px', textAlign: 'center', background: '#f8fbff' }}>
                  <p className="body-text" style={{ fontSize: '1.1rem', fontWeight: '600' }}>No masses scheduled for today.</p>
                </div>
              )}
            </div>
          )}
        </div>
        </div>
      </section>

      {showSuccessModal && (
        <div className="modal-overlay" onClick={() => setShowSuccessModal(false)}>
          <div className="modal-card panel" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="section-heading">Notification</div>
              </div>
              <button type="button" className="modal-close-button" onClick={() => setShowSuccessModal(false)}>
                ×
              </button>
            </div>
            <div className="modal-body">
              <p className="body-text">{successMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="button button-primary" onClick={() => setShowSuccessModal(false)}>
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/admin-dashboard" className="button button-secondary">
          Back
        </Link>
      </div>
    </MainLayout>
  );
}

export default AdminMassSchedulePage;
