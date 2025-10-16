DROP TABLE IF EXISTS "public"."task_logs";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS task_logs_id_seq;

-- Table Definition
CREATE TABLE "public"."task_logs" (
    "id" int4 NOT NULL DEFAULT nextval('task_logs_id_seq'::regclass),
    "task_id" int4 NOT NULL,
    "action" varchar(255) NOT NULL,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."tasks";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS tasks_id_seq;
DROP TYPE IF EXISTS "public"."task_status";
CREATE TYPE "public"."task_status" AS ENUM ('Belum Dimulai', 'Sedang Dikerjakan', 'Selesai');

-- Table Definition
CREATE TABLE "public"."tasks" (
    "id" int4 NOT NULL DEFAULT nextval('tasks_id_seq'::regclass),
    "title" varchar(255) NOT NULL,
    "description" text,
    "status" "public"."task_status" DEFAULT 'Belum Dimulai'::task_status,
    "assignee_name" varchar(100),
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    "start_date" date,
    "due_date" date,
    "user_id" int4 NOT NULL,
    CONSTRAINT "tasks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id"),
    PRIMARY KEY ("id")
);

DROP TABLE IF EXISTS "public"."users";
-- Sequence and defined type
CREATE SEQUENCE IF NOT EXISTS users_id_seq;

-- Table Definition
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar(50) NOT NULL,
    "password_hash" varchar(255) NOT NULL,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);


-- Indices
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);

