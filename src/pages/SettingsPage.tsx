import { useState } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import TopBar from '../components/TopBar';

function SettingsPage() {
  const [message, setMessage] = useState('');
  const [profileData, setProfileData] = useState({
    fullName: 'Fr. Thomas Anderson',
    email: 't.anderson@stjudeparish.org',
    phone: '+1 (555) 123-4567',
    timezone: 'Eastern Standard Time (EST)',
  });

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

      <div className="settings-grid">
        <div className="profile-panel panel">
          <div className="section-heading">Profile Settings</div>
          {message && <div className="feedback-message">{message}</div>}

          <div className="profile-top">
            <div className="avatar-large">FA</div>
            <div>
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

          <button className="button button-primary" type="button" onClick={handleSaveChanges}>
            Save Changes
          </button>
        </div>

        <div className="settings-aside">
          <div className="panel">
            <div className="section-heading">Security</div>
            <p className="body-text">Password last changed 3 months ago.</p>
            <button
              className="button button-secondary"
              type="button"
              onClick={() => handleSecurityAction('Two-Factor Authentication')}
            >
              Two-Factor Auth Enabled
            </button>
            <button className="ghost-button" type="button" onClick={() => handleSecurityAction('Logout')}>
              Logout from all devices
            </button>
          </div>

          <div className="panel">
            <div className="section-heading">Parish Information</div>
            <div className="info-card">
              <div>
                <strong>St. Jude Thaddeus Catholic Church</strong>
                <p className="body-text">Archdiocese of New York</p>
                <p className="body-text">456 Sacred Heart Ave, Manhattan, NY 10001</p>
              </div>
              <button className="ghost-button" type="button" onClick={() => setMessage('Opening map interface...')}>
                Update Map
              </button>
            </div>
          </div>

          <div className="panel">
            <div className="section-heading">System Integration</div>
            <div className="integration-grid">
              <div className="integration-card">
                <strong>Vatican API Sync</strong>
                <p className="body-text">Sync liturgical calendar with official Vatican directives.</p>
                <button className="ghost-link" type="button" onClick={() => handleIntegration('Vatican API Sync')}>
                  Configure
                </button>
              </div>

              <div className="integration-card disabled">
                <strong>Banking Connect</strong>
                <p className="body-text">Direct integration with parish bank accounts for donations.</p>
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
      </div>

      <div style={{ marginTop: 24, textAlign: 'center' }}>
        <Link to="/dashboard" className="button button-secondary">
          Back to Dashboard
        </Link>
      </div>
    </MainLayout>
  );
}

export default SettingsPage;

