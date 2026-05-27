import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';
import TermsAndPrivacyModal from '../components/TermsAndPrivacyModal';

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [initialTab, setInitialTab] = useState<'terms' | 'privacy'>('terms');

  const isValid = name.trim() && email.trim().includes('@') && password.length > 0 && agreed;

  const handleOpenTerms = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setInitialTab('terms');
    setShowTermsModal(true);
  };

  const handleCreateAccount = async () => {
    if (!isValid) {
      setError('Please complete the form and agree to the terms.');
      return;
    }

    try {
      const user = await apiFetch('/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, phone }),
      });

      localStorage.setItem('authenticated', user.role ?? 'client');
      localStorage.setItem('authUser', JSON.stringify(user));
      setMessage('Account created successfully. Redirecting...');
      setError('');
      setTimeout(() => navigate('/dashboard'), 800);
    } catch (registrationError) {
      setError((registrationError as Error).message);
    }
  };

  return (
    <div className="auth-shell">
      <div className="register-panel">
        <section className="register-hero">
          <div>
            <p className="small-label">MassBook</p>
            <strong className="hero-heading">Join our parish digital community.</strong>
            <p className="body-text hero-copy">
              and stay connected with your parish administration in one serene space.
            </p>
          </div>

          <div className="hero-features">
            <div className="feature-item">
              <strong>Mass Schedules</strong>
              <span>Real-time booking and liturgical updates.</span>
            </div>
            <div className="feature-item">
            </div>
          </div>

          <div className="hero-visual" aria-hidden="true">
            <div className="hero-visual-placeholder">Parish Sanctuary</div>
          </div>
        </section>

        <section className="register-form-panel">
          <button className="back-button" onClick={() => navigate('/')}>← Back</button>

          <div className="register-form-header">
            <h2>Create Account</h2>
            <p className="body-text">Please fill in your details to get started.</p>
          </div>

          <form
            className="register-form"
            onSubmit={(event) => {
              event.preventDefault();
              handleCreateAccount();
            }}
            noValidate
          >
            {error && (
              <div className="feedback-message error" role="alert" aria-live="polite">
                {error}
              </div>
            )}
            {message && (
              <div className="feedback-message success" role="status" aria-live="polite">
                {message}
              </div>
            )}
            <div className="field-card">
              <label htmlFor="register-name" className="small-label">
                Full Name
              </label>
              <input
                id="register-name"
                className="input-field"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="John Doe"
              />
            </div>

            <div className="field-card">
              <label htmlFor="register-email" className="small-label">
                Email Address
              </label>
              <input
                id="register-email"
                className="input-field"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div className="field-card">
              <label htmlFor="register-phone" className="small-label">
                Phone Number
              </label>
              <input
                id="register-phone"
                className="input-field"
                type="tel"
                autoComplete="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+63 960 9407 854"
              />
            </div>

            <div className="field-card">
              <label htmlFor="register-password" className="small-label">
                Password
              </label>
              <input
                id="register-password"
                className="input-field"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="checkbox-row checkbox-panel">
              <input type="checkbox" checked={agreed} onChange={(event) => setAgreed(event.target.checked)} />
              <button type="button" className="ghost-link" onClick={handleOpenTerms}>
                I agree to the Terms of Service and Privacy Policy of MassBook.
              </button>
            </div>

            <button
              className="button button-primary full-width"
              type="submit"
              disabled={!isValid}
            >
              Create Account
            </button>
          </form>

          <p className="login-footer">
            Already have an account?{' '}
            <button className="ghost-link" onClick={() => navigate('/login')}>Login instead</button>
          </p>
        </section>
      </div>

      <TermsAndPrivacyModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        initialTab={initialTab}
      />
    </div>
  );
}

export default RegisterPage;
