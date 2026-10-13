package com.lastzone;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lastzone.dto.FinishRunRequest;
import com.lastzone.dto.RegisterRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class GameRunAndLeaderboardIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String getAuthToken(String username, String email) throws Exception {
        RegisterRequest reg = new RegisterRequest(username, email, "password123", "Operative " + username);
        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        return objectMapper.readTree(response).get("token").asText();
    }

    @Test
    @DisplayName("Unauthenticated request to /api/runs/start should be rejected with 401 Unauthorized")
    void testStartRunUnauthenticated() throws Exception {
        mockMvc.perform(post("/api/runs/start"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Authenticated user can start a run, complete it, and view it on the leaderboard")
    void testCompleteRunFlow() throws Exception {
        String token = getAuthToken("player_alpha", "alpha@reach.com");

        // 1. Start run
        String startResponse = mockMvc.perform(post("/api/runs/start")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.runToken", notNullValue()))
                .andReturn().getResponse().getContentAsString();

        String runToken = objectMapper.readTree(startResponse).get("runToken").asText();

        // 2. Finish run
        FinishRunRequest finish = new FinishRunRequest(runToken, 1200, 12, 3, 240);
        mockMvc.perform(post("/api/runs/finish")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(finish)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.score", is(1200)))
                .andExpect(jsonPath("$.kills", is(12)))
                .andExpect(jsonPath("$.wave", is(3)))
                .andExpect(jsonPath("$.survivalDuration", is(240)))
                .andExpect(jsonPath("$.displayName", is("Operative player_alpha")));

        // 3. Verify on public leaderboard
        mockMvc.perform(get("/api/leaderboard?limit=10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(1))))
                .andExpect(jsonPath("$[0].score", notNullValue()));
    }

    @Test
    @DisplayName("Duplicate submission of the same runToken must be rejected with 409 Conflict")
    void testDuplicateRunSubmissionPrevention() throws Exception {
        String token = getAuthToken("player_beta", "beta@reach.com");

        String startResponse = mockMvc.perform(post("/api/runs/start")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String runToken = objectMapper.readTree(startResponse).get("runToken").asText();

        FinishRunRequest finish = new FinishRunRequest(runToken, 800, 8, 2, 160);

        // First submission succeeds
        mockMvc.perform(post("/api/runs/finish")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(finish)))
                .andExpect(status().isOk());

        // Second submission with same runToken fails with 409 Conflict
        mockMvc.perform(post("/api/runs/finish")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(finish)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("User B cannot submit runToken initiated by User A (403 Forbidden)")
    void testCrossUserRunSubmissionForbidden() throws Exception {
        String tokenA = getAuthToken("player_one", "one@reach.com");
        String tokenB = getAuthToken("player_two", "two@reach.com");

        String startResponse = mockMvc.perform(post("/api/runs/start")
                .header("Authorization", "Bearer " + tokenA))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String runTokenA = objectMapper.readTree(startResponse).get("runToken").asText();

        // User B attempts to submit User A's run
        FinishRunRequest finish = new FinishRunRequest(runTokenA, 500, 5, 2, 120);
        mockMvc.perform(post("/api/runs/finish")
                .header("Authorization", "Bearer " + tokenB)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(finish)))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Implausible score (e.g. 500,000 score with 0 kills) must be rejected with 400 Bad Request")
    void testImplausibleScoreRejection() throws Exception {
        String token = getAuthToken("player_gamma", "gamma@reach.com");

        String startResponse = mockMvc.perform(post("/api/runs/start")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String runToken = objectMapper.readTree(startResponse).get("runToken").asText();

        // Implausible: 999999 points with 0 kills and wave 1
        FinishRunRequest finish = new FinishRunRequest(runToken, 999999, 0, 1, 10);
        mockMvc.perform(post("/api/runs/finish")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(finish)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("Leaderboard ranking should be deterministic and ordered by score descending")
    void testLeaderboardDeterministicSorting() throws Exception {
        String tokenHigh = getAuthToken("high_scorer", "high@reach.com");
        String tokenLow = getAuthToken("low_scorer", "low@reach.com");

        // Start & Finish Low
        String startLow = mockMvc.perform(post("/api/runs/start").header("Authorization", "Bearer " + tokenLow))
                .andReturn().getResponse().getContentAsString();
        String tokenL = objectMapper.readTree(startLow).get("runToken").asText();
        mockMvc.perform(post("/api/runs/finish").header("Authorization", "Bearer " + tokenLow)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new FinishRunRequest(tokenL, 300, 3, 1, 90))))
                .andExpect(status().isOk());

        // Start & Finish High
        String startHigh = mockMvc.perform(post("/api/runs/start").header("Authorization", "Bearer " + tokenHigh))
                .andReturn().getResponse().getContentAsString();
        String tokenH = objectMapper.readTree(startHigh).get("runToken").asText();
        mockMvc.perform(post("/api/runs/finish").header("Authorization", "Bearer " + tokenHigh)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(new FinishRunRequest(tokenH, 3500, 35, 5, 450))))
                .andExpect(status().isOk());

        // Verify High Scorer is at the top of leaderboard
        mockMvc.perform(get("/api/leaderboard?limit=2"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].score", greaterThanOrEqualTo(3500)))
                .andExpect(jsonPath("$[0].displayName", is("Operative high_scorer")));
    }
}
