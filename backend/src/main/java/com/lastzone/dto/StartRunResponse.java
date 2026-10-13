package com.lastzone.dto;

import java.time.Instant;

public class StartRunResponse {
    private String runToken;
    private Instant startedAt;

    public StartRunResponse() {}

    public StartRunResponse(String runToken, Instant startedAt) {
        this.runToken = runToken;
        this.startedAt = startedAt;
    }

    public String getRunToken() { return runToken; }
    public void setRunToken(String runToken) { this.runToken = runToken; }

    public Instant getStartedAt() { return startedAt; }
    public void setStartedAt(Instant startedAt) { this.startedAt = startedAt; }
}
