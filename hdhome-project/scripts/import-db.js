// Import HDHOME schema & seed vào MySQL bên ngoài (Aiven, PlanetScale, etc.)
// Dùng: node scripts/import-db.js
// Hoặc: node scripts/import-db.js path/to/.env

import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..');
const BACKEND_DIR = path.join(PROJECT_ROOT, 'backend');

// Load .env từ file (ưu tiên file được truyền vào, sau đó .env.import ở root, cuối cùng backend/.env)
function loadEnv() {
  const argFile = process.argv[2];
  const candidates = [
    argFile && path.resolve(argFile),
    path.join(PROJECT_ROOT, '.env.import'),
    path.join(PROJECT_ROOT, '.env'),
    path.join(BACKEND_DIR, '.env'),
  ].filter(Boolean);
  for (const p of candidates) {
    if (!existsSync(p)) continue;
    const txt = readFileSync(p, 'utf8');
    for (const line of txt.split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
      if (!m) continue;
      const [, key, raw] = m;
      if (process.env[key]) continue;
      let val = raw;
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
    return p;
  }
  return null;
}

const ENV_FILE = loadEnv();

// Import mysql2 (cài ở root hoặc backend)
import mysql from 'mysql2/promise';

const SCHEMA_FILE = process.env.SCHEMA_FILE
  || path.join(BACKEND_DIR, 'database', 'schema.sql');
const SEED_FILE = process.env.SEED_FILE
  || path.join(BACKEND_DIR, 'database', 'seed.sql');

function splitStatements(sql) {
  // Bỏ comments dòng bắt đầu bằng --
  const noComments = sql
    .split(/\r?\n/)
    .filter((line) => !line.trim().startsWith('--'))
    .join('\n');

  // Tách theo `;` ở cuối dòng
  return noComments
    .split(/;\s*(?:\r?\n|$)/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

function filterForDatabase(sql, dbName) {
  return sql
    .replace(/CREATE\s+DATABASE[^;]*;/gi, '')
    .replace(/USE\s+[\w`"-]+;?/gi, '')
    .replace(/\bhdhome_management\b/g, dbName);
}

async function main() {
  if (!process.env.DB_HOST || !process.env.DB_USER || !process.env.DB_PASSWORD) {
    console.error('Thiếu DB_HOST/DB_USER/DB_PASSWORD.');
    console.error('Tạo file .env.import ở project root hoặc truyền file env làm tham số.');
    console.error('Ví dụ: node scripts/import-db.js .env.import');
    process.exit(1);
  }

  const DB_HOST = process.env.DB_HOST;
  const DB_PORT = Number(process.env.DB_PORT || 3306);
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  const DB_NAME = process.env.DB_NAME || 'defaultdb';
  const DB_SSL = String(process.env.DB_SSL || 'false').toLowerCase() === 'true';

  console.log('========================================');
  console.log('HDHOME DB Import');
  console.log('========================================');
  if (ENV_FILE) console.log(`Env file:  ${ENV_FILE}`);
  console.log(`Host:      ${DB_HOST}`);
  console.log(`Port:      ${DB_PORT}`);
  console.log(`User:      ${DB_USER}`);
  console.log(`Database:  ${DB_NAME}`);
  console.log(`SSL:       ${DB_SSL}`);
  console.log('');

  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: false,
    ssl: DB_SSL ? { rejectUnauthorized: false } : undefined,
  });

  let totalOk = 0;
  let totalErr = 0;

  try {
    console.log(`[1/3] USE \`${DB_NAME}\``);
    await conn.query(`USE \`${DB_NAME}\`;`);

    if (!existsSync(SCHEMA_FILE)) {
      throw new Error(`Không tìm thấy schema file: ${SCHEMA_FILE}`);
    }
    console.log(`[2/3] Importing schema from ${path.relative(PROJECT_ROOT, SCHEMA_FILE)}`);
    let schemaSql = readFileSync(SCHEMA_FILE, 'utf8');
    schemaSql = filterForDatabase(schemaSql, DB_NAME);
    const schemaStatements = splitStatements(schemaSql);
    console.log(`  Found ${schemaStatements.length} statements`);
    for (const stmt of schemaStatements) {
      try {
        await conn.query(stmt);
        totalOk++;
      } catch (e) {
        totalErr++;
        console.warn(`  ! ${e.code || 'ERR'}: ${stmt.slice(0, 70).replace(/\s+/g, ' ')}...`);
        console.warn(`    ${e.message.split('\n')[0]}`);
      }
    }
    console.log(`  Schema: ${schemaStatements.length - totalErr} OK, ${totalErr} errors`);

    const seedErr = totalErr;
    if (existsSync(SEED_FILE)) {
      console.log(`[3/3] Importing seed from ${path.relative(PROJECT_ROOT, SEED_FILE)}`);
      let seedSql = readFileSync(SEED_FILE, 'utf8');
      seedSql = filterForDatabase(seedSql, DB_NAME);
      const seedStatements = splitStatements(seedSql);
      console.log(`  Found ${seedStatements.length} statements`);
      let ok = 0;
      let err = 0;
      for (const stmt of seedStatements) {
        try {
          await conn.query(stmt);
          ok++;
        } catch (e) {
          err++;
          if (err <= 5) {
            console.warn(`  ! ${e.code || 'ERR'}: ${stmt.slice(0, 70).replace(/\s+/g, ' ')}...`);
          }
        }
      }
      console.log(`  Seed: ${ok} OK, ${err} errors`);
      totalOk += ok;
      totalErr = err;
    } else {
      console.log(`[3/3] No seed file found at ${SEED_FILE}, skipping`);
    }

    console.log('');
    const [tables] = await conn.query('SHOW TABLES');
    console.log(`✓ Database đã sẵn sàng. ${tables.length} tables:`);
    for (const row of tables) {
      console.log(`  - ${Object.values(row)[0]}`);
    }
    console.log('');
    console.log(`Tổng: ${totalOk} OK, ${totalErr} errors`);
  } finally {
    await conn.end();
  }
}

main().catch((err) => {
  console.error('Lỗi:', err.message);
  process.exit(1);
});
