-- Abel Gemstone Database DDL Schema

CREATE TABLE IF NOT EXISTS categories (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gemstones (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100) NOT NULL,
  sub_category VARCHAR(100) DEFAULT '',
  weight_carats NUMERIC(10, 2) NOT NULL,
  dimensions VARCHAR(100) DEFAULT 'N/A',
  shape_cut VARCHAR(100) DEFAULT 'Faceted',
  color VARCHAR(100) DEFAULT 'Vivid',
  origin VARCHAR(100) DEFAULT 'Ethiopia',
  treatment VARCHAR(255) DEFAULT 'Natural / Unheated',
  clarity VARCHAR(100) DEFAULT 'Eye Clean',
  price_usd NUMERIC(12, 2),
  price_formatted VARCHAR(100) DEFAULT 'Price on Request',
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  is_rough BOOLEAN DEFAULT FALSE,
  cutting_potential TEXT,
  description TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  video_url TEXT,
  has_360_view BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  certificate JSONB,
  date_added VARCHAR(50) DEFAULT TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD'),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS buyer_inquiries (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  company VARCHAR(255) DEFAULT '',
  country VARCHAR(100) DEFAULT 'International',
  email VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(100) DEFAULT '',
  gemstone_wanted VARCHAR(255) NOT NULL,
  stone_id VARCHAR(50),
  stone_name VARCHAR(255),
  rough_or_finished VARCHAR(100) DEFAULT 'Finished Gemstone',
  approximate_carat VARCHAR(100) DEFAULT '',
  budget_range VARCHAR(100) DEFAULT 'Unspecified',
  message TEXT DEFAULT '',
  timestamp VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'New',
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS gallery_items (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(100) DEFAULT 'Paraíba',
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  description TEXT DEFAULT '',
  origin VARCHAR(100) DEFAULT '',
  is_video BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS admin_users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(100) NOT NULL,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id VARCHAR(50) PRIMARY KEY,
  action TEXT NOT NULL,
  user_name VARCHAR(255) NOT NULL,
  timestamp VARCHAR(100) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_gemstones_category ON gemstones(category);
CREATE INDEX IF NOT EXISTS idx_gemstones_status ON gemstones(status);
CREATE INDEX IF NOT EXISTS idx_gemstones_is_rough ON gemstones(is_rough);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON buyer_inquiries(status);
