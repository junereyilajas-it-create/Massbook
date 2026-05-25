import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const trimmedEmail = email.trim().toLowerCase();
  const emailError = trimmedEmail.length > 0 && !trimmedEmail.includes('@') ? 'Please include @ in your email address' : '';
  const passwordError = '';
  const isFormValid = trimmedEmail.length > 0 && trimmedEmail.includes('@') && password.length > 0;

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && isFormValid && !isLoading) {
        e.preventDefault();
        handleLogin();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isFormValid, isLoading, email, password]);

  const handleLogin = async () => {
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setError('Please enter a valid email address (e.g., user@example.com).');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const user = await apiFetch('/login', {
        method: 'POST',
        body: JSON.stringify({ email: trimmedEmail, password }),
      });

      localStorage.setItem('authenticated', user.role ?? 'client');
      localStorage.setItem('authUser', JSON.stringify(user));
      if (remember) {
        localStorage.setItem('remember', 'true');
      } else {
        localStorage.removeItem('remember');
      }
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (loginError) {
      const errorMessage = (loginError as Error).message;
      if (errorMessage.includes('401') || errorMessage.toLowerCase().includes('invalid')) {
        setError('Invalid email or password. Please check your credentials and try again.');
      } else if (errorMessage.includes('network') || errorMessage.toLowerCase().includes('fetch')) {
        setError('Unable to connect to the server. Please check your internet connection and try again.');
      } else {
        setError('An error occurred during login. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-shell">
      <form
        className="login-panel"
        onSubmit={(event) => {
          event.preventDefault();
          handleLogin();
        }}
        noValidate
      >
        <div className="login-brand">
          <img
            className="brand-icon large"
            src="https://scontent.fceb1-3.fna.fbcdn.net/v/t39.30808-6/276156596_125507780061132_6269600553415109799_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeG9UfAzafALCboy4uwHQtt-wkSZm6otrfDCRJmbqi2t8JAgK9g3KbqdCvjQAoTZGu54LGxP_bHXtzSr8mWvor4f&_nc_ohc=M_EcETu3uqwQ7kNvwHx6mrk&_nc_oc=Adq_mBBCGDExTXhMELdbE7bvtStR4LMVVyBDZ_OWWxDd-_vvJ236s7MxYojFouteO9o&_nc_zt=23&_nc_ht=scontent.fceb1-3.fna&_nc_gid=oGxunlUH92DonYK4rz_mpQ&_nc_ss=7b2a8&oh=00_Af6bBtUZV1tShdGUh1riUUwIC2Wt5DRFG4XwaY19VAwFEw&oe=6A1458DC"
            alt="MassBook Logo"
            style={{ objectFit: 'cover' }}
            referrerPolicy="no-referrer"
          />
          <div>
            <h2>MassBook</h2>
            <p className="body-text">Parish Administration Portal</p>
          </div>
        </div>

        {error && (
          <div id="login-feedback" className="feedback-message error" role="alert" aria-live="polite">
            {error}
          </div>
        )}

        <div className="field-card">
          <label htmlFor="login-email" className="small-label">
            Email Address
          </label>
          <input
            id="login-email"
            className="input-field"
            type="email"
            autoComplete="email"
            placeholder="administrator@parish.org"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            aria-invalid={!!emailError}
            aria-describedby={emailError ? 'email-error' : undefined}
          />
          {emailError && (
            <p id="email-error" className="body-text" style={{ color: '#c53030', fontSize: '0.85rem', marginTop: '4px' }}>
              {emailError}
            </p>
          )}
        </div>

        <div className="field-card">
          <label htmlFor="login-password" className="small-label">
            Password
          </label>
          <input
            id="login-password"
            className="input-field"
            type="password"
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            aria-invalid={!!passwordError}
            aria-describedby={passwordError ? 'password-error' : undefined}
          />
          {passwordError && (
            <p id="password-error" className="body-text" style={{ color: '#c53030', fontSize: '0.85rem', marginTop: '4px' }}>
              {passwordError}
            </p>
          )}
          <div className="text-right">
            <button className="ghost-link" type="button">
              Forgot Password?
            </button>
          </div>
        </div>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          <span>Remember this device</span>
        </label>

        <div className="login-actions">
          <button className="button button-primary" type="submit" disabled={!isFormValid || isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="login-footer">
          Don't have an account?{' '}
          <button className="ghost-link" type="button" onClick={() => navigate('/register')}>
            Create Account
          </button>
        </p>
      </form>
    </div>
  );
}

export default LoginPage;
