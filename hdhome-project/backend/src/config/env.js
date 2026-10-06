import dotenv from 'dotenv';

dotenv.config();

// Support 2 modes:
// 1. DATABASE_URL (Render Postgres, PlanetScale, etc.) - takes priority
// 2. Individual vars DB_HOST/DB_USER/... (local dev, AWS RDS)
function parseDatabaseUrl(url) {
  // mysql://user:password@host:port/database?ssl-mode=REQUIRED
  const m = url.match(/^mysql:\/\/([^:]+):([^@]+)@([^:/]+):(\d+)\/([^?]+)(\?.*)?$/);
  if (!m) return null;
  return {
    user: decodeURIComponent(m[1]),
    password: decodeURIComponent(m[2]),
    host: m[3],
    port: Number(m[4]),
    database: m[5],
  };
}

const dbFromUrl = process.env.DATABASE_URL ? parseDatabaseUrl(process.env.DATABASE_URL) : null;

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: {
    host: dbFromUrl?.host || process.env.DB_HOST || 'localhost',
    port: dbFromUrl?.port || Number(process.env.DB_PORT || 3306),
    user: dbFromUrl?.user || process.env.DB_USER || 'root',
    password: dbFromUrl?.password || process.env.DB_PASSWORD || '',
    database: dbFromUrl?.database || process.env.DB_NAME || 'hdhome_management',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  },
  // DB_SSL is auto-set true when DATABASE_URL is from Render; otherwise explicit
  dbSsl: Boolean(dbFromUrl) || String(process.env.DB_SSL || '').toLowerCase() === 'true',
  jwtSecret: process.env.JWT_SECRET || 'change_me_to_a_long_random_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024),
};

if (env.nodeEnv === 'production' && env.jwtSecret.startsWith('change_me')) {
  throw new Error('JWT_SECRET phải được thay đổi trong môi trường production.');
}