INSERT INTO "public"."task_logs" ("id", "task_id", "action", "created_at") VALUES
(1, 1, 'Tugas "Desain Halaman Login" telah dibuat dan ditugaskan kepada Andi Desainer', '2025-10-15 14:22:21.618772+07'),
(2, 2, 'tugas "Login" telah dibuat dan ditugaskan kepada Afif', '2025-10-15 14:26:48.292333+07'),
(3, 3, 'Tugas "Buat halaman login" telah dibuat.', '2025-10-15 20:15:21.827341+07'),
(4, 3, 'Status diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-15 20:15:39.075081+07'),
(9, 3, 'Status diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-15 20:57:57.749054+07'),
(13, 8, 'Tugas "Buat Landing Page" telah dibuat oleh manager.', '2025-10-15 22:35:58.933633+07'),
(14, 8, 'Status tugas "Buat Landing Page" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-15 22:36:13.932542+07'),
(18, 8, 'Status tugas "Buat Landing Page" diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-16 06:03:33.457248+07'),
(19, 8, 'Status tugas "Buat Landing Page" diubah dari "Selesai" menjadi "Belum Dimulai".', '2025-10-16 06:03:46.71775+07'),
(20, 8, 'Status tugas "Buat Landing Page" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:03:53.915988+07'),
(24, 9, 'Tugas "Desain Footer" telah dibuat oleh manager.', '2025-10-16 06:18:34.032912+07'),
(25, 9, 'Status tugas "Desain Footer" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:19:10.255471+07'),
(34, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:30:41.05021+07'),
(35, 8, 'Status tugas "Buat Landing Page" diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-16 06:30:46.76545+07'),
(36, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:30:46.807369+07'),
(37, 8, 'Status tugas "Buat Landing Page" diubah dari "Selesai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:30:57.776293+07'),
(38, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:30:57.80396+07'),
(39, 8, 'Status tugas "Buat Landing Page" diubah dari "Sedang Dikerjakan" menjadi "Belum Dimulai".', '2025-10-16 06:31:04.525893+07'),
(40, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:31:04.567617+07'),
(43, 8, 'Status tugas "Buat Landing Page" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:34:51.869327+07'),
(44, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:34:51.901008+07'),
(45, 8, 'Status tugas "Buat Landing Page" diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-16 06:34:56.71654+07'),
(46, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:34:56.747794+07'),
(47, 8, 'Status tugas "Buat Landing Page" diubah dari "Selesai" menjadi "Belum Dimulai".', '2025-10-16 06:35:01.062518+07'),
(48, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:35:01.100681+07'),
(49, 8, 'Status tugas "Buat Landing Page" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:35:05.865314+07'),
(50, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:35:05.90061+07'),
(51, 9, 'Status tugas "Desain Footer" diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-16 06:35:15.844898+07'),
(52, 9, 'Tugas "Desain Footer" diperbarui', '2025-10-16 06:35:15.882173+07'),
(53, 8, 'Status tugas "Buat Landing Page" diubah dari "Sedang Dikerjakan" menjadi "Belum Dimulai".', '2025-10-16 06:45:15.885695+07'),
(54, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:45:15.913377+07'),
(55, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:47:53.079836+07'),
(56, 8, 'Status tugas "Buat Landing Page" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:47:58.184154+07'),
(57, 8, 'Tugas "Buat Landing Page" diperbarui', '2025-10-16 06:47:58.223415+07'),
(58, 9, 'Tugas "Desain Footer" diperbarui', '2025-10-16 06:49:32.508491+07'),
(59, 9, 'Status tugas "Desain Footer" diubah dari "Selesai" menjadi "Sedang Dikerjakan".', '2025-10-16 06:49:40.238882+07'),
(60, 9, 'Tugas "Desain Footer" diperbarui', '2025-10-16 06:49:40.278489+07'),
(67, 11, 'Tugas "Desain Dashboard" telah dibuat oleh manager.', '2025-10-16 10:22:43.107403+07'),
(69, 12, 'Tugas "Desain Login" telah dibuat oleh manager.', '2025-10-16 10:22:59.98755+07'),
(71, 13, 'Tugas "Desain Logout" telah dibuat oleh manager.', '2025-10-16 10:23:20.107866+07'),
(73, 14, 'Tugas "Desain Navbar" telah dibuat oleh manager.', '2025-10-16 10:30:12.237011+07'),
(74, 14, 'Tugas "Desain Navbar" dibuat', '2025-10-16 10:30:12.287858+07'),
(75, 14, 'Tugas "Desain Navbar" diperbarui', '2025-10-16 10:30:22.589925+07'),
(76, 11, 'Status tugas "Desain Dashboard" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 10:55:04.419548+07'),
(77, 11, 'Tugas "Desain Dashboard" diperbarui', '2025-10-16 10:55:04.456072+07'),
(78, 14, 'Status tugas "Desain Navbar" diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-16 11:18:18.652925+07'),
(79, 14, 'Tugas "Desain Navbar" diperbarui', '2025-10-16 11:18:18.702925+07'),
(80, 14, 'Status tugas "Desain Navbar" diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-16 11:32:41.209089+07'),
(81, 14, 'Tugas "Desain Navbar" diperbarui', '2025-10-16 11:32:41.258611+07');
INSERT INTO "public"."tasks" ("id", "title", "description", "status", "assignee_name", "created_at", "start_date", "due_date", "user_id") VALUES
(1, 'Desain Halaman Login', 'Buat mockup UI/UX untuk halaman login pengguna.', 'Belum Dimulai', 'Andi Desainer', '2025-10-15 14:22:21.618772+07', '2025-10-16', '2025-10-20', 1),
(2, 'Login', 'Buat mockup UI/UX untuk halaman login pengguna.', 'Belum Dimulai', 'Afif', '2025-10-15 14:26:48.292333+07', '2025-10-16', '2025-10-20', 1),
(3, 'Buat halaman login', 'buat oleh 3 orang', 'Selesai', 'afif', '2025-10-15 20:15:21.827341+07', '2025-10-12', '2025-10-15', 4),
(8, 'Buat Landing Page', 'kerjakan 3 hari', 'Sedang Dikerjakan', 'afif', '2025-10-15 22:35:58.933633+07', '2025-10-16', '2025-10-18', 4),
(9, 'Desain Footer', 'Kerjakan 2 Hari', 'Sedang Dikerjakan', 'afif', '2025-10-16 06:18:34.032912+07', '2025-10-14', '2025-10-15', 4),
(12, 'Desain Login', '2 orang', 'Belum Dimulai', 'afif', '2025-10-16 10:22:59.98755+07', '2025-10-17', '2025-10-18', 4),
(13, 'Desain Logout', '2 orang', 'Belum Dimulai', 'afif', '2025-10-16 10:23:20.107866+07', '2025-10-17', '2025-10-18', 4),
(11, 'Desain Dashboard', '3 org', 'Sedang Dikerjakan', 'afif', '2025-10-16 10:22:43.107403+07', '2025-10-15', '2025-10-17', 4),
(14, 'Desain Navbar', '3 orang', 'Selesai', 'dika', '2025-10-16 10:30:12.237011+07', '2025-10-17', '2025-10-18', 4);
INSERT INTO "public"."users" ("id", "username", "password_hash", "created_at") VALUES
(4, 'manager', '$2b$10$KJUN9InknL7pjXZodm/T.uK/vEy6AUNpN3/e8D7Iewb2QcccloDZG', '2025-10-15 13:53:20.485742+07'),
(1, 'project_manager', '11', '2025-10-15 13:50:37.792635+07');
