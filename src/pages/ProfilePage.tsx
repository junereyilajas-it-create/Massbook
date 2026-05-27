import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';

function ProfilePage() {
  const [userName, setUserName] = useState('Guest');
  const [userEmail, setUserEmail] = useState('');

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
        if (parsed?.email) {
          setUserEmail(parsed.email);
        }
      } catch {
        // ignore invalid stored user data
      }
    }
  }, []);

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <MainLayout>
      <TopBar title="Profile" subtitle="View and edit your profile" badge="Profile" />

      <section style={{ padding: 24 }}>
        <div style={{ maxWidth: 980, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', alignItems: 'center', gap: 24, marginBottom: 40 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
              <div
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  backgroundColor: '#cbd5e1',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '2rem',
                  textTransform: 'uppercase'
                }}
              >
                {initials || 'GU'}
              </div>
              <div>
                <h2 style={{ margin: 0, fontSize: '1.8rem' }}>{userName}</h2>
                <p style={{ margin: '6px 0 0', color: '#55637a' }}>Parishioner • Lives in Poblacion</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <Link to="/settings" className="button button-secondary">Edit Profile</Link>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 24 }}>
            <div>
              <div className="panel" style={{ padding: 20, marginBottom: 24 }}>
                <h3 className="section-heading">About</h3>
                <p style={{ marginTop: 8 }}>Member of the parish since 2012. Active in choir and outreach programs. Loves community events and volunteering.</p>
              </div>

              <div className="panel" style={{ padding: 20 }}>
                <h3 className="section-heading">Activity</h3>
                <ul style={{ marginTop: 12 }}>
                  <li>Donated flowers for the Easter celebration</li>
                  <li>Requested mass intentions for family</li>
                  <li>Signed up for parish volunteer program</li>
                </ul>
              </div>
            </div>

            <aside>
              <div className="panel" style={{ padding: 20 }}>
                <h4 className="small-label">Contact</h4>
                <p style={{ marginTop: 8 }}><strong>Email:</strong> {userEmail || 'Not provided'}</p>
                <p><strong>Phone:</strong> +63 912 345 6789</p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}

export default ProfilePage;
