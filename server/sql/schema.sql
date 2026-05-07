USE railway;
-- =====================================================
-- NEXUS Game Trailer Hub — MySQL Schema
-- =====================================================
-- Chạy: mysql -u root -p < server/sql/schema.sql
-- Hoặc dùng script: cd server && npm run db:setup
-- =====================================================


-- Users
CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  username VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(60) NOT NULL,
  phone VARCHAR(11),
  avatar_url TEXT,
  is_banned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- User roles (separate table for security best-practice)
CREATE TABLE IF NOT EXISTS user_roles (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36) NOT NULL,
  role ENUM('user','admin') NOT NULL DEFAULT 'user',
  UNIQUE KEY uniq_user_role (user_id, role),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Trailers
CREATE TABLE IF NOT EXISTS trailers (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(200) UNIQUE NOT NULL,
  title VARCHAR(200) NOT NULL,
  publisher VARCHAR(200) NOT NULL,
  description TEXT,
  genre VARCHAR(100),
  release_date DATE,
  thumbnail_url TEXT,
  video_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  views INT DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Livestreams
CREATE TABLE IF NOT EXISTS livestreams (
  id CHAR(36) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  playback_url TEXT,
  stream_key VARCHAR(64) UNIQUE,
  status ENUM('live','offline') DEFAULT 'offline',
  viewer_count INT DEFAULT 0,
  created_by CHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Live chat messages
CREATE TABLE IF NOT EXISTS live_messages (
  id CHAR(36) PRIMARY KEY,
  livestream_id CHAR(36) NOT NULL,
  user_id CHAR(36) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (livestream_id) REFERENCES livestreams(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_live_chat (livestream_id, created_at)
) ENGINE=InnoDB;

-- Activity logs
CREATE TABLE IF NOT EXISTS activity_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id CHAR(36),
  action TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- =====================================================
-- Indexes
-- =====================================================
CREATE INDEX idx_trailers_genre ON trailers(genre);
CREATE INDEX idx_trailers_featured ON trailers(featured);
CREATE INDEX idx_trailers_views ON trailers(views);

