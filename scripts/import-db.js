// Import HDHOME schema & seed vào MySQL bên ngoài (Aiven, PlanetScale, etc.)
// Dùng: node scripts/import-db.js

import 'dotenv/config';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import mysql from 'mysql2/promise';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const DB_HOST = process.env.DB_HOST;
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME || 'defaultdb';
const DB_SSL = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';
const SCHEMA_FILE = process.env.SCHEMA_FILE
  || path.resolve(__dirname, '../backend/database/schema.sql');
const SEED_FILE = process.env.SEED_FILE
  || path.resolve(__dirname, '../backend/database/seed.sql');

function splitStatements(sql) {
  // Bỏ comments dòng, giữ nguyên cấu trúc statement
  const noComments = sql
    .split('\n')
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  // Tách theo `;` ở cuối dòng, bỏ chuỗi rỗng
  return noComments
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !/^\s*$/.test(s));
}

function filterForDatabase(sql, dbName) {
  return sql
    .replace(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+\w+[^;]*;/gi, '')
    .replace(/USE\s+\w+;/gi, '')
    .replace(/\bhdhome_management\b/g, dbName);
}

async function main() {
  if (!DB_HOST || !DB_USER || !DB_PASSWORD) {
    console.error('Thiếu DB_HOST/DB_USER/DB_PASSWORD. Tạo file .env hoặc truyền biến môi trường.');
    console.error('Ví dụ:');
    console.error('  DB_HOST=... DB_PORT=... DB_USER=avnadmin DB_PASSWORD=... node scripts/import-db.js');
    process.exit(1);
  }

  console.log('========================================');
  console.log('HDHOME DB Import');
  console.log('========================================');
  console.log(`Host:     ${DB_HOST}`);
  console.log(`Port:     ${DB_PORT}`);
  console.log(`User:     ${DB_USER}`);
  console.log(`Database: ${DB_NAME}`);
  console.log(`SSL:      ${DB_SSL}`);
  console.log('');

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: false,
    ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
  });

  try {
    // 1. Switch sang database đích
    console.log(`[1/3] USE ${DB_NAME};`);
    await conn.query(`USE \`${DB_NAME}\`;`);
    console.log('  OK');

    // 2. Import schema
    console.log(`[2/3] Importing schema from ${SCHEMA_FILE}`);
    let schemaSql = readFileSync(SCHEMA_FILE, 'utf8');
    schemaSql = filterForDatabase(schemaSql, DB_NAME);
    const schemaStatements = splitStatements(schemaSql);
    console.log(`  Found ${schemaStatements.length} statements`);
    let ok = 0;
    let err = 0;
    for (const stmt of schemaStatements) {
      try {
        await conn.query(stmt);
        ok++;
      } catch (e) {
        err++;
        console.warn(`  ! Lỗi statement: ${stmt.slice(0, 80)}...`);
        console.warn(`    ${e.code || e.message}`);
      }
    }
    console.log(`  Schema: ${ok} OK, ${err} errors`);

    // 3. Import seed
    console.log(`[3/3] Importing seed from ${SEED_FILE}`);
    let seedSql = readFileSync(SEED_FILE, 'utf8');
    seedSql = filterForDatabase(seedSql, DB_NAME);
    const seedStatements = splitStatements(seedSql);
    console.log(`  Found ${seedStatements.length} statements`);
    ok = 0;
    err = 0;
    for (const stmt of seedStatements) {
      try {
        await conn.query(stmt);
        ok++;
      } catch (e) {
        err++;
        console.warn(`  ! Lỗi statement: ${stmt.slice(0, 80)}...`);
        console.warn(`    ${e.code || e.message}`);
      }
    }
    console.log(`  Seed: ${ok} OK, ${err} errors`);

    // Kiểm tra
    const [tables] = await conn.query('SHOW TABLES');
    console.log('\n✓ Database đã sẵn sàng. Tables:');
    for (const row of tables) {
      console.log(`  - ${Object.values(row)[0]}`);
    }
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Lỗi:', err.message);
  process.exit(1);
});
