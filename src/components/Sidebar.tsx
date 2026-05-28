import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Calendar, Clock, FileText } from 'lucide-react';

const clientLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Calendar, label: 'Event Booking', path: '/event-booking' },
  { icon: Clock, label: 'Mass Schedule', path: '/mass-schedule' },
];

const adminLinks = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/admin-dashboard' },
  { icon: Clock, label: 'Mass Schedule', path: '/admin/mass-schedule' },
  { icon: FileText, label: 'Pending Approvals', path: '/pending-approvals' },
];

function Sidebar() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin') || location.pathname.startsWith('/pending-approvals');
  const links = isAdmin ? adminLinks : clientLinks;

  return (
    <aside className="side-menu">
      <div className="brand">
        <span className="brand-icon brand-cross" aria-hidden="true">✝</span>
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
            <span className="nav-icon">
              <link.icon size={20} />
            </span>
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;

