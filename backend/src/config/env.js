import dotenv from 'dotenv';

dotenv.config();

export const env = {
  port: Number(process.env.PORT || 5000),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173',
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'hdhome_management',
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT || 10),
  },
  jwtSecret: process.env.JWT_SECRET || 'change_me_to_a_long_random_secret',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  uploadDir: process.env.UPLOAD_DIR || 'uploads',
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 10 * 1024 * 1024),
};

if (env.nodeEnv === 'production' && env.jwtSecret.startsWith('change_me')) {
  throw new Error('JWT_SECRET phải được thay đổi trong môi trường production.');
}
