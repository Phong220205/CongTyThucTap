import mysql from 'mysql2/promise';
import { env } from './env.js';

const useSsl = env.dbSsl;

export const pool = mysql.createPool({
  ...env.db,
  waitForConnections: true,
  queueLimit: 0,
  dateStrings: true,
  decimalNumbers: true,
  charset: 'utf8mb4',
  ssl: useSsl ? { rejectUnauthorized: false } : undefined,
});

export async function testDatabaseConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
  } finally {
    connection.release();
  }
}
