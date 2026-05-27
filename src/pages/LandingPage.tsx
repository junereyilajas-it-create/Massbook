import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import TermsAndPrivacyModal from '../components/TermsAndPrivacyModal';
import AboutModal from '../components/AboutModal';

function LandingPage() {
  const navigate = useNavigate();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [initialTab, setInitialTab] = useState<'terms' | 'privacy'>('terms');
  const [showAboutModal, setShowAboutModal] = useState(false);

  const handleLoginClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/login');
  };

  const handlePrivacyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setInitialTab('privacy');
    setShowTermsModal(true);
  };

  const handleTermsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setInitialTab('terms');
    setShowTermsModal(true);
  };

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowAboutModal(true);
  };
  return (
    <div className="landing-shell">
      <header className="landing-header">
        <div className="landing-brand">
          <img
            className="brand-icon"
            src="https://scontent.fceb1-3.fna.fbcdn.net/v/t39.30808-6/276156596_125507780061132_6269600553415109799_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG9UfAzafALCboy4uwHQtt-wkSZm6otrfDCRJmbqi2t8JAgK9g3KbqdCvjQAoTZGu54LGxP_bHXtzSr8mWvor4f&_nc_ohc=M_EcETu3uqwQ7kNvwHx6mrk&_nc_oc=Adq_mBBCGDExTXhMELdbE7bvtStR4LMVVyBDZ_OWWxDd-_vvJ236s7MxYojFouteO9o&_nc_zt=23&_nc_ht=scontent.fceb1-3.fna&_nc_gid=oGxunlUH92DonYK4rz_mpQ&_nc_ss=7b2a8&oh=00_Af6bBtUZV1tShdGUh1riUUwIC2Wt5DRFG4XwaY19VAwFEw&oe=6A1458DC"
            alt="MassBook Logo"
            style={{ objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div>
            <p className="small-label">MassBook</p>
            <strong>Parish Administration</strong>
          </div>
        </div>
        <nav className="landing-nav">
          <button onClick={handleLoginClick} className="ghost-link">Login</button>
          <Link to="/register" className="button button-primary">Get Started</Link>
        </nav>
      </header>

      <section className="landing-hero">
        <div className="landing-hero-content">
          <p className="hero-label">Welcome to MassBook</p>
          <h1>Simplify Your Parish Administration</h1>
          <p className="hero-copy">
            Streamline mass bookings, event scheduling, and parish management with our modern, intuitive platform. 
            Designed for parishes of all sizes.
          </p>
          <div className="landing-cta">
            <Link to="/register" className="button button-primary hero-button">Get Started</Link>
            <button onClick={handleLoginClick} className="button button-secondary hero-button">Sign In</button>
          </div>
        </div>
        <div className="landing-hero-visual">
          <img
            src="https://i0.wp.com/christianpublishinghouse.co/wp-content/uploads/2019/11/jesus-baptism_the-baptism-of-jesus-by-john-1.png?fit=650%2C320&ssl=1"
            alt="Baptism of Jesus"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      </section>

      <section className="landing-features">
        <div className="landing-container">
          <div className="section-header">
            <p className="hero-label">Features</p>
            <h2>Everything You Need to Manage Your Parish</h2>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3>Mass Scheduling</h3>
              <p className="body-text">Easily schedule and manage daily, weekly, and special masses with an intuitive calendar interface.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <h3>Event Booking</h3>
              <p className="body-text">Streamlined booking process for baptisms, weddings, funerals, and other sacramental events.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <h3>Admin Dashboard</h3>
              <p className="body-text">Comprehensive dashboard for administrators to manage requests, approvals, and priest assignments.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h3>Daily Gospel</h3>
              <p className="body-text">Keep your community engaged with daily gospel readings and reflections.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <h3>Approval Workflow</h3>
              <p className="body-text">Efficient approval system for booking requests with status tracking and notifications.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"></line>
                  <line x1="12" y1="20" x2="12" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="14"></line>
                </svg>
              </div>
              <h3>Reports & Analytics</h3>
              <p className="body-text">Generate reports on mass attendance, booking trends, and parish activities.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="landing-cta-section">
        <div className="landing-container">
          <div className="cta-card">
            <h2>Ready to Transform Your Parish Management?</h2>
            <p className="hero-copy">Join hundreds of parishes already using MassBook to streamline their operations.</p>
            <div className="landing-cta">
              <Link to="/register" className="button button-primary hero-button">Get Started</Link>
              <button onClick={handleLearnMoreClick} className="button button-secondary hero-button">Learn More</button>
            </div>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <div className="landing-container">
          <div className="footer-content">
            <div className="footer-brand">
              <p className="small-label">MassBook</p>
              <strong>Parish Administration</strong>
              <p className="body-text" style={{ marginTop: '12px', fontSize: '0.9rem' }}>
                Modern parish management for the digital age.
              </p>
              <a 
                href="https://www.facebook.com/profile.php?id=100079465252449" 
                target="_blank" 
                rel="noopener noreferrer"
                className="button button-secondary"
                style={{ marginTop: '16px', fontSize: '0.9rem', padding: '10px 16px' }}
              >
                Follow us on Facebook
              </a>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <strong>Account</strong>
                <button onClick={handleLoginClick} className="footer-link-button">Login</button>
                <Link to="/register">Register</Link>
                <button onClick={handleLoginClick} className="footer-link-button">Reset Password</button>
              </div>
              <div className="footer-column">
                <strong>Legal</strong>
                <button onClick={handlePrivacyClick} className="footer-link-button">Privacy Policy</button>
                <button onClick={handleTermsClick} className="footer-link-button">Terms of Service</button>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="body-text" style={{ fontSize: '0.85rem' }}>
              © 2026 MassBook. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <TermsAndPrivacyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        initialTab={initialTab}
      />
      <AboutModal
        isOpen={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
    </div>
  );
}

export default LandingPage;
