import { Client } from "pg";

async function query(sql, params) {

  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });

  try {
    await client.connect();
    const result = await client.query(sql, params);
    return result;
  } catch (error) {
    console.error('Error occurred while querying the database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

async function getVersion() {
  const result = await query('SHOW server_version');
  return result.rows[0].server_version;
}

async function getMaxConnections() {
  const result = await query('SHOW max_connections');
  return parseInt(result.rows[0].max_connections);
}

async function getUsedConnections() {
  const result = await query({
    text: 'SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1',
    values: [process.env.POSTGRES_DB]
  });
  return result.rows[0].count;
}

export default {
  query: query,
  getVersion: getVersion,
  getMaxConnections: getMaxConnections,
  getUsedConnections: getUsedConnections
}