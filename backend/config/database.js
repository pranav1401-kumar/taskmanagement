const mysql = require('mysql2');
const fs = require('fs');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'task_management',
  port: process.env.DB_PORT || 4000,  // TiDB Cloud uses 4000
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: {
    minVersion: 'TLSv1.2',
    // If TiDB Cloud provides a CA cert:
    // ca: fs.readFileSync('./ca.pem')
    rejectUnauthorized: true
  }
});

// Create database and tables if they don't exist
const initDatabase = async () => {
  try {
    const connection = await pool.promise().getConnection();

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.execute(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        effort_days INT NOT NULL DEFAULT 1,
        due_date DATE NOT NULL,
        status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    connection.release();
    console.log('[DB] ✅ Tables initialized successfully');
  } catch (error) {
    console.error('[DB] ❌ Initialization error:', {
      code: error.code,
      message: error.message,
      sqlState: error.sqlState
    });
  }
};

module.exports = { pool, initDatabase };
