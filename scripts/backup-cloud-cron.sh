#!/usr/bin/env bash
# ==============================================================================
# LastZone Automated Daily Database Backup & Health Monitoring
# Keeps last 7 daily backups, removes stale dumps, sends alert if down
# ==============================================================================
set -euo pipefail

BACKUP_DIR="/opt/lastzone/backups"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/lastzone_pg_${TIMESTAMP}.sql.gz"

echo "[$(date)] Starting LastZone PostgreSQL backup..."
docker exec lastzone-postgres pg_dump -U lastzone_admin -d lastzone | gzip > "$BACKUP_FILE"
echo "[$(date)] Backup completed: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"

# Retain only last 7 backups to prevent disk exhaustion
find "$BACKUP_DIR" -type f -name "lastzone_pg_*.sql.gz" -mtime +7 -delete

# Healthcheck probe
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" http://localhost/api/health || echo "FAILED")
if [ "$HEALTH" != "200" ]; then
    echo "[$(date)] [ALERT] LastZone healthcheck failed with code $HEALTH! Attempting container restart..."
    docker restart lastzone-backend || true
else
    echo "[$(date)] Healthcheck status: OK (200)"
fi
