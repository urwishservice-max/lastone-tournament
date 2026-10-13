package com.lastzone.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class FinishRunRequest {

    @NotBlank(message = "Run token is required")
    @Size(max = 64)
    private String runToken;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score cannot be negative")
    private Integer score;

    @NotNull(message = "Kills count is required")
    @Min(value = 0, message = "Kills count cannot be negative")
    private Integer kills;

    @NotNull(message = "Wave reached is required")
    @Min(value = 1, message = "Wave must be at least 1")
    private Integer wave;

    @NotNull(message = "Survival duration is required")
    @Min(value = 0, message = "Survival duration cannot be negative")
    private Integer survivalDuration; // seconds

    @Size(max = 500)
    private String clientMetadata;

    public FinishRunRequest() {}

    public FinishRunRequest(String runToken, Integer score, Integer kills, Integer wave, Integer survivalDuration) {
        this.runToken = runToken;
        this.score = score;
        this.kills = kills;
        this.wave = wave;
        this.survivalDuration = survivalDuration;
    }

    public String getRunToken() { return runToken; }
    public void setRunToken(String runToken) { this.runToken = runToken; }

    public Integer getScore() { return score; }
    public void setScore(Integer score) { this.score = score; }

    public Integer getKills() { return kills; }
    public void setKills(Integer kills) { this.kills = kills; }

    public Integer getWave() { return wave; }
    public void setWave(Integer wave) { this.wave = wave; }

    public Integer getSurvivalDuration() { return survivalDuration; }
    public void setSurvivalDuration(Integer survivalDuration) { this.survivalDuration = survivalDuration; }

    public String getClientMetadata() { return clientMetadata; }
    public void setClientMetadata(String clientMetadata) { this.clientMetadata = clientMetadata; }
}
