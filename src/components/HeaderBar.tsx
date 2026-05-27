import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import NotificationBell from './NotificationBell';

function HeaderBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  const profilePath = isAdmin ? '/admin/profile' : '/profile';

  // Load authenticated user from localStorage if available
  const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
  let authUser: { name?: string; role?: string; email?: string; avatar?: string } | null = null;
  try {
    authUser = raw ? JSON.parse(raw) : null;
  } catch (e) {
    authUser = null;
  }
  const displayName = authUser?.name || 'Guest User';
  const displayRole = authUser?.role || 'Parishioner';

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    setMenuOpen(false);
    navigate('/');
  };

  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="header-bar">
      <div className="header-actions" style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <NotificationBell />
        <div className="topbar-profile" ref={menuRef}>
          <button
            type="button"
            className="topbar-profile-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open user menu"
            title="Open user menu"
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                backgroundColor: '#cbd5e1',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.95rem',
                textTransform: 'uppercase'
              }}
            >
              {initials || 'GU'}
            </div>
            <div className="topbar-name" style={{ marginLeft: 10 }}>
              <div style={{ fontWeight: 800 }}>{displayName}</div>
              <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{displayRole}</div>
            </div>
          </button>

          {menuOpen && (
            <div className="profile-menu">
              <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(15,33,71,0.04)' }}>
                <div style={{ fontWeight: 800 }}>{displayName}</div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{displayRole}</div>
              </div>
              <Link to={profilePath} className="profile-menu-item" onClick={() => setMenuOpen(false)}>
                View Profile
              </Link>
              <Link to="/settings" className="profile-menu-item" onClick={() => setMenuOpen(false)}>
                Settings
              </Link>
              <Link to="/support" className="profile-menu-item" onClick={() => setMenuOpen(false)}>
                Support
              </Link>
              <button className="profile-menu-item logout-button" type="button" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HeaderBar;
