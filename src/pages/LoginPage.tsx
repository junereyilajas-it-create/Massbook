import { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { apiFetch } from '../utils/api';



function LoginPage() {

  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);

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

          <span className="brand-icon large brand-cross" aria-hidden="true">✝</span>

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

          <div className="password-input-wrapper">

            <input

              id="login-password"

              className="input-field password-input"

              type={showPassword ? 'text' : 'password'}

              autoComplete="current-password"

              placeholder="••••••••"

              value={password}

              onChange={(event) => setPassword(event.target.value)}

              aria-invalid={!!passwordError}

              aria-describedby={passwordError ? 'password-error' : undefined}

            />

            <button

              type="button"

              className="password-toggle-button"

              onClick={() => setShowPassword((currentValue) => !currentValue)}

              aria-label={showPassword ? 'Hide password' : 'Show password'}

              aria-pressed={showPassword}

            >

              <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">

                {showPassword ? (

                  <>

                    <path d="M2.3 12.4C3.4 9.9 6.2 7 12 7s8.6 2.9 9.7 5.4c.2.5.2 1.1 0 1.6C20.6 17.1 17.8 20 12 20S3.4 17.1 2.3 13.6a1.8 1.8 0 0 1 0-1.6Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

                    <circle cx="12" cy="14" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

                  </>

                ) : (

                  <>

                    <path d="M3 3l18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

                    <path d="M12 7c5.8 0 8.6 2.9 9.7 5.4.2.5.2 1.1 0 1.6C20.6 17.1 17.8 20 12 20c-5.8 0-8.6-2.9-9.7-5.4a1.8 1.8 0 0 1 0-1.6C3.4 9.9 6.2 7 12 7Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

                    <circle cx="12" cy="14" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />

                  </>

                )}

              </svg>

            </button>

          </div>

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

