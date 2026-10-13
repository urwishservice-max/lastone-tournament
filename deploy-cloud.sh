#!/usr/bin/env bash
# ==============================================================================
# LastZone Cloud Production Deployment Script (Ubuntu / Oracle Linux / Debian)
# Architecture: ARM64 (Ampere A1) or AMD64 (x86_64)
# Budget: strictly $0.00 / ₹0
# ==============================================================================
set -euo pipefail

echo "=== [1/6] System Architecture & Resource Audit ==="
ARCH=$(uname -m)
echo "Detected architecture: $ARCH"
echo "Available memory: $(free -h | awk '/^Mem:/ {print $2}')"
echo "Available disk: $(df -h / | awk 'NR==2 {print $4}')"

# Ensure Git, Curl, and Docker are installed
if ! command -v docker &> /dev/null; then
    echo "=== [2/6] Installing Docker Engine & Docker Compose Plugin ==="
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg lsb-release git git-lfs
    sudo mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg --yes
    echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
    sudo systemctl enable docker
    sudo systemctl start docker
    sudo usermod -aG docker "$USER" || true
else
    echo "Docker is already installed: $(docker --version)"
fi

echo "=== [3/6] Configuring OS Firewall ==="
# Open ports 80 (HTTP) and 443 (HTTPS) on iptables / ufw
if command -v ufw &> /dev/null; then
    sudo ufw allow 80/tcp || true
    sudo ufw allow 443/tcp || true
    sudo ufw allow 22/tcp || true
elif command -v firewall-cmd &> /dev/null; then
    sudo firewall-cmd --permanent --add-service=http || true
    sudo firewall-cmd --permanent --add-service=https || true
    sudo firewall-cmd --reload || true
fi
# Oracle Linux iptables rules fix if applicable
if sudo iptables -L INPUT -n --line-numbers 2>/dev/null | grep -q "REJECT"; then
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT || true
    sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT || true
    sudo netfilter-persistent save || true
fi

echo "=== [4/6] Building & Launching Container Fleet ==="
docker compose -f docker-compose.prod.yml down --remove-orphans || true
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

echo "=== [5/6] Awaiting Health Check Verification ==="
echo "Waiting for services to become healthy..."
TIMEOUT=90
ELAPSED=0
until [ "$(docker inspect -f '{{.State.Health.Status}}' lastzone-backend 2>/dev/null)" = "healthy" ]; do
    sleep 3
    ELAPSED=$((ELAPSED + 3))
    if [ "$ELAPSED" -ge "$TIMEOUT" ]; then
        echo "[ERROR] Backend failed to become healthy within ${TIMEOUT}s!"
        docker logs lastzone-backend --tail 50
        exit 1
    fi
    echo "Waiting for backend healthy state... (${ELAPSED}s)"
done

echo "=== [6/6] Restoring Historical Database Seed (If Fresh Volume) ==="
USER_COUNT=$(docker exec lastzone-postgres psql -U lastzone_admin -d lastzone -t -c "SELECT count(*) FROM users;" | xargs)
if [ "$USER_COUNT" -le "1" ]; then
    echo "Database appears unseeded (users: $USER_COUNT). Restoring historical player data..."
    LATEST_BACKUP=$(ls -t backend/data/backups/lastzone_postgres_backup_*.sql 2>/dev/null | head -n 1)
    if [ -n "$LATEST_BACKUP" ] && [ -f "$LATEST_BACKUP" ]; then
        echo "Applying backup: $LATEST_BACKUP"
        docker exec -i lastzone-postgres psql -U lastzone_admin -d lastzone < "$LATEST_BACKUP"
        echo "[SUCCESS] Historical player data restored!"
    else
        echo "[WARN] No backup file found to restore."
    fi
else
    echo "Database already contains $USER_COUNT users. Skipping restore to protect existing data."
fi

echo "=== DEPLOYMENT COMPLETE & VERIFIED ==="
docker compose -f docker-compose.prod.yml ps
curl -s http://localhost/api/health
echo ""
