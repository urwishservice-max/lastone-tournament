-- Synchronize historical H2 user accounts and game runs into PostgreSQL
-- Preserves existing DevOps test records by remapping ID 1 -> 1000

BEGIN;

-- Temporarily drop FK to allow atomic remapping of devops test user
ALTER TABLE game_runs DROP CONSTRAINT game_runs_user_id_fkey;

-- Remap Jenkins Build #3 test user from 1 to 1000
UPDATE users SET id = 1000 WHERE id = 1;
UPDATE game_runs SET id = 1000, user_id = 1000 WHERE id = 1;

-- Restore FK constraint
ALTER TABLE game_runs ADD CONSTRAINT game_runs_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Insert historical H2 users
INSERT INTO users (id, created_at, display_name, email, password_hash, role, updated_at, username) VALUES
(1, '2026-10-13 18:45:10.23716+00', 'Master Chief', 'chief@unsc.org', '$2a$10$bsLDjk2FXtImX5gjMKfRMO3wFwd1WW2ebKtCDQLjmFWGh11Dt8tau', 'ROLE_USER', '2026-10-13 18:45:10.23716+00', 'Chief117'),
(2, '2026-10-13 18:50:26.387393+00', 'jaidev', 'jaidev@gmail.com', '$2a$10$jmx5gPSVp6nAKQamUgjJQuwCQstNfdcfHnFDI89rN24gdT2I5Yds2', 'ROLE_USER', '2026-10-13 18:50:26.387393+00', 'jaidev12'),
(33, '2026-10-13 19:05:37.523226+00', 'Spartan Test', 'spartan@test.com', '$2a$10$FpKt/08H1U5YGEM6PxllP.ZChDbMRR0H2k9A.s5.2UhvMCiSU5ZA6', 'ROLE_USER', '2026-10-13 19:05:37.523226+00', 'SpartanTest'),
(34, '2026-10-13 19:09:09.578596+00', 'Operative One', 'operative1@reach.unsc.org', '$2a$10$4VkVeFRO77VMvJmvzW/SX.OGTQPFACVTYI.BioU.A6ZysLC5/.7OO', 'ROLE_USER', '2026-10-13 19:09:09.578596+00', 'SpartanOperative1'),
(65, '2026-10-13 19:35:06.34072+00', 'Vanguard Ninety-Nine', 'operative99@reach.unsc.org', '$2a$10$3Yl0aT.rSoYQ7Ou2JCj69uU.ozc63Bys922rVB6LZhv.E1sjW55UW', 'ROLE_USER', '2026-10-13 19:35:06.34072+00', 'SpartanOperative99'),
(97, '2026-10-13 20:09:45.580785+00', 'Master Hunter 88', 'hunter88@reach.mil', '$2a$10$BfLXwVTtkjfggP5/oTI/ROC6ZoUb4.SruSaG2uwJVHFxbav3MsNvq', 'ROLE_USER', '2026-10-13 20:09:45.580785+00', 'SpartanHunter88');

