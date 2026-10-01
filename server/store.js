import { DatabaseSync } from 'node:sqlite';
import { mkdirSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

export function createStore(filename) {
  if (filename !== ':memory:') mkdirSync(dirname(resolve(filename)), { recursive: true, mode: 0o700 });
  const db = new DatabaseSync(filename);
  db.exec(`
    PRAGMA journal_mode=WAL;
    PRAGMA foreign_keys=ON;
    PRAGMA busy_timeout=5000;
    CREATE TABLE IF NOT EXISTS dogs (id TEXT PRIMARY KEY, name TEXT NOT NULL, breed TEXT NOT NULL, age TEXT NOT NULL, image TEXT NOT NULL, featured INTEGER NOT NULL, catalog INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS applications (id TEXT PRIMARY KEY, dog_id TEXT REFERENCES dogs(id), name TEXT NOT NULL, email TEXT NOT NULL, phone TEXT NOT NULL, address TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL, message TEXT NOT NULL, created_at TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL);
    CREATE TABLE IF NOT EXISTS sessions (token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id), expires_at INTEGER NOT NULL);
    CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY);
  `);
  if (!db.prepare('SELECT name FROM migrations WHERE name = ?').get('original-dogs-v1')) {
    const dogs = JSON.parse(readFileSync(new URL('./dogs.json', import.meta.url), 'utf8'));
    const insert = db.prepare('INSERT OR IGNORE INTO dogs VALUES (?, ?, ?, ?, ?, ?, ?)');
    db.exec('BEGIN');
    try {
      for (const dog of dogs) insert.run(dog.id, dog.name, dog.breed, dog.age, dog.image, Number(dog.featured), Number(dog.catalog));
      db.prepare('INSERT INTO migrations VALUES (?)').run('original-dogs-v1');
      db.exec('COMMIT');
    } catch (error) { db.exec('ROLLBACK'); throw error; }
  }
  return db;
}
