import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import HeaderSearch from './HeaderSearch';

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
      <div className="brand-strip">
        <div className="brand-icon">MB</div>
        <div>
          <p className="small-label">MassBook</p>
          <strong>Parish Administration</strong>
        </div>
      </div>
      <div className="header-search">
        <HeaderSearch />
      </div>
      <div className="header-actions">
        <div className="profile-menu-wrapper" ref={menuRef}>
          <button
            type="button"
            className="avatar-button"
            onClick={() => setMenuOpen((current) => !current)}
            aria-expanded={menuOpen}
            aria-haspopup="menu"
            aria-label="Open user menu"
          >
            JD
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
