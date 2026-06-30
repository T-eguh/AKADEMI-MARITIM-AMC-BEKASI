import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

// Check if MySQL connection environment variables are available and not empty
const hasMySQLConfig = !!(
  (process.env.DB_HOST && process.env.DB_HOST.trim() !== '') ||
  (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== '')
);

let pool: mysql.Pool | null = null;
let isMySQLState = false;

if (hasMySQLConfig) {
  try {
    const config: mysql.PoolOptions = process.env.DATABASE_URL
      ? { uri: process.env.DATABASE_URL }
      : {
          host: process.env.DB_HOST,
          user: process.env.DB_USER || 'root',
          password: process.env.DB_PASSWORD || '',
          database: process.env.DB_NAME || 'amc_db',
          port: Number(process.env.DB_PORT || 3306),
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
        };

    pool = mysql.createPool(config);
    isMySQLState = true;
    console.log('AMC Backend: MySQL configuration detected.');
  } catch (error) {
    console.warn('AMC Backend: Failed to initialize MySQL Pool, using File-based fallback instead.');
    isMySQLState = false;
  }
} else {
  console.log('AMC Backend: No MySQL environment variables configured. Defaulting to File-based JSON database.');
}

export let isMySQL = isMySQLState;
export function getIsMySQL(): boolean {
  return isMySQLState;
}

export { pool };

// Path to file-based database for fallback/local development
export const JSON_DB_PATH = path.join(process.cwd(), 'public', 'amc_backup.json');

// Initialize database schema (runs on MySQL if connected)
export async function initDB() {
  // Always create automatic backup before update / server start
  const backupSource = path.join(process.cwd(), 'public', 'amc_backup.json');
  const backupDest = path.join(process.cwd(), 'public', 'amc_backup_before_update.json');
  
  try {
    if (fs.existsSync(backupSource)) {
      // Validate backupSource first
      let isValid = false;
      try {
        const content = fs.readFileSync(backupSource, 'utf8');
        if (content && content.trim().length > 0) {
          JSON.parse(content);
          isValid = true;
        }
      } catch (err) {
        console.warn('AMC Backend: Existing amc_backup.json is corrupt/invalid.', err);
      }

      if (isValid) {
        fs.copyFileSync(backupSource, backupDest);
        console.log('AMC Backend: Created automatic startup backup at public/amc_backup_before_update.json');
      } else {
        // If amc_backup.json is invalid/corrupt, automatically try to restore from backup_before_update
        if (fs.existsSync(backupDest)) {
          fs.copyFileSync(backupDest, backupSource);
          console.log('AMC Backend: Restored amc_backup.json from public/amc_backup_before_update.json due to corruption');
        }
      }
    } else {
      // If amc_backup.json doesn't exist but amc_backup_before_update.json does, restore it
      if (fs.existsSync(backupDest)) {
        fs.copyFileSync(backupDest, backupSource);
        console.log('AMC Backend: Restored missing amc_backup.json from public/amc_backup_before_update.json');
      }
    }
  } catch (error) {
    console.error('AMC Backend: Error during automatic backup/restore phase:', error);
  }

  if (!isMySQLState || !pool) {
    console.log('AMC Backend: Operating in File-Based Storage Mode using amc_backup.json.');
    return;
  }

  try {
    const connection = await pool.getConnection();
    console.log('AMC Backend: Connected to MySQL database successfully.');
    
    // Create necessary tables if they do not exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        email VARCHAR(100) NOT NULL,
        avatar VARCHAR(255)
      )
    `);

    await connection.query(`
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
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS gallery (
        id VARCHAR(50) PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image VARCHAR(255) NOT NULL,
        category VARCHAR(50),
        date VARCHAR(50)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS facilities (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        image VARCHAR(255) NOT NULL,
        icon VARCHAR(50)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS store_products (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image VARCHAR(255),
        description TEXT,
        category VARCHAR(50),
        stock INT DEFAULT 0
      )
    `);

    await connection.query(`
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
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS site_content (
        id VARCHAR(50) PRIMARY KEY,
        section VARCHAR(50) UNIQUE NOT NULL,
        data LONGTEXT NOT NULL
      )
    `);

    connection.release();
    console.log('AMC Backend: MySQL Database Tables verified/created successfully.');
  } catch (error: any) {
    if (error && (error.code === 'ECONNREFUSED' || error.errno === -111)) {
      console.log('AMC Backend: Local MySQL server not running. Operating seamlessly in File-Based Storage Mode.');
    } else {
      console.warn('AMC Backend: Database Connection Notice (using File-based backup fallback):', error.message || error);
    }
    isMySQLState = false;
    isMySQL = false;
  }
}
