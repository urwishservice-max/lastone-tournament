import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function formatDuration(seconds) {
  if (!seconds || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function formatDate(isoString) {
  if (!isoString) return '--';
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch {
    return '--';
  }
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [leaderboard, setLeaderboard] = useState([]);
  const [personalBest, setPersonalBest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // 1. Fetch Global Top 50 Leaderboard
      const lbRes = await fetch('/api/leaderboard?limit=50');
      if (!lbRes.ok) {
        throw new Error(`Failed to retrieve leaderboard telemetry (Status ${lbRes.status})`);
      }
      const lbData = await lbRes.json();
      setLeaderboard(lbData);

      // 2. If logged in, fetch personal best
      const token = localStorage.getItem('lastzone_token');
      if (token) {
        try {
          const pbRes = await fetch('/api/leaderboard/me', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (pbRes.ok && pbRes.status === 200) {
            const pbText = await pbRes.text();
            setPersonalBest(pbText ? JSON.parse(pbText) : null);
          } else if (pbRes.status === 204 || pbRes.status === 404) {
            setPersonalBest(null);
          }
        } catch (pbErr) {
          console.warn('Personal best fetch error:', pbErr);
        }
      }
    } catch (err) {
      console.error('Leaderboard fetch error:', err);
      setError(err.message || 'Error communicating with military telemetry server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboardData();
  }, [fetchLeaderboardData]);

  return (
    <div className="leaderboard-page-wrapper">
      {/* Top Tactical Header */}
      <header className="lb-header">
        <div className="lb-header-left">
          <button
            className="hud-btn return-btn"
            onClick={() => navigate('/')}
            title="Return to Base"
          >
            <span className="btn-icon">‹</span>
            <span className="btn-label">RETURN TO VANGUARD</span>
          </button>
          <div className="lb-status-pill">
            <span className="pulse-indicator active" />
            <span className="status-title">GLOBAL COMBAT TELEMETRY</span>
          </div>
        </div>

        <div className="lb-header-center">
          <span className="operational-hud-title">VANGUARD SECTOR RANKINGS // REAL-TIME PERSISTENT ARCHIVE</span>
        </div>

        <div className="lb-header-right">
          <button
            className="hud-btn refresh-btn"
            onClick={fetchLeaderboardData}
            disabled={isLoading}
            title="Refresh Leaderboard Data"
          >
            <span className="btn-icon">↻</span>
            <span className="btn-label">{isLoading ? 'SYNCING...' : 'SYNC DATA'}</span>
          </button>
          <button
            className="hud-btn active play-action-btn"
            onClick={() => navigate('/play')}
            title="Deploy into Combat Sector"
          >
            <span className="btn-indicator" style={{ background: '#d7263d', boxShadow: '0 0 8px rgba(215, 38, 61, 0.8)' }} />
            <span className="btn-label" style={{ color: '#fff', fontWeight: 600 }}>▶ PLAY LASTZONE</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="lb-container">
        {/* Banner Section */}
        <div className="lb-hero-section">
          <div className="auth-crosshair">+</div>
          <span className="lb-hero-badge">OFFICIAL DEFENSE RECORDS // HIGH COMMAND</span>
          <h1 className="lb-hero-title">VANGUARD HALL OF HEROES</h1>
          <p className="lb-hero-desc">
            Deterministic rankings for operatives who stood firm in Sector 07. Score is evaluated on confirmed kills, wave progression, and combat survival time.
          </p>
        </div>

        {/* Operative Personal Best Dossier */}
        {isAuthenticated ? (
          <div className="personal-best-card">
            <div className="pb-header">
              <div className="pb-callsign-info">
                <span className="pb-tag">ACTIVE OPERATIVE RECORD</span>
                <h3 className="pb-name">
                  {user?.displayName || user?.username}{' '}
                  <span className="pb-handle">@{user?.username}</span>
                </h3>
              </div>
              {personalBest && (
                <div className="pb-rank-badge">
                  <span className="rank-label">CURRENT GLOBAL RANK</span>
                  <span className="rank-value">#{personalBest.rank}</span>
                </div>
              )}
            </div>

            {personalBest ? (
              <div className="pb-stats-grid">
                <div className="pb-stat">
                  <span className="stat-label">RECORD SCORE</span>
                  <span className="stat-num score-highlight">{personalBest.score.toLocaleString()}</span>
                </div>
                <div className="pb-stat">
                  <span className="stat-label">ZOMBIES ELIMINATED</span>
                  <span className="stat-num">{personalBest.kills}</span>
                </div>
                <div className="pb-stat">
                  <span className="stat-label">HIGHEST WAVE</span>
                  <span className="stat-num">WAVE {personalBest.wave}</span>
                </div>
                <div className="pb-stat">
                  <span className="stat-label">COMBAT DURATION</span>
                  <span className="stat-num font-mono">{formatDuration(personalBest.survivalDuration)}</span>
                </div>
                <div className="pb-stat">
                  <span className="stat-label">RECORD DATE</span>
                  <span className="stat-num font-mono">{formatDate(personalBest.completedAt)}</span>
                </div>
              </div>
            ) : (
              <div className="pb-empty-notice">
                <p>No confirmed combat runs recorded under this callsign yet.</p>
                <button className="hud-btn active inline-btn" onClick={() => navigate('/play')}>
                  COMMENCE FIRST MISSION
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="auth-prompt-card">
            <div className="prompt-content">
              <strong>OPERATIVE TELEMETRY UNLINKED</strong>
              <p>Authenticate your callsign to track personal records, sync kills, and compete on the global board.</p>
            </div>
            <div className="prompt-actions">
              <Link to="/login?redirect=/leaderboard" className="hud-btn active">
                OPERATIVE LOGIN
              </Link>
              <Link to="/register?redirect=/leaderboard" className="hud-btn">
                REGISTER CALLSIGN
              </Link>
            </div>
          </div>
        )}

        {/* Global Leaderboard Table */}
        <div className="lb-table-wrapper">
          <div className="lb-table-header-strip">
            <span className="strip-title">TOP TIER SURVIVAL OPERATIVES</span>
            <span className="strip-count">{leaderboard.length} RECORDED ENTRIES</span>
          </div>

          {error && (
            <div className="auth-error-alert" role="alert" style={{ margin: '20px' }}>
              <span className="error-dot" />
              <span>{error}</span>
            </div>
          )}

          {isLoading && leaderboard.length === 0 ? (
            <div className="lb-loading-box">
              <div className="pulse-indicator active" />
              <span>QUERYING SECURE POSTGRES ARCHIVE...</span>
            </div>
          ) : leaderboard.length === 0 && !error ? (
            <div className="lb-empty-box">
              <p>No operatives have logged combat runs yet. Be the first to enter Sector 07!</p>
              <button className="hud-btn active" onClick={() => navigate('/play')}>
                ▶ LAUNCH MISSION
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="lb-table">
                <thead>
                  <tr>
                    <th className="th-rank">RANK</th>
                    <th className="th-operative">OPERATIVE</th>
                    <th className="th-score">SCORE</th>
                    <th className="th-kills">KILLS</th>
                    <th className="th-wave">WAVE</th>
                    <th className="th-time">TIME</th>
                    <th className="th-date">RECORDED</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry) => {
                    const isCurrentUser = user && user.username === entry.username;
                    const rankClass =
                      entry.rank === 1
                        ? 'rank-first'
                        : entry.rank === 2
                        ? 'rank-second'
                        : entry.rank === 3
                        ? 'rank-third'
                        : '';

                    return (
                      <tr
                        key={`${entry.runId}-${entry.rank}`}
                        className={`${isCurrentUser ? 'current-user-row' : ''} ${rankClass}`}
                      >
                        <td className="td-rank">
                          <span className={`rank-pill ${rankClass}`}>
                            {entry.rank === 1 ? '🥇 #1' : entry.rank === 2 ? '🥈 #2' : entry.rank === 3 ? '🥉 #3' : `#${entry.rank}`}
                          </span>
                        </td>
                        <td className="td-operative">
                          <div className="op-info">
                            <span className="op-name">{entry.displayName || entry.username}</span>
                            <span className="op-handle">@{entry.username}</span>
                            {isCurrentUser && <span className="you-badge">YOU</span>}
                          </div>
                        </td>
                        <td className="td-score">
                          <span className="score-val">{entry.score.toLocaleString()}</span>
                        </td>
                        <td className="td-kills">
                          <span className="kills-val">{entry.kills}</span>
                        </td>
                        <td className="td-wave">
                          <span className="wave-badge">WAVE {entry.wave}</span>
                        </td>
                        <td className="td-time font-mono">
                          {formatDuration(entry.survivalDuration)}
                        </td>
                        <td className="td-date font-mono">
                          {formatDate(entry.completedAt)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
