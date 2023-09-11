-- SET client_min_messages = warning;
-- -------------------------
-- Database zain
-- -------------------------
DROP DATABASE IF EXISTS zain;
--
--
CREATE DATABASE zain;
-- -------------------------
-- Database zain_test
-- -------------------------
DROP DATABASE IF EXISTS zain_test;
--
--
CREATE DATABASE zain_test;
-- -------------------------
-- Role admin
-- -------------------------
-- DROP ROLE IF EXISTS admin;
--
--
-- CREATE ROLE admin WITH PASSWORD 'admin';
-- -------------------------
-- Alter Role admin
-- -------------------------
-- ALTER ROLE admin WITH SUPERUSER CREATEROLE CREATEDB LOGIN;
-- -------------------------
-- Database GRANT PRIVILEGES
-- -------------------------
GRANT ALL PRIVILEGES ON DATABASE zain TO admin;
GRANT ALL PRIVILEGES ON DATABASE zain_test TO admin;
-- -------------------------
-- Connect to zain database
-- -------------------------
\c zain;
-- -------------------------
-- Set Timezone
-- -------------------------
SET TIMEZONE = 'UTC';
-- -------------------------
-- Type group_roles
-- -------------------------
CREATE TYPE user_roles AS ENUM('admin', 'moderator', 'student');
-- -------------------------
-- Table users
-- -------------------------
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  middle_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone VARCHAR(30) UNIQUE NOT NULL,
  role user_roles NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table passwords
-- -------------------------
CREATE TABLE IF NOT EXISTS passwords (
  id SERIAL PRIMARY KEY,
  password TEXT NOT NULL,
  user_id INT NOT NULL UNIQUE REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table profile_pictures
-- -------------------------
CREATE TABLE IF NOT EXISTS profile_pictures (
  id SERIAL PRIMARY KEY,
  image_url VARCHAR(200) NOT NULL,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table levels
-- -------------------------
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  level VARCHAR(200) NOT NULL UNIQUE
);
-- -------------------------
-- Table groups
-- -------------------------
CREATE TABLE IF NOT EXISTS groups (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  level_id INT NOT NULL REFERENCES levels(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table users_groups
-- -------------------------
CREATE TABLE IF NOT EXISTS users_groups (
  id SERIAL PRIMARY KEY,
  group_id INT NOT NULL REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table users_level
-- -------------------------
CREATE TABLE IF NOT EXISTS users_level (
  id SERIAL PRIMARY KEY,
  level_id INT NOT NULL REFERENCES levels(id) ON UPDATE CASCADE ON DELETE CASCADE,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table categories
-- -------------------------
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  group_id INT NOT NULL REFERENCES groups(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table units
-- -------------------------
CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  category_id INT NOT NULL REFERENCES categories(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table posts
-- -------------------------
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  post_caption TEXT,
  unit_id INT NOT NULL REFERENCES units(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now()),
  updated_at TIMESTAMP
);
-- -------------------------
-- Table post_images
-- -------------------------
CREATE TABLE IF NOT EXISTS post_images (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table post_videos
-- -------------------------
CREATE TABLE IF NOT EXISTS post_videos (
  id SERIAL PRIMARY KEY,
  video_url TEXT NOT NULL,
  post_id INT NOT NULL REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE
);
-- -------------------------
-- Table users_presences
-- -------------------------
CREATE TABLE IF NOT EXISTS users_presences (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  degree FLOAT NOT NULL DEFAULT 0,
  is_presence BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table tests
-- -------------------------
CREATE TABLE IF NOT EXISTS tests (
  id SERIAL PRIMARY KEY,
  name VARCHAR(250) NOT NULL,
  group_id INT NOT NULL REFERENCES tests(id) ON UPDATE CASCADE ON DELETE CASCADE,
  degree INT NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table test_images
-- -------------------------
CREATE TABLE IF NOT EXISTS test_images (
  id SERIAL PRIMARY KEY,
  test_id INT NOT NULL REFERENCES tests(id) ON UPDATE CASCADE ON DELETE CASCADE,
  image_url TEXT NOT NULL
);
-- -------------------------
-- Table tests_degree
-- -------------------------
CREATE TABLE IF NOT EXISTS tests_degree (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  test_id INT NOT NULL REFERENCES tests(id) ON UPDATE CASCADE ON DELETE CASCADE,
  degree INT NOT NULL,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table tests_submitions
-- -------------------------
CREATE TABLE IF NOT EXISTS tests_submitions (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
  test_id INT NOT NULL REFERENCES tests(id) ON UPDATE CASCADE ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT timezone('UTC', now())
);
-- -------------------------
-- Table submition_images
-- -------------------------
CREATE TABLE IF NOT EXISTS submition_images (
  id SERIAL PRIMARY KEY,
  submition_id INT NOT NULL REFERENCES tests_submitions(id) ON UPDATE CASCADE ON DELETE CASCADE,
  image_url TEXT NOT NULL
);