package com.lastzone.service;

import com.lastzone.dto.LeaderboardEntryDto;
import com.lastzone.entity.GameRun;
import com.lastzone.repository.GameRunRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class LeaderboardService {

    private final GameRunRepository gameRunRepository;

    public LeaderboardService(GameRunRepository gameRunRepository) {
        this.gameRunRepository = gameRunRepository;
    }

    @Transactional(readOnly = true)
    public List<LeaderboardEntryDto> getLeaderboard(int limit, int offset) {
        int pageIndex = offset / Math.max(1, limit);
        Pageable pageable = PageRequest.of(pageIndex, limit);

        List<GameRun> runs = gameRunRepository.findLeaderboardRuns(pageable);
        List<LeaderboardEntryDto> dtos = new ArrayList<>();

        long currentRank = offset + 1;
        for (GameRun run : runs) {
            dtos.add(new LeaderboardEntryDto(currentRank++, run));
        }

        return dtos;
    }

    @Transactional(readOnly = true)
    public Optional<LeaderboardEntryDto> getUserPersonalBest(Long userId) {
        return gameRunRepository.findFirstByUserIdAndStatusOrderByScoreDescKillsDescSurvivalDurationDescCreatedAtAsc(userId, "COMPLETED")
                .map(run -> {
                    long rank = gameRunRepository.calculateRank(run.getScore(), run.getKills(), run.getSurvivalDuration());
                    return new LeaderboardEntryDto(rank, run);
                });
    }
}
