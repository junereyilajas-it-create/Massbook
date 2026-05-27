interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>About MassBook</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="about-content">
            <h3>Welcome to MassBook</h3>
            <p className="body-text">
              MassBook is a modern parish administration platform designed to streamline mass bookings, event scheduling, and parish management. Built for parishes of all sizes, our intuitive system helps you focus on what matters most - serving your community.
            </p>

            <h4>Key Features</h4>
            <ul className="body-text" style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
              <li><strong>Mass Scheduling</strong> - Easily schedule daily, weekly, and special masses with an intuitive calendar interface</li>
              <li><strong>Event Booking</strong> - Streamlined booking process for baptisms, weddings, funerals, and other sacramental events</li>
              <li><strong>Admin Dashboard</strong> - Comprehensive dashboard for administrators to manage requests, approvals, and priest assignments</li>
              <li><strong>Daily Gospel</strong> - Keep your community engaged with daily gospel readings and reflections</li>
              <li><strong>Approval Workflow</strong> - Efficient approval system for booking requests with status tracking and notifications</li>
              <li><strong>Reports & Analytics</strong> - Generate reports on mass attendance, booking trends, and parish activities</li>
            </ul>

            <h4>Who Can Use MassBook?</h4>
            <p className="body-text">
              MassBook is designed for parishes, church administrators, priests, and parishioners. Whether you're managing a small parish or a large cathedral, our platform scales to meet your needs.
            </p>

            <h4>Getting Started</h4>
            <p className="body-text">
              Simply register for an account to start using MassBook. Administrators can manage the entire parish operations, while parishioners can book masses and events conveniently online.
            </p>

            <h4>Support</h4>
            <p className="body-text">
              For questions or support, follow us on Facebook or contact your parish administrator. We're here to help you make the most of MassBook.
            </p>
          </div>
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="button button-primary" onClick={onClose}>
              Got It
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutModal;
