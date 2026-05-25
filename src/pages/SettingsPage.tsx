import { useState } from 'react';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';

type TabName = 'Profile' | 'Security' | 'Parish Info' | 'Integrations';

function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('Profile');
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: 'Fr. Thomas Anderson',
    email: 't.anderson@stjudeparish.org',
    phone: '+1 (555) 123-4567',
    timezone: 'Eastern Standard Time (EST)',
  });

  const tabs: TabName[] = ['Profile', 'Security', 'Parish Info', 'Integrations'];

  const handleProfileChange = (field: string, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setMessage('Profile changes saved successfully.');
  };

  const handleSecurityAction = (action: string) => {
    setMessage(`${action} initiated. Check your email for verification.`);
  };

  const handleIntegration = (name: string) => {
    setMessage(`${name} configuration initiated.`);
  };

  return (
    <MainLayout>
      <TopBar title="Settings" subtitle="Manage profile, security, and parish integrations." badge="Settings" />

      <div className="settings-container">
        {/* Sidebar */}
        <aside className="settings-sidebar">
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`settings-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => {
                setActiveTab(tab);
                setMessage('');
              }}
            >
              {tab}
            </button>
          ))}
        </aside>

        {/* Content Area */}
        <div className="settings-content">
          {activeTab === 'Profile' && (
            <div className="profile-panel panel" style={{ width: '100%' }}>
              <div className="section-heading">Profile Settings</div>
              {message && <div className="feedback-message" style={{ marginBottom: '16px', color: '#0f2147', fontWeight: 600 }}>{message}</div>}

              <div className="profile-top">
                <div className="avatar-large">FA</div>
                <div style={{ flex: 1 }}>
                  <label className="small-label">Full Name</label>
                  <input
                    className="input-field"
                    value={profileData.fullName}
                    onChange={(e) => handleProfileChange('fullName', e.target.value)}
                  />
                </div>
              </div>

              <div className="field-grid">
                <div className="field-card">
                  <label className="small-label">Email Address</label>
                  <input
                    className="input-field"
                    value={profileData.email}
                    onChange={(e) => handleProfileChange('email', e.target.value)}
                  />
                </div>

                <div className="field-card">
                  <label className="small-label">Phone Number</label>
                  <input
                    className="input-field"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange('phone', e.target.value)}
                  />
                </div>

                <div className="field-card">
                  <label className="small-label">Timezone</label>
                  <select
                    className="select-field"
                    value={profileData.timezone}
                    onChange={(e) => handleProfileChange('timezone', e.target.value)}
                  >
                    <option>Eastern Standard Time (EST)</option>
                    <option>Central Standard Time (CST)</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <button className="button button-primary" type="button" onClick={handleSaveChanges}>
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="panel" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <div className="section-heading" style={{ alignSelf: 'flex-start' }}>Security</div>
              {message && <div className="feedback-message" style={{ marginBottom: '16px', color: '#0f2147', fontWeight: 600 }}>{message}</div>}
              <p className="body-text">Password last changed 3 months ago.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', width: '100%', maxWidth: '300px' }}>
                <button
                  className="button button-secondary"
                  type="button"
                  onClick={() => handleSecurityAction('Two-Factor Authentication')}
                >
                  Two-Factor Auth Enabled
                </button>
                <button className="button button-secondary" type="button" onClick={() => handleSecurityAction('Logout')}>
                  Logout from all devices
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Parish Info' && (
            <div className="panel" style={{ width: '100%' }}>
              <div className="section-heading">Parish Information</div>
              {message && <div className="feedback-message" style={{ marginBottom: '16px', color: '#0f2147', fontWeight: 600 }}>{message}</div>}
              <div className="info-card">
                <div>
                  <strong>St. Jude Thaddeus Catholic Church</strong>
                  <p className="body-text">Archdiocese of New York</p>
                  <p className="body-text">456 Sacred Heart Ave, Manhattan, NY 10001</p>
                </div>
                <button className="button button-secondary" type="button" onClick={() => setMessage('Opening map interface...')}>
                  Update Map
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Integrations' && (
            <div className="panel" style={{ width: '100%' }}>
              <div className="section-heading">System Integration</div>
              {message && <div className="feedback-message" style={{ marginBottom: '16px', color: '#0f2147', fontWeight: 600 }}>{message}</div>}
              <div className="integration-grid">
                <div className="integration-card">
                  <strong>Vatican API Sync</strong>
                  <p className="body-text">Sync liturgical calendar with official Vatican directives.</p>
                  <div style={{ marginTop: '12px' }}>
                    <button className="ghost-link" type="button" onClick={() => handleIntegration('Vatican API Sync')}>
                      Configure
                    </button>
                  </div>
                </div>

                <div className="integration-card disabled">
                  <strong>Banking Connect</strong>
                  <p className="body-text">Direct integration with parish bank accounts for donations.</p>
                  <div style={{ marginTop: '12px' }}>
                    <button
                      className="ghost-link"
                      type="button"
                      onClick={() => setMessage('This feature is coming soon.')}
                    >
                      Coming Soon
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;

