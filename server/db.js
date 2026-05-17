import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const host = process.env.DB_HOST ?? 'localhost';
const port = Number(process.env.DB_PORT ?? 3306);
const user = process.env.DB_USER ?? 'root';
const password = process.env.DB_PASSWORD ?? '';
const database = process.env.DB_NAME ?? 'massbook_db';

export const pool = mysql.createPool({
  host,
  port,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export async function initializeDatabase() {
  const rootConnection = await mysql.createConnection({ host, port, user, password });
  await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\``);
  await rootConnection.end();

  const initConnection = await pool.getConnection();
  try {
    await initConnection.query('SET FOREIGN_KEY_CHECKS = 0');
    await initConnection.query('DROP TABLE IF EXISTS submitted_requirements');
    await initConnection.query('DROP TABLE IF EXISTS requirements');
    await initConnection.query('DROP TABLE IF EXISTS events');
    await initConnection.query('DROP TABLE IF EXISTS event_types');
    await initConnection.query('DROP TABLE IF EXISTS schedules');
    await initConnection.query('DROP TABLE IF EXISTS support_tickets');
    await initConnection.query('DROP TABLE IF EXISTS users');
    await initConnection.query('SET FOREIGN_KEY_CHECKS = 1');

    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS event_types (
        event_type_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        description TEXT
      ) ENGINE=InnoDB
    `);

    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS events (
        event_id INT AUTO_INCREMENT PRIMARY KEY,
        event_type_id INT,
        type VARCHAR(100) DEFAULT '',
        title VARCHAR(255) DEFAULT '',
        description TEXT,
        status VARCHAR(50) NOT NULL DEFAULT 'pending',
        requested_date DATE,
        submitted_date DATE,
        requester_name VARCHAR(255),
        email VARCHAR(255),
        contact_number VARCHAR(50),
        event_date DATE,
        start_time TIME,
        end_time TIME,
        location VARCHAR(255),
        celebrant VARCHAR(255),
        expected_guests VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (event_type_id) REFERENCES event_types(event_type_id) ON DELETE SET NULL
      ) ENGINE=InnoDB
    `);

    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_date DATE NOT NULL,
        day VARCHAR(20),
        time VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        celebrant VARCHAR(255),
        requester VARCHAR(255),
        stipend VARCHAR(100),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);

    await initConnection.query(`
      CREATE TABLE IF NOT EXISTS support_tickets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        parish_id VARCHAR(100) NOT NULL,
        subject VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'Open',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB
    `);
  } finally {
    initConnection.release();
  }

  await pool.query(`
    INSERT IGNORE INTO event_types (name, description) VALUES
      ('Wedding', 'Sacrament of Matrimony'),
      ('Baptism', 'Sacrament of Baptism'),
      ('Funeral', 'Funeral Mass'),
      ('Mass Intention', 'Requested Mass Intention')
  `);

  await pool.query(`
    INSERT IGNORE INTO users (name, email, password, role) VALUES
      ('Admin User', 'admin@parish.org', 'adminpass', 'admin'),
      ('User Test', 'user@parish.org', 'userpass', 'user')
  `);
}

