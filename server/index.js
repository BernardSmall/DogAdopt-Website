import { resolve } from 'node:path';
import { createStore } from './store.js';
import { createApp } from './app.js';

const port = Number(process.env.PORT || 3001);
// Bind all interfaces for Render; intentionally ignore any HOST environment variable.
const host = '0.0.0.0';
const sessionDays = Number(process.env.SESSION_DAYS || 7);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('PORT must be between 1 and 65535.');
}

if (!Number.isFinite(sessionDays) || sessionDays <= 0 || sessionDays > 365) {
  throw new Error('SESSION_DAYS must be between 0 and 365.');
}

const origins = (
  process.env.ALLOWED_ORIGINS ||
  `http://localhost:5173,http://127.0.0.1:5173,http://localhost:${port},http://127.0.0.1:${port}`
)
  .split(',')
  .map((s) => s.trim());

const db = createStore(
  resolve(process.env.DATABASE_PATH || './data/dogadopt.sqlite')
);

const app = createApp(db, {
  origins,
  sessionDays,
  secureCookie: process.env.COOKIE_SECURE === 'true',
});

const server = app.listen(port, host, () => {
  console.log(`DogAdopt API running on ${host}:${port}`);
});

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () =>
    server.close(() => {
      db.close();
      process.exit(0);
    })
  );
}
