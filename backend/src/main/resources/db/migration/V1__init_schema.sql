-- =============================================================================
-- LASTZONE DATABASE SCHEMA V1
-- Users, Authenticated Sessions, Secure Game Runs & Persistent Leaderboard
-- =============================================================================

CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS game_runs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    run_token VARCHAR(64) NOT NULL UNIQUE,
    score INT NOT NULL DEFAULT 0,
    kills INT NOT NULL DEFAULT 0,
    wave INT NOT NULL DEFAULT 1,
    survival_duration INT NOT NULL DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'STARTED',
    client_metadata VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_game_runs_user_id ON game_runs(user_id);
CREATE INDEX IF NOT EXISTS idx_game_runs_run_token ON game_runs(run_token);
CREATE INDEX IF NOT EXISTS idx_game_runs_leaderboard ON game_runs(status, score DESC, kills DESC, survival_duration DESC, created_at ASC);
