
-- Menggunakan CASCADE untuk menghapus semua yang bergantung pada tabel ini secara otomatis.
DROP TABLE IF EXISTS "public"."task_logs" CASCADE;
DROP TABLE IF EXISTS "public"."tasks" CASCADE;
DROP TABLE IF EXISTS "public"."users" CASCADE;
DROP TYPE IF EXISTS "public"."task_status";


-- PERINTAH PEMBUATAN (URUTAN YANG BENAR: DARI FONDASI)

-- 1. Buat tabel "users" terlebih dahulu karena tidak bergantung pada apa pun.
CREATE SEQUENCE IF NOT EXISTS users_id_seq;
CREATE TABLE "public"."users" (
    "id" int4 NOT NULL DEFAULT nextval('users_id_seq'::regclass),
    "username" varchar(50) NOT NULL,
    "password_hash" varchar(255) NOT NULL,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX users_username_key ON public.users USING btree (username);


-- 2. Buat tipe data ENUM untuk status.
CREATE TYPE "public"."task_status" AS ENUM ('Belum Dimulai', 'Sedang Dikerjakan', 'Selesai');


-- 3. Buat tabel "tasks" yang bergantung pada "users".
CREATE SEQUENCE IF NOT EXISTS tasks_id_seq;
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


-- 4. Buat tabel "task_logs" yang bergantung pada "tasks".
CREATE SEQUENCE IF NOT EXISTS task_logs_id_seq;
CREATE TABLE "public"."task_logs" (
    "id" int4 NOT NULL DEFAULT nextval('task_logs_id_seq'::regclass),
    "task_id" int4 NOT NULL,
    "action" varchar(255) NOT NULL,
    "created_at" timestamptz DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "task_logs_task_id_fkey" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE CASCADE,
    PRIMARY KEY ("id")
);


-- PERINTAH MEMASUKKAN DATA (DIBUAT PINTAR DENGAN "ON CONFLICT")
-- Jika data dengan "id" yang sama sudah ada, perintah ini akan dilewati tanpa eror.

INSERT INTO "public"."users" ("id", "username", "password_hash", "created_at") VALUES
(4, 'manager', '$2b$10$KJUN9InknL7pjXZodm/T.uK/vEy6AUNpN3/e8D7Iewb2QcccloDZG', '2025-10-15 13:53:20.485742+07'),
(1, 'project_manager', '11', '2025-10-15 13:50:37.792635+07')
ON CONFLICT (id) DO NOTHING;

INSERT INTO "public"."tasks" ("id", "title", "description", "status", "assignee_name", "created_at", "start_date", "due_date", "user_id") VALUES
(1, 'Desain Halaman Login', 'Buat mockup UI/UX untuk halaman login pengguna.', 'Belum Dimulai', 'Andi Desainer', '2025-10-15 14:22:21.618772+07', '2025-10-16', '2025-10-20', 1),
(2, 'Login', 'Buat mockup UI/UX untuk halaman login pengguna.', 'Belum Dimulai', 'Afif', '2025-10-15 14:26:48.292333+07', '2025-10-16', '2025-10-20', 1),
(3, 'Buat halaman login', 'buat oleh 3 orang', 'Selesai', 'afif', '2025-10-15 20:15:21.827341+07', '2025-10-12', '2025-10-15', 4),
(8, 'Buat Landing Page', 'kerjakan 3 hari', 'Sedang Dikerjakan', 'afif', '2025-10-15 22:35:58.933633+07', '2025-10-16', '2025-10-18', 4),
(9, 'Desain Footer', 'Kerjakan 2 Hari', 'Sedang Dikerjakan', 'afif', '2025-10-16 06:18:34.032912+07', '2025-10-14', '2025-10-15', 4),
(11, 'Desain Dashboard', '3 org', 'Sedang Dikerjakan', 'afif', '2025-10-16 10:22:43.107403+07', '2025-10-15', '2025-10-17', 4),
(12, 'Desain Login', '2 orang', 'Belum Dimulai', 'afif', '2025-10-16 10:22:59.98755+07', '2025-10-17', '2025-10-18', 4),
(13, 'Desain Logout', '2 orang', 'Belum Dimulai', 'afif', '2025-10-16 10:23:20.107866+07', '2025-10-17', '2025-10-18', 4),
(14, 'Desain Navbar', '3 orang', 'Selesai', 'dika', '2025-10-16 10:30:12.237011+07', '2025-10-17', '2025-10-18', 4)
ON CONFLICT (id) DO NOTHING;

INSERT INTO "public"."task_logs" ("id", "task_id", "action", "created_at") VALUES
(1, 1, 'Tugas "Desain Halaman Login" telah dibuat dan ditugaskan kepada Andi Desainer', '2025-10-15 14:22:21.618772+07'),
(2, 2, 'tugas "Login" telah dibuat dan ditugaskan kepada Afif', '2025-10-15 14:26:48.292333+07'),
(3, 3, 'Tugas "Buat halaman login" telah dibuat.', '2025-10-15 20:15:21.827341+07'),
(4, 3, 'Status diubah dari "Belum Dimulai" menjadi "Sedang Dikerjakan".', '2025-10-15 20:15:39.075081+07'),
(9, 3, 'Status diubah dari "Sedang Dikerjakan" menjadi "Selesai".', '2025-10-15 20:57:57.749054+07'),
(13, 8, 'Tugas "Buat Landing Page" telah dibuat oleh manager.', '2025-10-15 22:35:58.933633+07')
ON CONFLICT (id) DO NOTHING;
