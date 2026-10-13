import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/play';
  const { login } = useAuth();

  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await login(usernameOrEmail, password);
      navigate(redirectPath);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div className="auth-crosshair">+</div>
        <div className="auth-badge">SECURITY PROTOCOL // ACCESS CLEARANCE</div>
        <h1 className="auth-title">OPERATIVE LOGIN</h1>
        <p className="auth-desc">Authenticate to sync mission telemetry and log ranked combat results.</p>

        {error && (
          <div className="auth-error-alert" role="alert">
            <span className="error-dot" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="usernameOrEmail" className="form-label">
              CALLSIGN OR SECURE EMAIL
            </label>
            <input
              id="usernameOrEmail"
              type="text"
              required
              autoFocus
              className="form-input"
              placeholder="e.g. Spartan-117 or operative@reach.com"
              value={usernameOrEmail}
              onChange={(e) => setUsernameOrEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              ACCESS PASSCODE
            </label>
            <input
              id="password"
              type="password"
              required
              className="form-input"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="hud-btn auth-submit-btn active"
          >
            {isSubmitting ? 'AUTHENTICATING NEURAL LINK...' : 'AUTHORIZE & ENTER COMBAT'}
          </button>
        </form>

        <div className="auth-footer-links">
          <span>NEW OPERATIVE?</span>
          <Link to={`/register?redirect=${encodeURIComponent(redirectPath)}`} className="auth-switch-link">
            REGISTER CALLSIGN
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
