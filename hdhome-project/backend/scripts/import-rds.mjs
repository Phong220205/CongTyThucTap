import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

const envPath = path.resolve('../.env.import');
const env = fs.readFileSync(envPath, 'utf8')
  .split(/\r?\n/)
  .filter((l) => l && !l.startsWith('#'))
  .reduce((o, l) => {
    const [k, v] = l.split('=');
    o[k.trim()] = v.trim();
    return o;
  }, {});

console.log(`Connecting to ${env.DB_HOST}:${env.DB_PORT} as ${env.DB_USER}...`);
const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  ssl: { rejectUnauthorized: false },
  multipleStatements: true,
});
console.log('OK Connected');

const initPath = path.resolve('./database/init.sql');
const sql = fs.readFileSync(initPath, 'utf8');
console.log(`Importing ${sql.length} bytes from init.sql...`);
await conn.query(sql);
console.log('OK Schema + seed imported');

const [tables] = await conn.query('SHOW TABLES');
console.log(`OK ${tables.length} tables: ${tables.map((r) => Object.values(r)[0]).join(', ')}`);

const [[u]] = await conn.query('SELECT COUNT(*) AS c FROM users');
console.log(`OK Users: ${u.c}`);

const [[p]] = await conn.query('SELECT COUNT(*) AS c FROM projects');
console.log(`OK Projects: ${p.c}`);

const [[r]] = await conn.query('SELECT COUNT(*) AS c FROM roles');
console.log(`OK Roles: ${r.c}`);

await conn.end();
console.log('DONE');