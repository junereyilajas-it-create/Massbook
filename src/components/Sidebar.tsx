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

