import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import pg from 'pg';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:3001';
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL required: this test must use Postgres.');
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const email = `neon-smoke-${randomUUID()}@example.com`;
let userId;
const post = (path, body, cookie) => fetch(base + path, { method: 'POST', headers: { 'Content-Type': 'application/json', ...(cookie ? { cookie } : {}) }, body: JSON.stringify(body) });
try {
  assert.equal((await fetch(base + '/')).status, 200);
  const dogs = await (await fetch(base + '/api/dogs')).json();
  assert.ok(dogs.dogs.length >= 30);
  console.log(`PASS built app serves frontend and ${dogs.dogs.length} Postgres dogs`);
  const application = await post('/api/applications', { name: 'Neon Smoke Test', email, dogId: 'buddy' });
  assert.equal(application.status, 201);
  const { id } = await application.json();
  assert.equal((await pool.query('SELECT dog_id FROM applications WHERE id=$1', [id])).rows[0].dog_id, 'buddy');
  const contact = await post('/api/contact', { name: 'Neon Smoke Test', email, message: 'Automated database integration verification.' });
  assert.equal(contact.status, 201);
  assert.equal((await pool.query('SELECT id FROM messages WHERE email=$1', [email])).rowCount, 1);
  console.log('PASS adoption and contact writes verified through a separate database connection');
  const password = randomUUID();
  const signup = await post('/api/auth/signup', { email, password });
  assert.equal(signup.status, 201);
  userId = (await signup.json()).user.id;
  let cookie = signup.headers.get('set-cookie').split(';')[0];
  assert.equal((await (await fetch(base + '/api/auth/me', { headers: { cookie } })).json()).user.id, userId);
  assert.equal((await pool.query('SELECT user_id FROM sessions WHERE user_id=$1', [userId])).rowCount, 1);
  const login = await post('/api/auth/login', { email, password }, cookie);
  assert.equal(login.status, 200);
  const oldCookie = cookie;
  cookie = login.headers.get('set-cookie').split(';')[0];
  assert.equal((await (await fetch(base + '/api/auth/me', { headers: { cookie: oldCookie } })).json()).user, null);
  assert.equal((await post('/api/auth/logout', {}, cookie)).status, 200);
  assert.equal((await (await fetch(base + '/api/auth/me', { headers: { cookie } })).json()).user, null);
  console.log('PASS signup, persisted session, login rotation and logout revocation');
} finally {
  // Delete only records created by this run.
  await pool.query('DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE email=$1)', [email]);
  for (const table of ['users', 'applications', 'messages']) await pool.query(`DELETE FROM ${table} WHERE email=$1`, [email]);
  await pool.end();
  console.log('Smoke-test records cleaned up.');
}
