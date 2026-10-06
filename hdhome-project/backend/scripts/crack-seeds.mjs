import bcrypt from 'bcrypt';
import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';

const envPath = path.resolve('../.env.import');
const env = fs.readFileSync(envPath, 'utf8')
  .split(/\r?\n/)
  .filter((l) => l && !l.startsWith('#'))
  .reduce((o, l) => { const [k, v] = l.split('='); o[k.trim()] = v.trim(); return o; }, {});

const conn = await mysql.createConnection({
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: 'hdhome_management',
  ssl: { rejectUnauthorized: false },
});

const [users] = await conn.query('SELECT user_id, username, password_hash, role_id FROM users');
const passwords = [
  'admin123', 'manager123', 'technical123',
  'Hdhome@2026', 'hdhome123', 'Admin@123',
  'password', 'changeme', 'demo1234',
  'admin', 'manager', 'technical',
  'Hdhome2026', 'hdhome2026', 'demo2026',
  'P@ssw0rd', 'qwerty', '12345678',
  'demo@2026', 'demo@123', 'Hdhome@123',
];

for (const u of users) {
  let found = null;
  for (const pw of passwords) {
    if (await bcrypt.compare(pw, u.password_hash)) {
      found = pw;
      break;
    }
  }
  console.log(`${u.username} (role_id=${u.role_id}): ${found ?? '?? NOT IN LIST'}`);
}

await conn.end();