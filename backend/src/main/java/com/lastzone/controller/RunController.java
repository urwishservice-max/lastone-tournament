package com.lastzone.controller;

import com.lastzone.dto.FinishRunRequest;
import com.lastzone.dto.LeaderboardEntryDto;
import com.lastzone.dto.StartRunResponse;
import com.lastzone.security.UserPrincipal;
import com.lastzone.service.RunService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/runs")
public class RunController {

    private final RunService runService;

    public RunController(RunService runService) {
        this.runService = runService;
    }

    @PostMapping("/start")
    public ResponseEntity<StartRunResponse> startRun(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only authenticated users can initiate a ranked run");
        }
        StartRunResponse response = runService.startRun(principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/finish")
    public ResponseEntity<LeaderboardEntryDto> finishRun(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody FinishRunRequest request) {
        if (principal == null) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Only authenticated users can submit a ranked run");
        }
        LeaderboardEntryDto result = runService.finishRun(principal, request);
        return ResponseEntity.ok(result);
    }
}
