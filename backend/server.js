import { app } from './src/app.js';
import { testDatabaseConnection } from './src/config/database.js';
import { env } from './src/config/env.js';

const server = app.listen(env.port, () => {
  console.log(`HDHOME API: http://localhost:${env.port}`);
});

testDatabaseConnection()
  .then(() => console.log('Kết nối MySQL thành công.'))
  .catch((error) => console.warn(`API đã khởi động nhưng chưa kết nối được MySQL: ${error.message}`));

function shutdown() {
  server.close(() => process.exit(0));
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
