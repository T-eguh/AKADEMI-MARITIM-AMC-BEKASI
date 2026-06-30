-- AMC Bekasi Database Migration Schema
-- Suitable for MySQL and PostgreSQL

-- Users Table (With index on username)
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(50) PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL,
  email VARCHAR(100) NOT NULL,
  avatar VARCHAR(255)
);

CREATE INDEX idx_users_username ON users(username);

-- News Table
CREATE TABLE IF NOT EXISTS news (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content LONGTEXT,
  category VARCHAR(100),
  image VARCHAR(255),
  date VARCHAR(50),
  author VARCHAR(100),
  views INT DEFAULT 0
);

-- Gallery Table
CREATE TABLE IF NOT EXISTS gallery (
  id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  date VARCHAR(50)
);

-- Facilities Table
CREATE TABLE IF NOT EXISTS facilities (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  image VARCHAR(255) NOT NULL,
  icon VARCHAR(50)
);

-- Store Products Table
CREATE TABLE IF NOT EXISTS store_products (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  description TEXT,
  category VARCHAR(50),
  stock INT DEFAULT 0
);

-- Store Orders Table
CREATE TABLE IF NOT EXISTS store_orders (
  id VARCHAR(50) PRIMARY KEY,
  customerName VARCHAR(255) NOT NULL,
  customerPhone VARCHAR(50) NOT NULL,
  customerEmail VARCHAR(100) NOT NULL,
  items LONGTEXT NOT NULL,
  totalAmount DECIMAL(12,2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  date VARCHAR(50),
  paymentReceipt VARCHAR(255)
);

-- Generic Key-Value Site Content Store
CREATE TABLE IF NOT EXISTS site_content (
  id VARCHAR(50) PRIMARY KEY,
  section VARCHAR(50) UNIQUE NOT NULL,
  data LONGTEXT NOT NULL
);
