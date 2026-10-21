import pg from 'pg';
import { readFile } from 'node:fs/promises';

if (!process.env.DATABASE_URL_UNPOOLED) throw new Error('DATABASE_URL_UNPOOLED is required for migrations. Run neon deploy first.');
const client = new pg.Client({ connectionString: process.env.DATABASE_URL_UNPOOLED, connectionTimeoutMillis: 15000 });
try {
  await client.connect();
  await client.query('BEGIN');
  await client.query("SELECT pg_advisory_xact_lock(724913602)");
  await client.query('CREATE TABLE IF NOT EXISTS dogadopt_migrations (name TEXT PRIMARY KEY)');
  const name = '001-initial';
  if (!(await client.query('SELECT name FROM dogadopt_migrations WHERE name = $1', [name])).rowCount) {
    await client.query(await readFile(new URL('../server/migrations/001-initial.sql', import.meta.url), 'utf8'));
    const dogs = JSON.parse(await readFile(new URL('../server/dogs.json', import.meta.url), 'utf8'));
    for (const [order, dog] of dogs.entries()) {
      await client.query('INSERT INTO dogs (id,name,breed,age,image,featured,catalog,sort_order) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) ON CONFLICT (id) DO NOTHING', [dog.id,dog.name,dog.breed,dog.age,dog.image,Number(dog.featured),Number(dog.catalog),order]);
    }
    await client.query('INSERT INTO dogadopt_migrations VALUES ($1)', [name]);
    console.log(`Applied ${name}; seeded ${dogs.length} dogs.`);
  } else console.log(`${name} already applied.`);
  await client.query('COMMIT');
} catch (error) {
  await client.query('ROLLBACK').catch(() => {});
  console.error('Migration failed:', error.code || error.name);
  process.exitCode = 1;
} finally { await client.end(); }
