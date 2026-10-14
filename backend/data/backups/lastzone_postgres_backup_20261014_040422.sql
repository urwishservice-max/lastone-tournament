--
-- PostgreSQL database dump
--

\restrict QblhzILAkzS6R0quSuR1dltsavivMDoEUGLl1RBM8SICbAJiIt423w4AS54ctg1

-- Dumped from database version 16.15
-- Dumped by pg_dump version 16.15

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: flyway_schema_history; Type: TABLE; Schema: public; Owner: lastzone_admin
--

CREATE TABLE public.flyway_schema_history (
    installed_rank integer NOT NULL,
    version character varying(50),
    description character varying(200) NOT NULL,
    type character varying(20) NOT NULL,
    script character varying(1000) NOT NULL,
    checksum integer,
    installed_by character varying(100) NOT NULL,
    installed_on timestamp without time zone DEFAULT now() NOT NULL,
    execution_time integer NOT NULL,
    success boolean NOT NULL
);


ALTER TABLE public.flyway_schema_history OWNER TO lastzone_admin;

--
-- Name: game_runs; Type: TABLE; Schema: public; Owner: lastzone_admin
--

CREATE TABLE public.game_runs (
    id bigint NOT NULL,
    user_id bigint NOT NULL,
    run_token character varying(64) NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    kills integer DEFAULT 0 NOT NULL,
    wave integer DEFAULT 1 NOT NULL,
    survival_duration integer DEFAULT 0 NOT NULL,
    status character varying(30) DEFAULT 'STARTED'::character varying NOT NULL,
    client_metadata character varying(500),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    completed_at timestamp with time zone
);


ALTER TABLE public.game_runs OWNER TO lastzone_admin;

--
-- Name: game_runs_id_seq; Type: SEQUENCE; Schema: public; Owner: lastzone_admin
--

CREATE SEQUENCE public.game_runs_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.game_runs_id_seq OWNER TO lastzone_admin;

--
-- Name: game_runs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lastzone_admin
--

