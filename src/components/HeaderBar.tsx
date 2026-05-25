import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';

function HeaderBar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    localStorage.removeItem('authenticated');
    setMenuOpen(false);
    navigate('/');
  };

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
      <div className="header-actions" style={{ marginLeft: 'auto' }}>
        <div className="profile-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="avatar-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open user menu"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </button>
          {menuOpen && (
            <div className="profile-menu">
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
