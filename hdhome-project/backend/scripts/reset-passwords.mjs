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

// Reset all 3 users to known passwords
const newPasswords = {
  admin: 'Admin@123',
  projectmanager: 'Manager@123',
  technical: 'Technical@123',
};

for (const [username, pw] of Object.entries(newPasswords)) {
  const hash = await bcrypt.hash(pw, 10);
  await conn.query('UPDATE users SET password_hash = ? WHERE username = ?', [hash, username]);
  console.log(`RESET ${username} => ${pw}`);
}

// Verify
const [users] = await conn.query('SELECT username, password_hash FROM users');
for (const u of users) {
  for (const pw of Object.values(newPasswords)) {
    if (await bcrypt.compare(pw, u.password_hash)) {
      console.log(`VERIFY ${u.username} => ${pw} OK`);
      break;
    }
  }
}

await conn.end();
console.log('DONE');