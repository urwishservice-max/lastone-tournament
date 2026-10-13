package com.lastzone;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lastzone.dto.LoginRequest;
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
public class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("Should register a new user successfully and return JWT token")
    void testRegisterSuccess() throws Exception {
        RegisterRequest request = new RegisterRequest("spartan_hero", "hero@reach.com", "vanguard123", "Vanguard Hero");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.username", is("spartan_hero")))
                .andExpect(jsonPath("$.user.displayName", is("Vanguard Hero")));
    }

    @Test
    @DisplayName("Should reject duplicate username registration with 409 Conflict")
    void testRegisterDuplicateUsername() throws Exception {
        RegisterRequest request1 = new RegisterRequest("duplicate_user", "dup1@reach.com", "secret123", "Operative 1");
        RegisterRequest request2 = new RegisterRequest("duplicate_user", "dup2@reach.com", "secret123", "Operative 2");

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request1)))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request2)))
                .andExpect(status().isConflict());
    }

    @Test
    @DisplayName("Should login successfully with valid credentials")
    void testLoginSuccess() throws Exception {
        RegisterRequest reg = new RegisterRequest("tactical_login", "login@reach.com", "mypassword1", "Tactical Operative");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest("tactical_login", "mypassword1");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.username", is("tactical_login")));
    }

    @Test
    @DisplayName("Should reject login with invalid password")
    void testLoginInvalidPassword() throws Exception {
        RegisterRequest reg = new RegisterRequest("secure_user", "secure@reach.com", "correct_pass", "Secure Operative");
        mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated());

        LoginRequest login = new LoginRequest("secure_user", "wrong_pass");
        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Should access /api/auth/me with valid Bearer token")
    void testGetMeWithToken() throws Exception {
        RegisterRequest reg = new RegisterRequest("me_user", "me@reach.com", "password123", "Me Operative");
        String response = mockMvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reg)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        String token = objectMapper.readTree(response).get("token").asText();

        mockMvc.perform(get("/api/auth/me")
                .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("me_user")))
                .andExpect(jsonPath("$.displayName", is("Me Operative")));
    }
}
