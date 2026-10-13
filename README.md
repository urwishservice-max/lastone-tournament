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

## 🔑 Jenkins Access Recovery Procedure

If Jenkins administrator credentials are misplaced, recover access safely without exposing credentials or losing job configurations:

1. **Service Details**:
   - **Service Name**: `Jenkins`
   - **Installation Directory**: `C:\Program Files\Jenkins`
   - **Home Directory (`JENKINS_HOME`)**: `C:\ProgramData\Jenkins\.jenkins`
   - **Administrator User**: `jaidev` (`dharanidharanjaidev@gmail.com`)
   - **Local URL**: [http://localhost:8080](http://localhost:8080)

2. **Safe Recovery Steps (Run in Administrator PowerShell)**:
   ```powershell
   # 1. Stop Jenkins service safely
   Stop-Service jenkins

   # 2. Back up config.xml before making changes
   Copy-Item "C:\ProgramData\Jenkins\.jenkins\config.xml" "C:\ProgramData\Jenkins\.jenkins\config.xml.bak"

   # 3. Temporarily disable security locally
   (Get-Content "C:\ProgramData\Jenkins\.jenkins\config.xml") -replace '<useSecurity>true</useSecurity>', '<useSecurity>false</useSecurity>' | Set-Content "C:\ProgramData\Jenkins\.jenkins\config.xml"

   # 4. Restart Jenkins
   Start-Service jenkins
   ```

3. **Re-enabling Security (Critical)**:
   - Navigate to [http://localhost:8080](http://localhost:8080).
   - Go to **Manage Jenkins** -> **Security**.
   - Set **Security Realm** to *Jenkins' own user database*.
   - Under **Authorization**, choose *Logged-in users can do anything* or *Matrix-based security*.
   - Reset the password for user `jaidev` in **Manage Users**.
   - Click **Save**. Authentication is immediately active again.

---

## 🔄 Jenkins CI/CD Pipeline & Credentials

The `Jenkinsfile` defines a cross-platform (Windows/Linux) quality-gated continuous integration pipeline:
- **Repository**: `https://github.com/urwishservice-max/lastone-tournament.git`
- **Branch**: `*/main`
- **Triggers**: SCM Polling (`H/5 * * * *`) and GitHub Webhook (`githubPush()`).
- **Secrets Management**: Safely binds credentials using Jenkins Credentials Store (`lastzone-postgres-password`, `lastzone-jwt-secret`) with graceful local environment fallbacks. Secrets are never printed in console logs.

### Pipeline Stages:
1. **Initialize Environment & Credentials**: Injects secure tokens from Jenkins Credentials store without logging sensitive values.
2. **Checkout**: Pulls latest commit from `main`.
3. **Backend Unit & Integration Tests**: Runs `mvnw clean test` (JUnit 5 + Spring Boot MockMvc, 11/11 tests).
4. **Backend Artifact Package**: Builds `lastzone-backend-1.0.0.jar`.
5. **Frontend Build & Asset Audit**: Compiles Vite bundle and verifies Unity WebGL assets in `dist/`.
6. **Validate Deployment Configuration**: Executes `docker compose config` schema validation.
7. **Build Docker Images**: Builds multi-stage production images conditionally when Docker daemon is detected.
8. **Deploy Containers**: Launches production containers with persistent volumes (controlled by `DEPLOY_FLEET` parameter).
9. **Health & Sanity Verification**: Validates `/api/health` returns `{"status":"UP"}`.

---

## 💾 Database Backup & Disaster Recovery

- **Active File Database**: `backend/data/lastzonedb.mv.db`
- **Backup Directory**: `backend/data/backups/`
- **Current Verified Backup**: `backend/data/backups/lastzonedb_backup_20261014.mv.db` (36,864 bytes)
- **Run Verification Script**:
  ```powershell
  powershell -ExecutionPolicy Bypass -File scripts\verify-api-e2e.ps1
  ```

---

## ☁️ Permanent Public Deployment Options (Free-Tier Comparison)

| Provider / Tier | Compute / RAM | Database Persistence | Unity WebGL Assets (~400MB) | Verdict & Notes |
|---|---|---|---|---|
| **Vercel / Cloudflare Pages + Neon PostgreSQL + Render (Recommended)** | **Unlimited CDN** (Frontend), 512MB RAM (API) | **Permanent Free Tier** (Neon 0.5GB Postgres, no expiration) | **Supported** via Cloudflare Pages or Git LFS release | **Best Free Tier Hybrid**: Decouples heavy 400MB WebGL assets onto global CDN while Spring Boot runs API on Render/Koyeb and Neon persists data. |
| **Render.com (Full Stack)** | 512 MB RAM, 0.1 CPU (Sleeps after 15m) | Free PostgreSQL **expires after 30 days** | Static site upload limit is 100MB (blocks 400MB WebGL `.data`) | **Not Recommended for DB**: Requires recreating DB every 30 days; 512MB RAM can trigger JVM OOM without heap flags. |
| **Railway.app** | 512 MB RAM | Persistent volume supported | Supported | Requires credit card after $5 one-time trial credit. |
| **Fly.io** | 256 MB shared CPU | Persistent volume supported | Requires container bundle | 256MB RAM is insufficient for Java 21 Spring Boot baseline. |
| **Oracle Cloud Always Free (Best Self-Hosted)** | **4 OCPU, 24 GB RAM**, 200 GB NVMe | **Permanent** 200 GB persistent storage | **Full Docker Compose Support** with zero sleep | **Best Autonomous Production**: Runs exact `docker-compose.yml` 24/7 without cold starts or resource limits. |

---

## 🔐 Environment Variables

| Variable | Default | Purpose |
|---|---|---|
| `SPRING_PROFILES_ACTIVE` | `local` (dev) / `prod` (docker) | Profile selection |
| `SERVER_PORT` | `8081` (local) / `8080` (docker) | Backend port |
| `DB_URL` | `jdbc:postgresql://postgres:5432/lastzone` | Production DB connection |
| `POSTGRES_DB` | `lastzone` | Database name |
| `POSTGRES_USER` | `lastzone_admin` | Database username |
| `POSTGRES_PASSWORD` | Stored in Secret Manager / `.env` | Database password |
| `JWT_SECRET` | Stored in Secret Manager / `.env` | JWT signature key (minimum 256 bits) |
| `JWT_EXPIRATION_MS` | `86400000` (24h) | Session duration |

---

## 📋 Operational Status & Verification Matrix

| Component / Requirement | Status | Verification Detail / Actual Result |
|---|---|---|
| **Git Repository & Remote** | **PASS** | `https://github.com/urwishservice-max/lastone-tournament.git` on `main`, synchronized at `0709cc4`. |
| **Git LFS Assets** | **PASS** | Unity WebGL `.data` (396 MB) tracked via `.gitattributes` and uploaded cleanly. |
| **Registration & Login** | **PASS** | Tested via `verify-api-e2e.ps1`; HTTP 201 Created and JWT issued. |
| **Unity WebGL Game** | **PASS** | WebGL player built with Unity 6000.6.4f1, bridge `onLastZoneGameOver` active. |
| **Game Score Flow & Run Validation** | **PASS** | `/api/runs/start` -> `/api/runs/finish` submitted score 1750, kills 15, duration 115s. |
| **Duplicate Run Protection** | **PASS** | Duplicate submission of same run token strictly rejected with `HTTP 409 Conflict`. |
| **Leaderboard Retrieval & Persistence** | **PASS** | Dynamic leaderboard ranked user at Rank 3; all 5 initial records preserved. |
| **Database Backup** | **PASS** | Verified backup at `backend/data/backups/lastzonedb_backup_20261014.mv.db` (36,864 bytes). |
| **Backend Integration Tests** | **PASS** | 11 of 11 tests passed in 31.28s (`mvnw.cmd clean test`). |
| **Frontend Production Build** | **PASS** | Vite built production bundle in 15.93s (`dist/`). |
| **Docker Compose Config Validation** | **PASS** | `docker compose config` passed schema and syntax checks (Exit Code 0). |
| **Docker Host Daemon Service** | **BLOCKED** | Docker Desktop engine requires Windows Administrator UAC elevation to start. |
| **Jenkins Service & Access** | **PASS / READY**| Service running on port 8080 (PID 6488). Admin user: `jaidev`. Safe recovery documented. |
| **Jenkins Pipeline Job** | **PASS** | Configured in `C:\ProgramData\Jenkins\.jenkins\jobs\LastZone-Tournament\config.xml`. |
| **HTTPS Public Access** | **PASS (Temporary)**| Live on `https://apple-halt-hunchback.ngrok-free.dev`. Permanent cloud options evaluated. |
