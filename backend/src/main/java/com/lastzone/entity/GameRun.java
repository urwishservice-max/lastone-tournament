package com.lastzone.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "game_runs")
public class GameRun {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "run_token", nullable = false, unique = true, length = 64)
    private String runToken;

    @Column(nullable = false)
    private int score = 0;

    @Column(nullable = false)
    private int kills = 0;

    @Column(nullable = false)
    private int wave = 1;

    @Column(name = "survival_duration", nullable = false)
    private int survivalDuration = 0; // seconds

    @Column(nullable = false, length = 30)
    private String status = "STARTED"; // STARTED, COMPLETED, ABANDONED

    @Column(name = "client_metadata", length = 500)
    private String clientMetadata;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "completed_at")
    private Instant completedAt;

    public GameRun() {}

    public GameRun(User user, String runToken) {
        this.user = user;
        this.runToken = runToken;
        this.status = "STARTED";
        this.createdAt = Instant.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getRunToken() { return runToken; }
    public void setRunToken(String runToken) { this.runToken = runToken; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getKills() { return kills; }
    public void setKills(int kills) { this.kills = kills; }

    public int getWave() { return wave; }
    public void setWave(int wave) { this.wave = wave; }

    public int getSurvivalDuration() { return survivalDuration; }
    public void setSurvivalDuration(int survivalDuration) { this.survivalDuration = survivalDuration; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getClientMetadata() { return clientMetadata; }
    public void setClientMetadata(String clientMetadata) { this.clientMetadata = clientMetadata; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    public Instant getCompletedAt() { return completedAt; }
    public void setCompletedAt(Instant completedAt) { this.completedAt = completedAt; }
}
