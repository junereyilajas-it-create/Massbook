import { useEffect, useMemo, useState } from 'react';

import MainLayout from '../components/MainLayout';

import TopBar from '../components/TopBar';

import { Link } from 'react-router-dom';

import { apiFetch } from '../utils/api';

import sanctuaryImg from '../sanctuary.png';

import DailyGospelCard from '../components/DailyGospelCard';





function DashboardPage() {

  const [currentDate, setCurrentDate] = useState(new Date());

  const [selectedDay, setSelectedDay] = useState(24);

  const [showAllAppointments, setShowAllAppointments] = useState(false);

  const [appointments, setAppointments] = useState<any[]>([]);

  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

  const [userName, setUserName] = useState('Guest');

  const [isLoading, setIsLoading] = useState(true);

  const [bookings, setBookings] = useState<any[]>([]);

  const [loadingBookings, setLoadingBookings] = useState(true);

  const [announcements, setAnnouncements] = useState<any[]>([]);

  const [loadingAnnouncements, setLoadingAnnouncements] = useState(true);



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

    setIsLoading(true);

    apiFetch('/appointments')

      .then((data) => {

        if (data && Array.isArray(data) && data.length > 0) {

          setAppointments(data);

          setSelectedAppointment(data[0]);

        }

      })

      .catch(() => {

        setAppointments([]);

        setSelectedAppointment(null);

      })

      .finally(() => {

        setIsLoading(false);

      });

  }, []);



  useEffect(() => {

    setLoadingBookings(true);

    apiFetch('/requests')

      .then((data) => {

        if (data && Array.isArray(data)) {

          setBookings(data);

        } else {

          setBookings([]);

        }

      })

      .catch(() => {

        setBookings([]);

      })

      .finally(() => {

        setLoadingBookings(false);

      });

  }, []);



  useEffect(() => {

    setLoadingAnnouncements(true);

    apiFetch('/announcements')

      .then((data) => {

        if (data && Array.isArray(data)) {

          setAnnouncements(data);

        } else {

          setAnnouncements([]);

        }

      })

      .catch(() => {

        setAnnouncements([]);

      })

      .finally(() => {

        setLoadingAnnouncements(false);

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



  const displayedAppointments = showAllAppointments ? appointments : appointments.slice(0, 3);



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

        {isLoading ? (

          <div className="panel" style={{ padding: '40px', textAlign: 'center' }}>

            <p className="body-text">Loading your dashboard...</p>

          </div>

        ) : (

          <div className="hero-card hero-dashboard-card">

            <div>

              <h2>Welcome, {userName}.</h2>

              <p className="body-text hero-copy">Manage your upcoming sacraments and parish activities with peace and clarity.</p>

              <Link to="/event-booking" className="button button-primary hero-button">Book New Event</Link>

              <div className="hero-gospel-spacer">

                <DailyGospelCard />

              </div>



            </div>

          <div className="hero-visual">

            <img

              src={sanctuaryImg}

              alt="Main Sanctuary"

              style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0 }}

            />

            </div>

          </div>

        )}



        <section className="admin-bottom-grid">

          <div className="panel">

            <div className="section-heading" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f2147' }}>Announcements</div>

            {loadingAnnouncements ? (

              <div className="body-text" style={{ fontSize: '1rem', color: '#4a5568' }}>Loading announcements...</div>

            ) : announcements.length > 0 ? (

              <div className="approval-list">

                {announcements.map((announcement) => (

                  <div key={announcement.id} className="approval-item" style={{ borderLeft: `4px solid ${announcement.type === 'feast' ? '#e53e3e' : '#3182ce'}`, padding: '16px', backgroundColor: '#f7fafc' }}>

                    <div>

                      <strong style={{ fontSize: '1.1rem', color: '#0f2147' }}>{announcement.title}</strong>

                      <p className="body-text" style={{ fontSize: '1rem', color: '#2d3748', marginTop: '8px' }}>{announcement.message}</p>

                    </div>

                  </div>

                ))}

              </div>

            ) : (

              <div className="body-text" style={{ fontSize: '1rem', color: '#4a5568' }}>No announcements at this time.</div>

            )}

          </div>



          <div className="panel">

            <div className="section-heading" style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f2147' }}>My Booking Requests</div>

            {loadingBookings ? (

              <div className="body-text" style={{ fontSize: '1rem', color: '#4a5568' }}>Loading your bookings...</div>

            ) : bookings.length > 0 ? (

              <div className="approval-list">

                {bookings.slice(0, 3).map((booking) => (

                  <div key={booking.id} className="approval-item" style={{ padding: '16px', backgroundColor: '#f7fafc' }}>

                    <div>

                      <strong style={{ fontSize: '1.1rem', color: '#0f2147' }}>{booking.type || 'Event'}</strong>

                      <p className="body-text" style={{ fontSize: '1rem', color: '#2d3748', marginTop: '8px' }}>

                        {booking.requested || 'TBD'}

                        {' • Submitted: '}

                        {booking.submitted || 'TBD'}

                      </p>

                    </div>

                    <span className={`status-pill ${booking.status === 'approved' ? 'success' : booking.status === 'pending' ? 'pending' : 'pending'}`} style={{ fontSize: '0.9rem', fontWeight: '600' }}>

                      {booking.status || 'Pending'}

                    </span>

                  </div>

                ))}

              </div>

            ) : (

              <div className="body-text" style={{ fontSize: '1rem', color: '#4a5568' }}>No booking requests found. <Link to="/event-booking" style={{ color: '#0f2147', fontWeight: 600 }}>Book your first event</Link></div>

            )}

          </div>

        </section>

      </section>

    </MainLayout>

  );

}



export default DashboardPage;

