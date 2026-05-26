import { useEffect, useState } from 'react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'terms' | 'privacy';
}

function TermsAndPrivacyModal({ isOpen, onClose, initialTab = 'terms' }: TermsAndPrivacyModalProps) {
  const [activeTab, setActiveTab] = useState<'terms' | 'privacy'>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Terms & Privacy Policy</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'terms' ? 'active' : ''}`}
            onClick={() => setActiveTab('terms')}
          >
            Terms of Service
          </button>
          <button
            className={`modal-tab ${activeTab === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveTab('privacy')}
          >
            Privacy Policy
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'terms' ? (
            <div className="terms-content">
              <h3>Terms of Service</h3>
              <p className="body-text">
                Welcome to MassBook. By using our platform, you agree to these terms.
              </p>
              
              <h4>1. Acceptance of Terms</h4>
              <p className="body-text">
                By accessing and using MassBook, you accept and agree to be bound by these terms of service.
              </p>

              <h4>2. User Responsibilities</h4>
              <p className="body-text">
                Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account.
              </p>

              <h4>3. Acceptable Use</h4>
              <p className="body-text">
                You agree to use MassBook only for legitimate parish administration purposes and not for any illegal or unauthorized activities.
              </p>

              <h4>4. Data Accuracy</h4>
              <p className="body-text">
                Users must ensure that all information provided to the system is accurate and up-to-date.
              </p>

              <h4>5. Modifications</h4>
              <p className="body-text">
                We reserve the right to modify these terms at any time. Continued use of the platform constitutes acceptance of any changes.
              </p>

              <h4>6. Termination</h4>
              <p className="body-text">
                We reserve the right to terminate or suspend access to MassBook for violations of these terms.
              </p>
            </div>
          ) : (
            <div className="privacy-content">
              <h3>Privacy Policy</h3>
              <p className="body-text">
                Your privacy is important to us. This policy outlines how we collect, use, and protect your information.
              </p>

              <h4>1. Information We Collect</h4>
              <p className="body-text">
                We collect personal information such as name, email address, and contact details when you register for an account.
              </p>

              <h4>2. How We Use Your Information</h4>
              <p className="body-text">
                Your information is used to provide parish administration services, process bookings, and communicate with you about your requests.
              </p>

              <h4>3. Data Security</h4>
              <p className="body-text">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, or disclosure.
              </p>

              <h4>4. Data Sharing</h4>
              <p className="body-text">
                We do not sell, trade, or rent your personal information to third parties. Information may only be shared with parish administrators for legitimate purposes.
              </p>

              <h4>5. Your Rights</h4>
              <p className="body-text">
                You have the right to access, correct, or delete your personal information at any time.
              </p>

              <h4>6. Cookies</h4>
              <p className="body-text">
                We use cookies to improve user experience and track usage patterns. You can disable cookies in your browser settings.
              </p>

              <h4>7. Contact Us</h4>
              <p className="body-text">
                If you have questions about this privacy policy, please contact us through our support channels.
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="modal-actions">
            <button className="button button-primary" onClick={onClose}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsAndPrivacyModal;
