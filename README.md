# LASTZONE: TOURNAMENT PLATFORM (VANGUARD SECTOR 07)

> **Repository**: [https://github.com/urwishservice-max/lastone-tournament](https://github.com/urwishservice-max/lastone-tournament)  
> **Architecture**: React + Vite 3D Cinematic Frontend + Unity 6.6 WebGL Zombie Survival Game + Java 21 Spring Boot 3.3.5 Backend + Persistent PostgreSQL/H2 Leaderboard + Multi-stage Docker + Jenkins CI + Ansible Automation + Ngrok HTTPS Public Tunnel.

---

## 🌐 Live Public Access

- **Public HTTPS Tunnel**: [https://apple-halt-hunchback.ngrok-free.dev](https://apple-halt-hunchback.ngrok-free.dev)
- **Local Dev Frontend**: [http://localhost:5173](http://localhost:5173)
- **Local Backend API**: [http://localhost:8081](http://localhost:8081)
- **Jenkins CI Dashboard**: [http://localhost:8080](http://localhost:8080)

---

## 🎮 System Architecture

```
                  +----------------------------------------------------+
                  |               NGINX / VITE FRONTEND               |
                  |  - / : Spartan 3D Scrollytelling (Three.js + GSAP)|
                  |  - /play : Unity 6.6 WebGL Combat Sector          |
                  |  - /leaderboard : Global Hall of Fame             |
                  |  - /login, /register : Operative Auth             |
                  +-------------------------+--------------------------+
                                            |
                                Reverse Proxy /api/*
                                            |
                                            v
                  +----------------------------------------------------+
                  |         SPRING BOOT 3.3.5 BACKEND (Java 21)        |
                  |  - Spring Security + Stateless JWT                |
                  |  - Flyway Migrations (V1 Schema: users, runs)     |
                  |  - Run Session Validation (Token Plausibility)    |
                  |  - Deterministic Ranking Calculation Engine       |
                  |  - WebGL Interop Bridge (C# -> JS -> Backend)     |
                  +-------------------------+--------------------------+
                                            |
                                            v
                  +----------------------------------------------------+
                  |               PERSISTENT DATABASE                  |
                  |  - Production: PostgreSQL 16 (Docker Volume)       |
                  |  - Local Dev: Persistent File H2 (Postgres Mode)   |
                  +----------------------------------------------------+
```

---

## 🕹️ Unity WebGL Score Flow & Bridge

1. **Unity C#**:
   - `LastZoneEnemyHealth.cs` increments score (+100 pts) and kills count on zombie defeat.
   - `LastZoneGameManager.cs` captures final score, kills, wave, and duration in `OnPlayerDied()` before resetting state.
   - Calls native WebGL interop: `[DllImport("__Internal")] private static extern void OnLastZoneGameOverJS(int score, int kills, int wave, int duration)`.
2. **JavaScript Bridge**:
   - `Assets/Plugins/WebGL/LastZoneBridge.jslib` exposes `window.onLastZoneGameOver(score, kills, wave, duration)`.
   - `PlayPage.jsx` listens for this event with stale-closure guards (`useRef` for auth token and active run token).
3. **Backend Run Telemetry**:
   - `POST /api/runs/start` initializes an authenticated run token.
   - `POST /api/runs/finish` validates the token, score plausibility, and commits the run.
   - Conflict detection (`409 Conflict`) prevents duplicate submission of the same run token.
4. **Leaderboard**:
   - `GET /api/leaderboard` retrieves ranked operatives.
   - `GET /api/leaderboard/me` retrieves the current player's personal best (returns `200` or `204 No Content`).

---

## 🚀 Quick Start Guide (Windows)

### 1. Prerequisites
- **Git** (v2.50+) with **Git LFS**
- **Node.js** (v20+) & **npm**
- **Java JDK 21**
- **Docker Desktop** (optional for local container testing)
- **ngrok** (for public HTTPS tunneling)

### 2. How to Start After Restarting Windows
Run the automated launch script:
```powershell
powershell -File scripts\start-all.ps1
```
Or start manually:
```powershell
# Terminal 1 - Backend (port 8081)
cd backend
java -Dspring.profiles.active=local -Dserver.port=8081 -jar target\lastzone-backend-1.0.0.jar

# Terminal 2 - Frontend (port 5173)
npm run dev

# Terminal 3 - Public Tunnel
ngrok http 5173
```

### 3. How to Stop Without Deleting Data
Run the safe shutdown script:
```powershell
powershell -File scripts\stop-all.ps1
```
*Note: Your database data in `backend/data/lastzonedb.mv.db` is completely preserved.*

### 4. How to Check System Health
```powershell
powershell -File scripts\health-check.ps1
```

### 5. How to Run Tests
```powershell
powershell -File scripts\test-all.ps1
```

---

## 🐳 Docker Containerization

Run the full production stack (PostgreSQL + Spring Boot + Nginx with React & Unity WebGL):
```bash
docker compose up -d --build
```

- **Frontend & WebGL**: `http://localhost:80`
- **Backend API**: `http://localhost:80/api/health`
- **PostgreSQL**: `localhost:5432` (named volume: `lastzone_postgres_data`)

---

## 🔄 Jenkins CI/CD Pipeline

The `Jenkinsfile` defines a cross-platform (Windows/Linux) quality-gated continuous integration pipeline:
1. **Checkout**: Pulls the target branch.
2. **Backend Unit & Integration Tests**: Runs `mvn test` (JUnit 5 + MockMvc).
3. **Backend Artifact Package**: Packages `lastzone-backend-1.0.0.jar`.
4. **Frontend Build & Asset Audit**: Runs `npm ci && npm run build`.
5. **Build Docker Images**: Builds multi-stage production images.
6. **Validate Deployment Config**: Runs `docker compose config`.
7. **Deploy Containers**: Launches containers with persistent named volumes.
8. **Health & Sanity Verification**: Polls `/api/health` until healthy.

---

## 🤖 Ansible Automation

Located in `ansible/`:
- `inventory.ini`: Target server configuration.
- `deploy.yml`: Automated provisioning playbook that:
  - Installs Docker and prerequisite packages.
  - Synchronizes project files excluding build caches.
  - Executes `docker compose up -d --build`.
  - Verifies `/api/health` before completing.

---

## 🔐 Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `local` (dev) / `prod` (docker) | Profile selection |
| `SERVER_PORT` | `8081` (local) / `8080` (docker) | Backend port |
| `DB_URL` | `jdbc:postgresql://postgres:5432/lastzone` | Production DB connection |
| `POSTGRES_DB` | `lastzone` | Database name |
| `POSTGRES_USER` | `lastzone_admin` | Database username |
| `POSTGRES_PASSWORD` | `secure_vanguard_secret_117` | Database password |
| `JWT_SECRET` | `super_secret_vanguard_jwt_signing_key_sector07...` | JWT signature key |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Session duration |

---

## 📋 Operational Status & Verification

| Component | Status | Verification Method |
|---|---|---|
| Registration & Login | ✅ Verified | API + Browser login (`SpartanHunter88`) |
| Unity WebGL Game | ✅ Verified | Canvas loads, shaders compiled, WebGL bridge active |
| Game Score Flow | ✅ Verified | `OnLastZoneGameOverJS` -> `/api/runs/finish` -> Leaderboard |
| Database Persistence | ✅ Verified | File-based H2/PostgreSQL surviving backend restart |
| Duplicate Run Protection | ✅ Verified | Replayed run returns `409 Conflict` |
| Backend Test Suite | ✅ 11/11 Passed | Maven Surefire JUnit 5 Integration Tests |
| Frontend Build | ✅ Built in 7.23s | Vite production bundle |
| Public HTTPS Tunnel | ✅ Live | Active on Ngrok |
| Git LFS | ✅ Configured | Tracking `*.data` for Unity WebGL binaries |
