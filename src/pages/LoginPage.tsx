import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../utils/api';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const trimmedEmail = email.trim().toLowerCase();
  const isFormValid = trimmedEmail.length > 0 && trimmedEmail.includes('@') && password.length >= 8;

  const handleLogin = async () => {
    if (!isFormValid) {
      setError('Please enter a valid email and password.');
      return;
    }

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
      setError('');
      navigate(user.role === 'admin' ? '/admin-dashboard' : '/dashboard');
    } catch (loginError) {
      setError((loginError as Error).message);
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
          <div className="brand-icon large">MB</div>
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
          />
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
          />
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
          <button className="button button-primary" type="submit" disabled={!isFormValid}>
            Login
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
