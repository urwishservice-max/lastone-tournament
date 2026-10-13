import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function formatTimer(totalSecs) {
  const m = Math.floor(totalSecs / 60);
  const s = totalSecs % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function PlayPage() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // Unity State
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('INITIALIZING LAST ZONE OPERATIONAL ENVIRONMENT...');
  const [errorMessage, setErrorMessage] = useState(null);
  const [unityInstance, setUnityInstance] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Combat Run Telemetry State
  const [currentRunToken, setCurrentRunToken] = useState(null);
  const currentRunTokenRef = useRef(null);
  const tokenRef = useRef(token);
  const isSubmittingRef = useRef(false);

  useEffect(() => {
    tokenRef.current = token;
  }, [token]);

  useEffect(() => {
    currentRunTokenRef.current = currentRunToken;
  }, [currentRunToken]);

  const [runStartTime, setRunStartTime] = useState(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [isDebriefOpen, setIsDebriefOpen] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);

  // Debrief Form Fields (can be auto-filled by Unity or entered for debrief)
  const [debriefScore, setDebriefScore] = useState(0);
  const [debriefKills, setDebriefKills] = useState(0);
  const [debriefWave, setDebriefWave] = useState(1);

  // Initialize a new ranked run from backend
  const initRankedRun = useCallback(async () => {
    const activeAuthToken = token || localStorage.getItem('lastzone_token');
    if (!activeAuthToken) return null;
    try {
      const res = await fetch('/api/runs/start', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${activeAuthToken}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentRunToken(data.runToken);
        currentRunTokenRef.current = data.runToken;
        setRunStartTime(Date.now());
        setElapsedSeconds(0);
        setSubmissionResult(null);
        setSubmitError(null);
        return data.runToken;
      }
    } catch (err) {
      console.warn('Failed to start ranked run session:', err);
    }
    return null;
  }, [token]);

  // Start run once authenticated
  useEffect(() => {
    if (isAuthenticated && !currentRunToken) {
      initRankedRun();
    }
  }, [isAuthenticated, currentRunToken, initRankedRun]);

  // Live Timer ticker
  useEffect(() => {
    if (!runStartTime || submissionResult) return;
    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - runStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [runStartTime, submissionResult]);

  // Submit combat run to backend
  const submitCombatRun = useCallback(async (score, kills, wave, duration) => {
    if (isSubmittingRef.current) {
      console.warn('[LastZone] Run submission already in progress, skipping duplicate call.');
      return;
    }

    const activeAuthToken = tokenRef.current || localStorage.getItem('lastzone_token');
    if (!activeAuthToken) {
      setSubmitError('Authentication required to save combat telemetry. Please log in.');
      return;
    }

    let tokenToSubmit = currentRunTokenRef.current;
    if (!tokenToSubmit) {
      console.log('[LastZone] No active run token found, requesting new run token before submitting score...');
      tokenToSubmit = await initRankedRun();
      if (!tokenToSubmit) {
        setSubmitError('Could not establish active combat telemetry session with High Command.');
        return;
      }
    }

    isSubmittingRef.current = true;
    setIsSubmittingScore(true);
    setSubmitError(null);

    const numericScore = parseInt(score, 10) || 0;
    const numericKills = parseInt(kills, 10) || 0;
    const numericWave = Math.max(1, parseInt(wave, 10) || 1);
    const safeDuration = duration !== undefined && duration !== null ? Math.max(0, parseInt(duration, 10) || 0) : elapsedSeconds;

    console.log('[LastZone] Submitting combat telemetry to /api/runs/finish:', {
      runToken: tokenToSubmit,
      score: numericScore,
      kills: numericKills,
      wave: numericWave,
      survivalDuration: safeDuration
    });

    try {
      const res = await fetch('/api/runs/finish', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${activeAuthToken}`
        },
        body: JSON.stringify({
          runToken: tokenToSubmit,
          score: numericScore,
          kills: numericKills,
          wave: numericWave,
          survivalDuration: safeDuration,
          clientMetadata: 'Unity 6.6 WebGL // Sector 07 Combat'
        })
      });

      if (!res.ok) {
        let errDesc = `Failed to submit combat record (Status ${res.status})`;
        try {
          const errData = await res.json();
          errDesc = errData.message || errData.error || errDesc;
        } catch {}
        throw new Error(errDesc);
      }

      const result = await res.json();
      console.log('[LastZone] Telemetry confirmed by backend:', result);
      setSubmissionResult(result);
      setCurrentRunToken(null);
      currentRunTokenRef.current = null;
    } catch (err) {
      console.error('[LastZone] Score submission error:', err);
      setSubmitError(err.message || 'Error transmitting combat debrief to High Command.');
    } finally {
      setIsSubmittingScore(false);
      isSubmittingRef.current = false;
    }
  }, [elapsedSeconds, initRankedRun]);

  // Expose global callback for Unity WebGL game over
  useEffect(() => {
    window.onLastZoneGameOver = (score, kills, wave, duration) => {
      console.log('[LastZone] window.onLastZoneGameOver received:', { score, kills, wave, duration });
      const parsedScore = parseInt(score, 10) || 0;
      const parsedKills = parseInt(kills, 10) || 0;
      const parsedWave = Math.max(1, parseInt(wave, 10) || 1);
      const parsedDuration = Math.max(0, parseInt(duration, 10) || 0);

      setDebriefScore(parsedScore);
      setDebriefKills(parsedKills);
      setDebriefWave(parsedWave);
      setIsDebriefOpen(true);

      submitCombatRun(parsedScore, parsedKills, parsedWave, parsedDuration);
    };

    return () => {
      delete window.onLastZoneGameOver;
    };
  }, [submitCombatRun]);

  // Mount Unity WebGL engine
  useEffect(() => {
    let script = null;
    let isCancelled = false;
    let localUnityInstance = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const buildUrl = '/unity-game/Build';
    const cacheKey = Date.now();
    const loaderUrl = `${buildUrl}/lastzoneweb.loader.js?v=${cacheKey}`;

    const config = {
      arguments: [],
      dataUrl: `${buildUrl}/lastzoneweb.data?v=${cacheKey}`,
      frameworkUrl: `${buildUrl}/lastzoneweb.framework.js?v=${cacheKey}`,
      codeUrl: `${buildUrl}/lastzoneweb.wasm?v=${cacheKey}`,
      streamingAssetsUrl: '/unity-game/StreamingAssets',
      companyName: 'DefaultCompany',
      productName: 'lastzoneweb',
      productVersion: '0.1.0',
      showBanner: (msg, type) => {
        console.warn(`[Unity ${type}]: ${msg}`);
        if (type === 'error') {
          setErrorMessage(msg);
        }
      }
    };

    script = document.createElement('script');
    script.src = loaderUrl;
    script.async = true;

    script.onload = () => {
      if (isCancelled || !window.createUnityInstance) return;

      setLoadingText('STREAMING WASM ENGINE & SECTOR ASSETS...');

      window.createUnityInstance(canvas, config, (prog) => {
        if (isCancelled) return;
        const pct = Math.round(prog * 100);
        setProgress(pct);
        if (prog < 0.3) {
          setLoadingText('INITIALIZING WASM RUNTIME...');
        } else if (prog < 0.7) {
          setLoadingText('DECOMPRESSING FOREST SECTOR & ZOMBIE SHADERS...');
        } else if (prog < 1.0) {
          setLoadingText('CONFIGURING AUDIO BUS & TACTICAL RADAR...');
        } else {
          setLoadingText('FINALIZING COMBAT DEPLOYMENT...');
        }
      })
      .then((instance) => {
        if (isCancelled) {
          if (instance?.Quit) instance.Quit();
          return;
        }
        localUnityInstance = instance;
        setUnityInstance(instance);
        setIsLoading(false);
        canvas.focus();
      })
      .catch((err) => {
        if (isCancelled) return;
        console.error('Failed to load Unity WebGL instance:', err);
        setErrorMessage(typeof err === 'string' ? err : err.message || 'Error initializing Unity WebGL engine.');
        setIsLoading(false);
      });
    };

    script.onerror = () => {
      if (isCancelled) return;
      setErrorMessage('Failed to load Unity loader script from /unity-game/Build/lastzoneweb.loader.js');
      setIsLoading(false);
    };

    document.body.appendChild(script);

    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      isCancelled = true;
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      if (script && script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (localUnityInstance?.Quit) {
        try {
          localUnityInstance.Quit();
        } catch (e) {
          console.warn('Error during Unity Quit cleanup:', e);
        }
      }
    };
  }, []);

  const handleToggleFullscreen = () => {
    if (unityInstance?.SetFullscreen) {
      unityInstance.SetFullscreen(1);
    } else if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const handleManualDebriefOpen = () => {
    setIsDebriefOpen(true);
  };

  const handleDebriefFormSubmit = (e) => {
    e.preventDefault();
    submitCombatRun(debriefScore, debriefKills, debriefWave, elapsedSeconds);
  };

  const handleStartNewRun = () => {
    setSubmissionResult(null);
    setSubmitError(null);
    setIsDebriefOpen(false);
    setDebriefScore(0);
    setDebriefKills(0);
    setDebriefWave(1);
    initRankedRun();
    canvasRef.current?.focus();
  };

  return (
    <div className="play-page-wrapper" ref={containerRef}>
      {/* Top Tactical Bar */}
      <header className="play-header">
        <div className="play-header-left">
          <button
            className="hud-btn return-btn"
            onClick={() => navigate('/')}
            title="Return to Vanguard"
          >
            <span className="btn-icon">‹</span>
            <span className="btn-label">RETURN TO VANGUARD</span>
          </button>

          <button
            className="hud-btn lb-quick-btn"
            onClick={() => navigate('/leaderboard')}
            title="View Leaderboard"
          >
            <span className="btn-indicator" style={{ background: '#ffd700' }} />
            <span className="btn-label">LEADERBOARD</span>
          </button>
        </div>

        <div className="play-header-center">
          {isAuthenticated ? (
            <div className="telemetry-live-pill">
              <span className="pulse-indicator active" />
              <span className="tel-op">OP: {user?.displayName || user?.username}</span>
              <span className="tel-divider">|</span>
              <span className="tel-timer">SURVIVAL: {formatTimer(elapsedSeconds)}</span>
              {currentRunToken && <span className="tel-token-badge">RANKED RUN ACTIVE</span>}
            </div>
          ) : (
            <div className="unranked-warning-pill">
              <span className="warn-icon">⚠</span>
              <span>UNRANKED SIMULATION</span>
              <Link to="/login?redirect=/play" className="unranked-login-link">
                [LOGIN TO SAVE TELEMETRY]
              </Link>
            </div>
          )}
        </div>

        <div className="play-header-right">
          {isAuthenticated && (
            <button
              className="hud-btn debrief-btn"
              onClick={handleManualDebriefOpen}
              title="Open Combat Mission Debrief"
            >
              <span className="btn-label">MISSION DEBRIEF</span>
            </button>
          )}

          <button
            className="hud-btn fullscreen-btn"
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen Mode"
          >
            <span className="btn-icon">⤢</span>
            <span className="btn-label">{isFullscreen ? 'EXIT FULLSCREEN' : 'FULLSCREEN'}</span>
          </button>
        </div>
      </header>

      {/* Main Game Screen Container */}
      <main className="game-viewport-container">
        {/* Loading Overlay */}
        {isLoading && !errorMessage && (
          <div className="unity-loading-overlay">
            <div className="loading-card">
              <div className="loading-crosshair">+</div>
              <h2 className="loading-title">LASTZONE // COMBAT SECTOR</h2>
              <p className="loading-subtitle">{loadingText}</p>

              <div className="loading-bar-track">
                <div
                  className="loading-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="loading-meta">
                <span className="progress-digit">{progress.toString().padStart(3, '0')}%</span>
                <span className="tech-badge">UNITY 6.6 WEBGL // WASM</span>
              </div>

              <div className="loading-controls-hint">
                <span className="hint-pill">W A S D — MOVE</span>
                <span className="hint-pill">SPACE — JUMP / START</span>
                <span className="hint-pill">L-CLICK — FIRE</span>
                <span className="hint-pill">R-CLICK — AIM</span>
                <span className="hint-pill">R — RELOAD</span>
                <span className="hint-pill">ESC — UNLOCK CURSOR</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {errorMessage && (
          <div className="unity-error-overlay">
            <div className="error-card">
              <div className="error-icon">⚠</div>
              <h3 className="error-title">DEPLOYMENT FAILED</h3>
              <p className="error-desc">{errorMessage}</p>
              <div className="error-actions">
                <button className="hud-btn active" onClick={() => window.location.reload()}>
                  RELOAD DEPLOYMENT
                </button>
                <button className="hud-btn" onClick={() => navigate('/')}>
                  RETURN TO BASE
                </button>
              </div>
            </div>
          </div>
        )}

        {/* WebGL Canvas */}
        <canvas
          id="unity-canvas"
          ref={canvasRef}
          className="unity-game-canvas"
          tabIndex={-1}
          onClick={() => canvasRef.current?.focus()}
        />

        {/* Mission Debrief Modal Overlay */}
        {isDebriefOpen && (
          <div className="debrief-modal-overlay">
            <div className="debrief-card">
              <div className="auth-crosshair">+</div>

              {submissionResult ? (
                /* Confirmed Submission View */
                <div className="debrief-success">
                  <div className="debrief-badge success">HIGH COMMAND // MISSION ARCHIVED</div>
                  <h2 className="debrief-title">TELEMETRY SECURED</h2>
                  <p className="debrief-subtitle">Combat telemetry successfully written to persistent PostgreSQL archive.</p>

                  <div className="debrief-rank-highlight">
                    <span className="rank-label">OFFICIAL GLOBAL RANK</span>
                    <span className="rank-value">#{submissionResult.rank}</span>
                  </div>

                  <div className="debrief-stats-grid">
                    <div className="debrief-stat">
                      <span className="stat-label">FINAL SCORE</span>
                      <span className="stat-num score-highlight">{submissionResult.score.toLocaleString()}</span>
                    </div>
                    <div className="debrief-stat">
                      <span className="stat-label">ZOMBIES ELIMINATED</span>
                      <span className="stat-num">{submissionResult.kills}</span>
                    </div>
                    <div className="debrief-stat">
                      <span className="stat-label">WAVE REACHED</span>
                      <span className="stat-num">WAVE {submissionResult.wave}</span>
                    </div>
                    <div className="debrief-stat">
                      <span className="stat-label">SURVIVAL TIME</span>
                      <span className="stat-num font-mono">{formatTimer(submissionResult.survivalDuration)}</span>
                    </div>
                  </div>

                  <div className="debrief-actions">
                    <button className="hud-btn active" onClick={() => navigate('/leaderboard')}>
                      VIEW GLOBAL LEADERBOARD
                    </button>
                    <button className="hud-btn" onClick={handleStartNewRun}>
                      START NEW COMBAT RUN
                    </button>
                  </div>
                </div>
              ) : (
                /* Debrief Submission Form View */
                <div className="debrief-form-view">
                  <div className="debrief-badge">COMBAT TELEMETRY // MISSION REPORT</div>
                  <h2 className="debrief-title">TRANSMIT COMBAT DEBRIEF</h2>
                  <p className="debrief-subtitle">
                    Archive your run in Sector 07. Score is evaluated on confirmed kills, wave progression, and combat survival duration.
                  </p>

                  {submitError && (
                    <div className="auth-error-alert" role="alert">
                      <span className="error-dot" />
                      <span>{submitError}</span>
                    </div>
                  )}

                  <form onSubmit={handleDebriefFormSubmit} className="debrief-form">
                    <div className="debrief-inputs-row">
                      <div className="form-group">
                        <label className="form-label">COMBAT SCORE</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="form-input"
                          value={debriefScore}
                          onChange={(e) => setDebriefScore(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">CONFIRMED KILLS</label>
                        <input
                          type="number"
                          min="0"
                          required
                          className="form-input"
                          value={debriefKills}
                          onChange={(e) => setDebriefKills(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="debrief-inputs-row">
                      <div className="form-group">
                        <label className="form-label">WAVE REACHED</label>
                        <input
                          type="number"
                          min="1"
                          required
                          className="form-input"
                          value={debriefWave}
                          onChange={(e) => setDebriefWave(e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">SURVIVAL TIME</label>
                        <input
                          type="text"
                          readOnly
                          className="form-input font-mono readonly-input"
                          value={formatTimer(elapsedSeconds)}
                        />
                      </div>
                    </div>

                    <div className="debrief-actions">
                      <button
                        type="submit"
                        disabled={isSubmittingScore}
                        className="hud-btn active debrief-submit-btn"
                      >
                        {isSubmittingScore ? 'TRANSMITTING TELEMETRY...' : 'AUTHORIZE & LOG TO LEADERBOARD'}
                      </button>
                      <button
                        type="button"
                        className="hud-btn"
                        onClick={() => setIsDebriefOpen(false)}
                      >
                        RESUME COMBAT
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Bottom Telemetry Strip */}
      <footer className="play-footer">
        <div className="footer-meta-left">
          <span className="telemetry-item">OPERATIVE: <strong>{user?.displayName || user?.username || 'GUEST SPARTAN'}</strong></span>
          <span className="telemetry-separator">/</span>
          <span className="telemetry-item">STATUS: <strong>{currentRunToken ? 'AUTHENTICATED RANKED RUN' : 'STANDALONE SIMULATION'}</strong></span>
          <span className="telemetry-separator">/</span>
          <span className="telemetry-item">RENDERER: <strong>WEBGL 2.0 ACES TONEMAPPED</strong></span>
        </div>
        <div className="footer-meta-right">
          <span className="keys-hint">PRESS [ESC] TO UNLOCK MOUSE CURSOR</span>
        </div>
      </footer>
    </div>
  );
}
