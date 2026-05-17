import { NavLink, useLocation } from 'react-router-dom';

const clientLinks = [
  { icon: '🍠', label: 'Dashboard', path: '/dashboard' },
  { icon: '📆', label: 'Event Booking', path: '/event-booking' },
  { icon: '🚿', label: 'Mass Schedule', path: '/mass-schedule' },
];

const adminLinks = [
  { icon: '🍠', label: 'Dashboard', path: '/admin-dashboard' },
  { icon: '🚿', label: 'Mass Schedule', path: '/admin/mass-schedule' },
  { icon: '📝', label: 'Pending Approvals', path: '/pending-approvals' },
];

function Sidebar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/pending-approvals');
  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <aside className="side-menu">
      <div className="brand">
        <div className="brand-icon">MB</div>
        <div>
          <p className="small-label">MassBook</p>
          <strong>Parish Administration</strong>
        </div>
      </div>
      <nav className="nav-group" aria-label="Primary navigation">
        {links.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-icon">{link.icon}</span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>      <div className="nav-footer">
        <Link to="/" className="footer-link">
          ← Back to Login
        </Link>
      </div>    </aside>
  );
}

export default Sidebar;