-- Insert historical H2 game runs
INSERT INTO game_runs (id, client_metadata, completed_at, created_at, kills, run_token, score, status, survival_duration, wave, user_id) VALUES
(1, 'Vite Proxy E2E Test', '2026-10-13 18:45:10.848904+00', '2026-10-13 18:45:10.79904+00', 84, 'e267a71ec67648b1bebb344f8d371134', 15800, 'COMPLETED', 345, 7, 1),
(2, NULL, NULL, '2026-10-13 18:50:42.174208+00', 0, '235343a5c9bf417d9ce54ef90a041966', 0, 'STARTED', 0, 1, 2),
(3, NULL, NULL, '2026-10-13 18:50:42.17823+00', 0, '80a2c1a195a34d438decc148a1d9b512', 0, 'STARTED', 0, 1, 2),
(4, NULL, NULL, '2026-10-13 18:50:52.09083+00', 0, 'ba50fc66be1a4f6599c5569cd0c06426', 0, 'STARTED', 0, 1, 2),
(5, NULL, NULL, '2026-10-13 18:51:37.003709+00', 0, '9829050f073a4678b6041d4bbd643953', 0, 'STARTED', 0, 1, 2),
(6, NULL, NULL, '2026-10-13 18:51:37.003709+00', 0, 'dccbf3fa4d48459fafe723c75a53ca55', 0, 'STARTED', 0, 1, 2),
(33, NULL, NULL, '2026-10-13 19:09:17.88806+00', 0, '463131d12c4b41e1a22f9dadaf986f2f', 0, 'STARTED', 0, 1, 34),
(34, NULL, NULL, '2026-10-13 19:09:17.886043+00', 0, '61331fe869d34e7e9b8f9a6d5ee95b77', 0, 'STARTED', 0, 1, 34),
(35, NULL, NULL, '2026-10-13 19:11:47.99801+00', 0, '69dc290bdb3e493d97a1b27414b8a4ef', 0, 'STARTED', 0, 1, 34),
(36, NULL, NULL, '2026-10-13 19:11:47.99801+00', 0, '96f335e6f30f4941a5dc8e4fb9b544c6', 0, 'STARTED', 0, 1, 34),
(65, 'Unity 6.6 WebGL', '2026-10-13 19:35:09.90279+00', '2026-10-13 19:35:09.629073+00', 12, 'e3ba212c35e84227a717d7d1f87a337f', 1200, 'COMPLETED', 85, 2, 65),
(97, NULL, NULL, '2026-10-13 19:42:02.775017+00', 0, '4e08cb9d20164548b4875998c7c1b1b0', 0, 'STARTED', 0, 1, 2),
(98, NULL, NULL, '2026-10-13 19:42:02.792808+00', 0, 'e0787d95d98e42699893d09ebd4c8fa7', 0, 'STARTED', 0, 1, 2),
(99, NULL, NULL, '2026-10-13 19:42:46.367819+00', 0, '82211d84eda0428fb70c2eacf4f28b83', 0, 'STARTED', 0, 1, 2),
(100, NULL, NULL, '2026-10-13 19:42:46.371755+00', 0, 'e3f236a6d0224cb58df2f9a295ce859d', 0, 'STARTED', 0, 1, 2),
(101, NULL, '2026-10-13 20:09:53.320105+00', '2026-10-13 20:09:53.216189+00', 25, '9fae0027f5f046e7a2d59224b35e8eda', 2500, 'COMPLETED', 185, 4, 97),
(102, NULL, NULL, '2026-10-13 20:11:35.068715+00', 0, 'af92b4a010934d2ba3f3a499bfc6bce7', 0, 'STARTED', 0, 1, 97),
(103, 'Unity 6.6 WebGL // Sector 07 Combat', '2026-10-13 20:14:23.981325+00', '2026-10-13 20:11:35.07072+00', 0, '1ba355fa96014231a0c6b49d14890b8d', 0, 'COMPLETED', 44, 1, 97),
(104, NULL, NULL, '2026-10-13 20:12:15.792763+00', 0, '9117ddbae61c43ad97ba59257b5a911b', 0, 'STARTED', 0, 1, 34),
(105, 'Unity 6.6 WebGL // Sector 07 Combat', '2026-10-13 20:13:56.875197+00', '2026-10-13 20:12:15.836404+00', 6, 'c10cd380c8d84c0f9e43c06464f74908', 600, 'COMPLETED', 47, 1, 34),
(106, NULL, NULL, '2026-10-13 20:13:58.771529+00', 0, '6262ddcdff46423ca0b2e9e5f74d803e', 0, 'STARTED', 0, 1, 34),
(107, NULL, NULL, '2026-10-13 20:14:24.521909+00', 0, '846d97e0e78c4a8baaf1e5fb6ba198d4', 0, 'STARTED', 0, 1, 97);

-- Align sequences with highest assigned primary key IDs
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
SELECT setval('game_runs_id_seq', (SELECT MAX(id) FROM game_runs));

COMMIT;
