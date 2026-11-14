-- ==============================================================================
-- KORAN GALA 5.0 - DATABASE SCHEMA (PostgreSQL 14+)
-- Catatan: Skema ini akan otomatis dibuat oleh Sequelize (npm run db:sync / seed).
-- File ini disediakan sebagai referensi manual / untuk tim DBA.
-- ==============================================================================

-- Jalankan sebagai superuser/role dengan hak CREATE DATABASE:
-- CREATE DATABASE koran_gala WITH ENCODING 'UTF8';
-- \c koran_gala

CREATE TYPE user_role AS ENUM ('reader','citizen_reporter','editor','admin');
CREATE TYPE region_type AS ENUM ('kabupaten_kota','kecamatan');
CREATE TYPE article_status AS ENUM ('draft','published','archived');
CREATE TYPE ticker_trend AS ENUM ('up','down','flat');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role user_role DEFAULT 'reader',
  nik_verified BOOLEAN DEFAULT false,
  avatar_url VARCHAR(500),
  wallet_balance_nidr DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description VARCHAR(255),
  icon VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS regions (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  slug VARCHAR(160) NOT NULL UNIQUE,
  type region_type NOT NULL,
  parent_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
  latitude DECIMAL(9,6),
  longitude DECIMAL(9,6),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_regions_parent ON regions(parent_id);
CREATE INDEX idx_regions_type ON regions(type);

CREATE TABLE IF NOT EXISTS articles (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  excerpt VARCHAR(500),
  content TEXT NOT NULL,
  cover_image VARCHAR(500),
  brevity_why_it_matters TEXT,
  brevity_by_the_numbers TEXT,
  brevity_big_picture TEXT,
  status article_status DEFAULT 'draft',
  is_investigative BOOLEAN DEFAULT false,
  read_time_minutes SMALLINT DEFAULT 3,
  view_count INTEGER DEFAULT 0,
  gps_lat DECIMAL(9,6),
  gps_lng DECIMAL(9,6),
  published_at TIMESTAMP,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  region_id INTEGER REFERENCES regions(id) ON DELETE SET NULL,
  author_id INTEGER NOT NULL REFERENCES users(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_region ON articles(region_id);
CREATE INDEX idx_articles_status_pub ON articles(status, published_at);

CREATE TABLE IF NOT EXISTS hoax_archives (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  claim_false TEXT NOT NULL,
  verified_fact TEXT NOT NULL,
  screenshot_url VARCHAR(500),
  source_reference VARCHAR(500),
  verified_at TIMESTAMP NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ticker_data (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  value VARCHAR(50) NOT NULL,
  trend ticker_trend DEFAULT 'flat',
  display_order SMALLINT DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);
