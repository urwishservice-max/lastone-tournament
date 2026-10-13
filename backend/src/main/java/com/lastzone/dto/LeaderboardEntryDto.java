package com.lastzone.dto;

import com.lastzone.entity.GameRun;
import java.time.Instant;

public class LeaderboardEntryDto {
    private long rank;
    private Long runId;
    private Long userId;
    private String username;
    private String displayName;
    private int score;
    private int kills;
    private int wave;
    private int survivalDuration; // seconds
    private Instant playedAt;

    public LeaderboardEntryDto() {}

    public LeaderboardEntryDto(long rank, GameRun run) {
        this.rank = rank;
        this.runId = run.getId();
        this.userId = run.getUser().getId();
        this.username = run.getUser().getUsername();
        this.displayName = run.getUser().getDisplayName();
        this.score = run.getScore();
        this.kills = run.getKills();
        this.wave = run.getWave();
        this.survivalDuration = run.getSurvivalDuration();
        this.playedAt = run.getCompletedAt() != null ? run.getCompletedAt() : run.getCreatedAt();
    }

    public long getRank() { return rank; }
    public void setRank(long rank) { this.rank = rank; }

    public Long getRunId() { return runId; }
    public void setRunId(Long runId) { this.runId = runId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public int getKills() { return kills; }
    public void setKills(int kills) { this.kills = kills; }

    public int getWave() { return wave; }
    public void setWave(int wave) { this.wave = wave; }

    public int getSurvivalDuration() { return survivalDuration; }
    public void setSurvivalDuration(int survivalDuration) { this.survivalDuration = survivalDuration; }

    public Instant getPlayedAt() { return playedAt; }
    public void setPlayedAt(Instant playedAt) { this.playedAt = playedAt; }
}
