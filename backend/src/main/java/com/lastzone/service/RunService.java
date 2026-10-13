package com.lastzone.service;

import com.lastzone.dto.FinishRunRequest;
import com.lastzone.dto.LeaderboardEntryDto;
import com.lastzone.dto.StartRunResponse;
import com.lastzone.entity.GameRun;
import com.lastzone.entity.User;
import com.lastzone.repository.GameRunRepository;
import com.lastzone.repository.UserRepository;
import com.lastzone.security.UserPrincipal;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.UUID;

@Service
public class RunService {

    private final GameRunRepository gameRunRepository;
    private final UserRepository userRepository;

    public RunService(GameRunRepository gameRunRepository, UserRepository userRepository) {
        this.gameRunRepository = gameRunRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public StartRunResponse startRun(UserPrincipal principal) {
        User user = userRepository.findById(principal.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        String runToken = UUID.randomUUID().toString().replace("-", "");
        GameRun run = new GameRun(user, runToken);
        gameRunRepository.save(run);

        return new StartRunResponse(runToken, run.getCreatedAt());
    }

    @Transactional
    public LeaderboardEntryDto finishRun(UserPrincipal principal, FinishRunRequest request) {
        GameRun run = gameRunRepository.findByRunToken(request.getRunToken())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Game run not found for token: " + request.getRunToken()));

        // Security Validation 1: Verify authenticated user matches run owner (never trust client-supplied ID)
        if (!run.getUser().getId().equals(principal.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Unauthorized run submission");
        }

        // Security Validation 2: Prevent duplicate submission of the same run token
        if (!"STARTED".equals(run.getStatus())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Run has already been completed or invalidated");
        }

        // Security Validation 3: Plausibility check (LastZone: 100 pts / zombie defeat + wave progression)
        // Score cannot be completely out of bounds for the reported kills & waves
        int maxPlausibleScore = (request.getKills() * 150) + (request.getWave() * 2000) + 5000;
        if (request.getScore() > maxPlausibleScore && request.getScore() > 500) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Implausible game score reported for given kills and wave count");
        }

        // Record completed run
        run.setScore(request.getScore());
        run.setKills(request.getKills());
        run.setWave(request.getWave());
        run.setSurvivalDuration(request.getSurvivalDuration());
        run.setClientMetadata(request.getClientMetadata());
        run.setStatus("COMPLETED");
        run.setCompletedAt(Instant.now());

        GameRun saved = gameRunRepository.save(run);

        long rank = gameRunRepository.calculateRank(saved.getScore(), saved.getKills(), saved.getSurvivalDuration());
        return new LeaderboardEntryDto(rank, saved);
    }
}
