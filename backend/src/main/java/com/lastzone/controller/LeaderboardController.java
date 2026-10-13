package com.lastzone.controller;

import com.lastzone.dto.LeaderboardEntryDto;
import com.lastzone.security.UserPrincipal;
import com.lastzone.service.LeaderboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    public LeaderboardController(LeaderboardService leaderboardService) {
        this.leaderboardService = leaderboardService;
    }

    @GetMapping
    public ResponseEntity<List<LeaderboardEntryDto>> getLeaderboard(
            @RequestParam(defaultValue = "15") int limit,
            @RequestParam(defaultValue = "0") int offset) {
        int boundedLimit = Math.min(Math.max(limit, 1), 100);
        int boundedOffset = Math.max(offset, 0);

        List<LeaderboardEntryDto> entries = leaderboardService.getLeaderboard(boundedLimit, boundedOffset);
        return ResponseEntity.ok(entries);
    }

    @GetMapping("/me")
    public ResponseEntity<LeaderboardEntryDto> getMyPersonalBest(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.ok(null);
        }
        return leaderboardService.getUserPersonalBest(principal.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.noContent().build());
    }
}