ALTER SEQUENCE public.game_runs_id_seq OWNED BY public.game_runs.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: lastzone_admin
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    username character varying(50) NOT NULL,
    email character varying(100) NOT NULL,
    password_hash character varying(255) NOT NULL,
    display_name character varying(100) NOT NULL,
    role character varying(20) DEFAULT 'ROLE_USER'::character varying NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.users OWNER TO lastzone_admin;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: lastzone_admin
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO lastzone_admin;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: lastzone_admin
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: game_runs id; Type: DEFAULT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.game_runs ALTER COLUMN id SET DEFAULT nextval('public.game_runs_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: flyway_schema_history; Type: TABLE DATA; Schema: public; Owner: lastzone_admin
--

COPY public.flyway_schema_history (installed_rank, version, description, type, script, checksum, installed_by, installed_on, execution_time, success) FROM stdin;
1	1	init schema	SQL	V1__init_schema.sql	349367954	lastzone_admin	2026-10-13 22:14:40.840232	123	t
\.


--
-- Data for Name: game_runs; Type: TABLE DATA; Schema: public; Owner: lastzone_admin
--

COPY public.game_runs (id, user_id, run_token, score, kills, wave, survival_duration, status, client_metadata, created_at, completed_at) FROM stdin;
1000	1000	0337f33617234b4aa666ec76b5ef679f	1750	15	3	115	COMPLETED	\N	2026-10-13 22:17:03.896598+00	2026-10-13 22:17:03.957604+00
1	1	e267a71ec67648b1bebb344f8d371134	15800	84	7	345	COMPLETED	Vite Proxy E2E Test	2026-10-13 18:45:10.79904+00	2026-10-13 18:45:10.848904+00
2	2	235343a5c9bf417d9ce54ef90a041966	0	0	1	0	STARTED	\N	2026-10-13 18:50:42.174208+00	\N
3	2	80a2c1a195a34d438decc148a1d9b512	0	0	1	0	STARTED	\N	2026-10-13 18:50:42.17823+00	\N
4	2	ba50fc66be1a4f6599c5569cd0c06426	0	0	1	0	STARTED	\N	2026-10-13 18:50:52.09083+00	\N
5	2	9829050f073a4678b6041d4bbd643953	0	0	1	0	STARTED	\N	2026-10-13 18:51:37.003709+00	\N
6	2	dccbf3fa4d48459fafe723c75a53ca55	0	0	1	0	STARTED	\N	2026-10-13 18:51:37.003709+00	\N
33	34	463131d12c4b41e1a22f9dadaf986f2f	0	0	1	0	STARTED	\N	2026-10-13 19:09:17.88806+00	\N
34	34	61331fe869d34e7e9b8f9a6d5ee95b77	0	0	1	0	STARTED	\N	2026-10-13 19:09:17.886043+00	\N
35	34	69dc290bdb3e493d97a1b27414b8a4ef	0	0	1	0	STARTED	\N	2026-10-13 19:11:47.99801+00	\N
36	34	96f335e6f30f4941a5dc8e4fb9b544c6	0	0	1	0	STARTED	\N	2026-10-13 19:11:47.99801+00	\N
65	65	e3ba212c35e84227a717d7d1f87a337f	1200	12	2	85	COMPLETED	Unity 6.6 WebGL	2026-10-13 19:35:09.629073+00	2026-10-13 19:35:09.90279+00
97	2	4e08cb9d20164548b4875998c7c1b1b0	0	0	1	0	STARTED	\N	2026-10-13 19:42:02.775017+00	\N
98	2	e0787d95d98e42699893d09ebd4c8fa7	0	0	1	0	STARTED	\N	2026-10-13 19:42:02.792808+00	\N
99	2	82211d84eda0428fb70c2eacf4f28b83	0	0	1	0	STARTED	\N	2026-10-13 19:42:46.367819+00	\N
100	2	e3f236a6d0224cb58df2f9a295ce859d	0	0	1	0	STARTED	\N	2026-10-13 19:42:46.371755+00	\N
101	97	9fae0027f5f046e7a2d59224b35e8eda	2500	25	4	185	COMPLETED	\N	2026-10-13 20:09:53.216189+00	2026-10-13 20:09:53.320105+00
102	97	af92b4a010934d2ba3f3a499bfc6bce7	0	0	1	0	STARTED	\N	2026-10-13 20:11:35.068715+00	\N
103	97	1ba355fa96014231a0c6b49d14890b8d	0	0	1	44	COMPLETED	Unity 6.6 WebGL // Sector 07 Combat	2026-10-13 20:11:35.07072+00	2026-10-13 20:14:23.981325+00
104	34	9117ddbae61c43ad97ba59257b5a911b	0	0	1	0	STARTED	\N	2026-10-13 20:12:15.792763+00	\N
105	34	c10cd380c8d84c0f9e43c06464f74908	600	6	1	47	COMPLETED	Unity 6.6 WebGL // Sector 07 Combat	2026-10-13 20:12:15.836404+00	2026-10-13 20:13:56.875197+00
106	34	6262ddcdff46423ca0b2e9e5f74d803e	0	0	1	0	STARTED	\N	2026-10-13 20:13:58.771529+00	\N
107	97	846d97e0e78c4a8baaf1e5fb6ba198d4	0	0	1	0	STARTED	\N	2026-10-13 20:14:24.521909+00	\N
1001	1001	6ed34514dedc417bad0d12edde03f36a	1750	15	3	115	COMPLETED	\N	2026-10-13 22:27:01.838009+00	2026-10-13 22:27:01.907786+00
1002	1002	b868febe676a481dafeadb19eb20c7b5	1750	15	3	115	COMPLETED	\N	2026-10-13 22:31:50.322321+00	2026-10-13 22:31:50.376467+00
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: lastzone_admin
--

COPY public.users (id, username, email, password_hash, display_name, role, created_at, updated_at) FROM stdin;
1000	DevOpsOperative_1791929822	devopsoperative_1791929822@vanguard.local	$2a$10$GKRbMFYAb893cmzizjfR2eA49L4cUAjn6wlhqwLIhUqRSEIRv88i.	DevOps Operative	ROLE_USER	2026-10-13 22:17:03.108565+00	2026-10-13 22:17:03.108566+00
1	Chief117	chief@unsc.org	$2a$10$bsLDjk2FXtImX5gjMKfRMO3wFwd1WW2ebKtCDQLjmFWGh11Dt8tau	Master Chief	ROLE_USER	2026-10-13 18:45:10.23716+00	2026-10-13 18:45:10.23716+00
2	jaidev12	jaidev@gmail.com	$2a$10$jmx5gPSVp6nAKQamUgjJQuwCQstNfdcfHnFDI89rN24gdT2I5Yds2	jaidev	ROLE_USER	2026-10-13 18:50:26.387393+00	2026-10-13 18:50:26.387393+00
33	SpartanTest	spartan@test.com	$2a$10$FpKt/08H1U5YGEM6PxllP.ZChDbMRR0H2k9A.s5.2UhvMCiSU5ZA6	Spartan Test	ROLE_USER	2026-10-13 19:05:37.523226+00	2026-10-13 19:05:37.523226+00
34	SpartanOperative1	operative1@reach.unsc.org	$2a$10$4VkVeFRO77VMvJmvzW/SX.OGTQPFACVTYI.BioU.A6ZysLC5/.7OO	Operative One	ROLE_USER	2026-10-13 19:09:09.578596+00	2026-10-13 19:09:09.578596+00
65	SpartanOperative99	operative99@reach.unsc.org	$2a$10$3Yl0aT.rSoYQ7Ou2JCj69uU.ozc63Bys922rVB6LZhv.E1sjW55UW	Vanguard Ninety-Nine	ROLE_USER	2026-10-13 19:35:06.34072+00	2026-10-13 19:35:06.34072+00
97	SpartanHunter88	hunter88@reach.mil	$2a$10$BfLXwVTtkjfggP5/oTI/ROC6ZoUb4.SruSaG2uwJVHFxbav3MsNvq	Master Hunter 88	ROLE_USER	2026-10-13 20:09:45.580785+00	2026-10-13 20:09:45.580785+00
1001	DevOpsOperative_1791930420	devopsoperative_1791930420@vanguard.local	$2a$10$Qtx7XdW88OOIPthLyqZlC.zkSKgpgDRoqjWjI.MtR97HrVm3R3Zd.	DevOps Operative	ROLE_USER	2026-10-13 22:27:01.353531+00	2026-10-13 22:27:01.353531+00
1002	DevOpsOperative_1791930709	devopsoperative_1791930709@vanguard.local	$2a$10$s0Y1nmqGPxAk7lsvz/EBVuz35RVluXb0BG36XGMysMDw/9PaHM2Ri	DevOps Operative	ROLE_USER	2026-10-13 22:31:49.734728+00	2026-10-13 22:31:49.734729+00
\.


--
-- Name: game_runs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lastzone_admin
--

SELECT pg_catalog.setval('public.game_runs_id_seq', 1002, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: lastzone_admin
--

SELECT pg_catalog.setval('public.users_id_seq', 1002, true);


--
-- Name: flyway_schema_history flyway_schema_history_pk; Type: CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.flyway_schema_history
    ADD CONSTRAINT flyway_schema_history_pk PRIMARY KEY (installed_rank);


--
-- Name: game_runs game_runs_pkey; Type: CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.game_runs
    ADD CONSTRAINT game_runs_pkey PRIMARY KEY (id);


--
-- Name: game_runs game_runs_run_token_key; Type: CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.game_runs
    ADD CONSTRAINT game_runs_run_token_key UNIQUE (run_token);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: flyway_schema_history_s_idx; Type: INDEX; Schema: public; Owner: lastzone_admin
--

CREATE INDEX flyway_schema_history_s_idx ON public.flyway_schema_history USING btree (success);


--
-- Name: idx_game_runs_leaderboard; Type: INDEX; Schema: public; Owner: lastzone_admin
--

CREATE INDEX idx_game_runs_leaderboard ON public.game_runs USING btree (status, score DESC, kills DESC, survival_duration DESC, created_at);


--
-- Name: idx_game_runs_run_token; Type: INDEX; Schema: public; Owner: lastzone_admin
--

CREATE INDEX idx_game_runs_run_token ON public.game_runs USING btree (run_token);


--
-- Name: idx_game_runs_user_id; Type: INDEX; Schema: public; Owner: lastzone_admin
--

CREATE INDEX idx_game_runs_user_id ON public.game_runs USING btree (user_id);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: lastzone_admin
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: lastzone_admin
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: game_runs game_runs_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: lastzone_admin
--

ALTER TABLE ONLY public.game_runs
    ADD CONSTRAINT game_runs_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict QblhzILAkzS6R0quSuR1dltsavivMDoEUGLl1RBM8SICbAJiIt423w4AS54ctg1

