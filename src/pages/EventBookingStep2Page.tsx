import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { loadBookingDraft, saveBookingDraft } from '../utils/bookingStorage';

function EventBookingStep2Page() {
  const draft = loadBookingDraft();
  const initialDate = draft.eventDate ? new Date(draft.eventDate) : new Date(2024, 9, 15);
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedTime, setSelectedTime] = useState(draft.eventTime || '2:00 PM');
  const [message, setMessage] = useState('');
  const [currentMonth, setCurrentMonth] = useState({ month: initialDate.toLocaleString('default', { month: 'long' }), year: initialDate.getFullYear() });
  const navigate = useNavigate();

  const timeSlots = ['9:00 AM', '10:30 AM', '12:00 PM', '2:00 PM', '4:00 PM'];

  const handleDaySelect = (dayNumber: number, available: boolean) => {
    if (!available) {
      setMessage('This date is not available. Please choose a different date.');
      return;
    }

    setSelectedDay(dayNumber);
    setMessage(`Selected ${currentMonth.month} ${dayNumber}, ${currentMonth.year}.`);
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setMessage(`Selected ${time} for your booking.`);
  };

  const handleUpload = () => setMessage('Document upload flow opened.');
  const handleEdit = () => setMessage('Editing booking details...');
  const handleContinue = () => {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const monthIndex = monthNames.indexOf(currentMonth.month);
    const eventMonth = String(monthIndex + 1).padStart(2, '0');
    const eventDate = `${currentMonth.year}-${eventMonth}-${String(selectedDay).padStart(2, '0')}`;
    saveBookingDraft({ eventDate, eventTime: selectedTime });
    navigate('/event-booking/step3');
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const monthOrder = ['September', 'October', 'November', 'December'];
    const currentIndex = monthOrder.indexOf(currentMonth.month);
    const nextIndex = direction === 'prev' ? Math.max(0, currentIndex - 1) : Math.min(monthOrder.length - 1, currentIndex + 1);
    setCurrentMonth({ month: monthOrder[nextIndex], year: 2024 });
  };

  return (
    <MainLayout>
      <TopBar title="Event Booking" subtitle="Schedule a sacred rite and manage parish event requests." badge="Step 2: Calendar Selection" />

      <section className="event-booking-grid">
        <div className="booking-main">
          <div className="step-tracker">
            <span className="step">1</span>
            <span className="step-line active" />
            <span className="step active">2</span>
            <span className="step-line" />
            <span className="step">3</span>
            <span className="step-line" />
            <span className="step">4</span>
          </div>

          <div className="calendar-selection">
            <div className="calendar-header">
              <div>{currentMonth.month} {currentMonth.year}</div>
              <div className="calendar-nav">
                <button type="button" className="calendar-nav-button" onClick={() => handleMonthChange('prev')}>‹</button>
                <button type="button" className="calendar-nav-button" onClick={() => handleMonthChange('next')}>›</button>
              </div>
            </div>
            <div className="calendar-grid large">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="calendar-cell header-cell">{day}</div>
              ))}
              {Array.from({ length: 35 }).map((_, index) => {
                const dayNumber = index + 1;
                const isAvailable = dayNumber > 10 && dayNumber < 25;
                const isSelected = dayNumber === selectedDay;
                return (
                  <button
                    key={dayNumber}
                    type="button"
                    className={`calendar-cell large-cell ${isAvailable ? 'available' : 'unavailable'} ${isSelected ? 'selected' : ''}`}
                    onClick={() => handleDaySelect(dayNumber, isAvailable)}
                    disabled={!isAvailable}
                  >
                    {dayNumber <= 31 ? dayNumber : ''}
                  </button>
                );
              })}
            </div>
            <div className="calendar-legend">
              <div className="legend-item">
                <div className="legend-color available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="legend-color unavailable"></div>
                <span>Unavailable</span>
              </div>
              <div className="legend-item">
                <div className="legend-color selected"></div>
                <span>Selected</span>
              </div>
            </div>
          </div>

          <div className="time-selection">
            <div className="section-heading">Available Times</div>
            <div className="time-grid">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  className={`time-slot ${selectedTime === time ? 'selected-time' : ''}`}
                  onClick={() => handleTimeSelect(time)}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>
        </div>

        <aside className="booking-sidebar">
          <div className="panel booking-summary-panel">
            <div className="summary-label">Booking Summary</div>
            <div className="document-row">
              <div>
                <strong>Wedding Mass</strong>
                <span className="body-text">Sacrament of Matrimony</span>
              </div>
              <button type="button" className="ghost-button small" onClick={handleEdit}>Edit</button>
            </div>
            <div className="summary-row">
              <span>Date</span>
              <strong>October 15, 2024</strong>
            </div>
            <div className="summary-row">
              <span>Time</span>
              <strong>2:00 PM</strong>
            </div>
            <div className="summary-row">
              <span>Duration</span>
              <strong>90 Minutes</strong>
            </div>
            <div className="summary-row">
              <span>Fee</span>
              <strong>$250.00</strong>
            </div>
          </div>

          <div className="panel document-panel">
            <div className="section-heading">Required Documentation</div>
            <div className="document-row">
              <div>
                <strong>Baptismal Certificate (Child)</strong>
                <span className="body-text">Uploaded on Oct 12, 2023</span>
              </div>
              <span className="status-pill success">Verified</span>
            </div>
            <div className="document-row">
              <div>
                <strong>Confirmation Record</strong>
                <span className="body-text">Uploaded on Oct 14, 2023</span>
              </div>
              <span className="status-pill success">Verified</span>
            </div>
            <div className="document-row upload-row">
              <div>
                <strong>Marriage License</strong>
                <span className="body-text">Upload the final certificate before submission.</span>
              </div>
              <button className="button button-secondary" type="button" onClick={handleUpload}>Upload</button>
            </div>
          </div>

          <button type="button" className="button button-primary full-width" onClick={handleContinue}>Continue to Step 3</button>
          <Link to="/event-booking/step1" className="button button-secondary full-width">Back to Step 1</Link>
        </aside>
      </section>
    </MainLayout>
  );
}

export default EventBookingStep2Page;