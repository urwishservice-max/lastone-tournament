import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useExperience } from '../context/ExperienceContext';
import { useAuth } from '../context/AuthContext';

export default function TacticalHUD() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const {
    activeChapter,
    activeAct,
    isAudioActive,
    toggleSound,
    isMacroActive,
    enterMacro,
    exitMacro,
    scrollToAct
  } = useExperience();

  const handleMacroToggle = () => {
    if (isMacroActive) {
      exitMacro();
    } else {
      enterMacro('visor');
    }
  };

  const acts = [
    { id: 'I', name: 'AWAKENING', sceneIndex: 0 },
    { id: 'II', name: 'LEGACY', sceneIndex: 4 },
    { id: 'III', name: 'ARSENAL', sceneIndex: 6 },
    { id: 'IV', name: 'LAST LINE', sceneIndex: 8 }
  ];

  return (
    <header className="hud-header">
      <div className="hud-left">
        <span className="hud-corner-plus">+</span>
        <span className="chapter-indicator" id="chapter-counter">
          {activeChapter}
        </span>
      </div>

      {/* Center 4 Acts Navigation */}
      <nav className="act-nav" aria-label="Act Navigation">
        {acts.map((act, idx) => (
          <React.Fragment key={act.id}>
            <button
              className={`act-nav-item ${activeAct === act.id ? 'active' : ''}`}
              onClick={() => scrollToAct(act.id, act.sceneIndex)}
              data-act={act.id}
              data-scene={act.sceneIndex}
            >
              <span className="act-num">{act.id}</span>
              <span className="act-name">{act.name}</span>
            </button>
            {idx < acts.length - 1 && <span className="act-separator">/</span>}
          </React.Fragment>
        ))}
      </nav>

      <div className="hud-right">
        {/* Leaderboard Link */}
        <button
          id="leaderboard-nav-btn"
          className="hud-btn"
          onClick={() => navigate('/leaderboard')}
          aria-label="View Global Leaderboard"
          title="Global Hall of Fame"
        >
          <span className="btn-indicator" style={{ background: '#ffd700', boxShadow: '0 0 6px rgba(255, 215, 0, 0.6)' }} />
          <span className="btn-label">LEADERBOARD</span>
        </button>

        {/* Play LastZone Direct Action */}
        <button
          id="play-nav-btn"
          className="hud-btn play-nav-btn"
          onClick={() => navigate('/play')}
          aria-label="Launch LastZone Combat Simulation"
          title="Play LastZone Game"
        >
          <span className="btn-indicator" style={{ background: '#d7263d', boxShadow: '0 0 8px rgba(215, 38, 61, 0.8)' }} />
          <span className="btn-label" style={{ color: '#fff', fontWeight: 600 }}>▶ PLAY LASTZONE</span>
        </button>

        {/* Operative Auth Badge / Actions */}
        {isAuthenticated ? (
          <div className="hud-auth-group">
            <span className="hud-operative-badge" title={`Logged in as ${user?.email || user?.username}`}>
              <span className="badge-dot" />
              OP: {user?.displayName || user?.username}
            </span>
            <button
              className="hud-btn hud-logout-btn"
              onClick={logout}
              title="Terminate Tactical Session"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <button
            id="login-nav-btn"
            className="hud-btn auth-nav-btn"
            onClick={() => navigate('/login?redirect=/')}
            aria-label="Operative Login"
            title="Authenticate Callsign"
          >
            <span className="btn-indicator" />
            <span className="btn-label">LOGIN</span>
          </button>
        )}

        <button
          id="macro-toggle-btn"
          className={`hud-btn ${isMacroActive ? 'active' : ''}`}
          onClick={handleMacroToggle}
          aria-label="Toggle Extreme Close-Up Mode"
          title="Toggle Extreme Close-Up on Visor"
        >
          <span className="btn-indicator" />
          <span className="btn-label" id="macro-btn-text">
            {isMacroActive ? '[-] ZOOM OUT' : '⌕ MACRO CLOSE-UP'}
          </span>
        </button>

        <button
          id="sound-toggle-btn"
          className={`hud-btn ${isAudioActive ? 'active' : ''}`}
          onClick={toggleSound}
          aria-label="Toggle Sound"
        >
          <span className="btn-indicator" />
          <span className="btn-label" id="sound-btn-text">
            {isAudioActive ? 'SOUND [ON]' : 'SOUND [OFF]'}
          </span>
        </button>

        <span className="hud-corner-plus">+</span>
      </div>
    </header>
  );
}
