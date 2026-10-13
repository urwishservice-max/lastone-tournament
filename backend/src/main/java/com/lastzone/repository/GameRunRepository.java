package com.lastzone.repository;

import com.lastzone.entity.GameRun;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GameRunRepository extends JpaRepository<GameRun, Long> {

    Optional<GameRun> findByRunToken(String runToken);

    @Query("SELECT r FROM GameRun r JOIN FETCH r.user u WHERE r.status = 'COMPLETED' " +
           "ORDER BY r.score DESC, r.kills DESC, r.survivalDuration DESC, r.createdAt ASC")
    List<GameRun> findLeaderboardRuns(Pageable pageable);

    @Query("SELECT r FROM GameRun r JOIN FETCH r.user u WHERE r.user.id = :userId AND r.status = 'COMPLETED' " +
           "ORDER BY r.score DESC, r.kills DESC, r.survivalDuration DESC, r.createdAt ASC")
    List<GameRun> findUserRuns(@Param("userId") Long userId, Pageable pageable);

    Optional<GameRun> findFirstByUserIdAndStatusOrderByScoreDescKillsDescSurvivalDurationDescCreatedAtAsc(
            Long userId, String status);

    @Query("SELECT COUNT(r) + 1 FROM GameRun r WHERE r.status = 'COMPLETED' AND (" +
           "r.score > :score OR " +
           "(r.score = :score AND r.kills > :kills) OR " +
           "(r.score = :score AND r.kills = :kills AND r.survivalDuration > :duration))")
    long calculateRank(@Param("score") int score, @Param("kills") int kills, @Param("duration") int duration);
}
