import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/play';
  const { register } = useAuth();

  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passcodes do not match. Verify and retry.');
      return;
    }

    if (password.length < 6) {
      setError('Passcode must be at least 6 characters long.');
      return;
    }

    setIsSubmitting(true);

    try {
      await register(username, email, password, displayName || username);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Registration failed. Callsign or email may already be in use.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-crosshair">+</div>
        <div className="auth-badge">NEW ENLISTMENT // SPARTAN CORPS</div>
        <h1 className="auth-title">ENLIST OPERATIVE</h1>
        <p className="auth-desc">Register your combat callsign to permanently archive mission records and compete on the Vanguard Leaderboard.</p>

        {error && (
          <div className="auth-error-alert" role="alert">
            <span className="error-dot" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="reg-username" className="form-label">
              CALLSIGN IDENTIFIER (USERNAME)
            </label>
            <input
              id="reg-username"
              type="text"
              required
              autoFocus
              className="form-input"
              placeholder="e.g. Spartan-117"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-displayName" className="form-label">
              TACTICAL DISPLAY NAME
            </label>
            <input
              id="reg-displayName"
              type="text"
              className="form-input"
              placeholder="e.g. Master Chief"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-email" className="form-label">
              SECURE TELEMETRY EMAIL
            </label>
            <input
              id="reg-email"
              type="email"
              required
              className="form-input"
              placeholder="operative@reach.unsc.org"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-password" className="form-label">
              SECURITY PASSCODE (MIN 6 CHARS)
            </label>
            <input
              id="reg-password"
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="reg-confirmPassword" className="form-label">
              CONFIRM PASSCODE
            </label>
            <input
              id="reg-confirmPassword"
              type="password"
              required
              minLength={6}
              className="form-input"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hud-btn auth-submit-btn active"
          >
            {isSubmitting ? 'COMMISSIONING NEW OPERATIVE...' : 'ENLIST & COMMENCE OPERATIONS'}
          </button>
        </form>

        <div className="auth-footer-links">
          <span>ALREADY COMMISSIONED?</span>
          <Link to={`/login?redirect=${encodeURIComponent(redirectPath)}`} className="auth-switch-link">
            OPERATIVE LOGIN
          </Link>
          <span className="link-dot">•</span>
          <Link to="/" className="auth-switch-link">
            RETURN TO BASE
          </Link>
        </div>
      </div>
    </div>
  );
}
