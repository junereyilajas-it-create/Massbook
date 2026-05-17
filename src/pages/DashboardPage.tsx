import { useEffect, useMemo, useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';
import { appointmentCards } from '../data/mockData';
import { Link } from 'react-router-dom';
import { apiFetch } from '../utils/api';

function DashboardPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 9));
  const [selectedDay, setSelectedDay] = useState(24);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [appointments, setAppointments] = useState(appointmentCards);
  const [selectedAppointment, setSelectedAppointment] = useState(appointmentCards[0]);
  const [userName, setUserName] = useState('Guest');

  useEffect(() => {
    const storedUser = window.localStorage.getItem('authUser');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) {
          setUserName(parsed.name);
        } else if (parsed?.email) {
          const emailName = parsed.email.split('@')[0];
          setUserName(emailName.charAt(0).toUpperCase() + emailName.slice(1));
        }
      } catch {
        // ignore invalid stored user data
      }
    }
  }, []);

  useEffect(() => {
    apiFetch('/appointments')
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setAppointments(data);
          setSelectedAppointment(data[0]);
        }
      })
      .catch(() => {
        // keep the mock fallback data if backend is unavailable
      });
  }, []);

  const monthName = useMemo(
    () => currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }),
    [currentDate]
  );

  const daysInMonth = useMemo(
    () => new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate(),
    [currentDate]
  );

  const days = useMemo(() => Array.from({ length: daysInMonth }, (_, index) => index + 1), [daysInMonth]);

  const displayedAppointments = showAllAppointments ? appointmentCards : appointmentCards.slice(0, 3);

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
    setSelectedDay(1);
  };

  return (
    <MainLayout>
      <TopBar title="Dashboard" subtitle="Manage your upcoming sacraments and parish activities with peace and clarity." />

      <section className="dashboard-grid">
        <div className="hero-card hero-dashboard-card">
          <div>
            <h2>Welcome, {userName}.</h2>
            <p className="body-text hero-copy">Manage your upcoming sacraments and parish activities with peace and clarity.</p>
            <Link to="/event-booking/step1" className="button button-primary hero-button">Book New Event</Link>
          </div>
          <div className="hero-visual">
            <div className="hero-image">Main Sanctuary</div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default DashboardPage;
