import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

interface Notification {
  id: string;
  type: 'approval' | 'decline' | 'new_request';
  message: string;
  timestamp: string;
}

function NotificationBell() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const menuRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);

  // Get user info from localStorage
  const raw = typeof window !== 'undefined' ? localStorage.getItem('authUser') : null;
  let authUser: { name?: string; role?: string; email?: string; id?: number } | null = null;
  try {
    authUser = raw ? JSON.parse(raw) : null;
  } catch (e) {
    authUser = null;
  }
  const isAdmin = authUser?.role === 'admin';

  // Poll for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        if (isAdmin) {
          // Admin: fetch pending request count
          const data = await apiFetch('/pending-approvals/count');
          const pendingCount = data?.pending || 0;
          
          // Update unread count
          setUnreadCount(pendingCount);
          
          // Add notification if there are new pending requests
          if (pendingCount > 0) {
            setNotifications([
              {
                id: 'pending-requests',
                type: 'new_request',
                message: `${pendingCount} pending request${pendingCount > 1 ? 's' : ''} awaiting approval`,
                timestamp: new Date().toISOString()
              }
            ]);
          } else {
            setNotifications([]);
          }
        } else {
          // User: fetch their own requests to check for status changes
          const requests = await apiFetch('/requests');
          
          // Filter requests that belong to this user and have status changes
          const userRequests = Array.isArray(requests) 
            ? requests.filter((req: any) => 
                req.name === authUser?.name && 
                (req.status === 'approved' || req.status === 'declined')
              )
            : [];
          
          setUnreadCount(userRequests.length);
          
          // Create notifications for approved/declined requests
          const userNotifications: Notification[] = userRequests.map((req: any) => ({
            id: req.id,
            type: req.status === 'approved' ? 'approval' : 'decline',
            message: `Your ${req.type || 'request'} has been ${req.status}`,
            timestamp: req.submitted || new Date().toISOString()
          }));
          
          setNotifications(userNotifications);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    // Initial fetch
    fetchNotifications();

    // Poll every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);

    return () => clearInterval(interval);
  }, [isAdmin, authUser?.name]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current && 
        !menuRef.current.contains(event.target as Node) &&
        !bellRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setUnreadCount(0);
    }
  };

  const handleReviewClick = (notification: Notification) => {
    setIsOpen(false);
    setUnreadCount(0);
    
    if (notification.type === 'new_request') {
      // Admin: navigate to pending approvals page
      navigate('/pending-approvals');
    } else {
      // User: navigate to review page
      navigate('/event-booking/review');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'approval':
        return '✅';
      case 'decline':
        return '❌';
      case 'new_request':
        return '📋';
      default:
        return '🔔';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        ref={bellRef}
        type="button"
        className="notification-bell"
        onClick={handleBellClick}
        aria-label="Notifications"
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          position: 'relative',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <span style={{ fontSize: '20px' }}>🔔</span>
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              background: '#e53e3e',
              color: 'white',
              fontSize: '12px',
              fontWeight: 'bold',
              minWidth: '18px',
              height: '18px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0 4px'
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            marginTop: '8px',
            width: '450px',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 1000,
            maxHeight: '500px',
            overflowY: 'auto'
          }}
        >
          <div
            style={{
              padding: '16px 20px',
              borderBottom: '1px solid #e2e8f0',
              fontWeight: 'bold',
              fontSize: '16px'
            }}
          >
            Notifications
          </div>
          
          {notifications.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '15px' }}>
              No notifications
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                style={{
                  padding: '16px 20px',
                  borderBottom: '1px solid #f7fafc',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}
              >
                <span style={{ fontSize: '20px' }}>
                  {getNotificationIcon(notification.type)}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '15px', fontWeight: 500 }}>
                    {notification.message}
                  </div>
                  <div style={{ fontSize: '13px', color: '#64748b', marginTop: '6px' }}>
                    {new Date(notification.timestamp).toLocaleDateString()}
                  </div>
                </div>
                <button
                  onClick={() => handleReviewClick(notification)}
                  style={{
                    padding: '10px 20px',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f2147',
                    background: '#f7fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e2e8f0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f7fafc'}
                >
                  Review
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
