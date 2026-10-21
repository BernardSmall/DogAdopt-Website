import pg from 'pg';

// One pool per server process. DATABASE_URL stays exclusively on the server.
export async function createPostgresStore(connectionString) {
  const pool = new pg.Pool({ connectionString, max: 10, connectionTimeoutMillis: 15000 });
  pool.on('error', error => console.error('Idle database connection failed:', error.code || error.name));
  try { await pool.query('SELECT 1'); }
  catch (error) { await pool.end(); throw error; }
  return {
    prepare(sql) {
      let parameter = 0;
      const query = sql.replace(/\?/g, () => `$${++parameter}`);
      return {
        async all(...values) { return (await pool.query(query, values)).rows; },
        async get(...values) { return (await pool.query(query, values)).rows[0]; },
        async run(...values) { return pool.query(query, values); },
      };
    },
    close() { return pool.end(); },
  };
}
