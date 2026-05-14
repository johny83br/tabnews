import { Client } from "pg";

let client;

async function query(sql, params) {

  try {
    client = await getNewClient();
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
  client.end();
  return result.rows[0].server_version;
}

async function getMaxConnections() {
  const result = await query('SHOW max_connections');
  client.end();
  return parseInt(result.rows[0].max_connections);
}

async function getUsedConnections() {
  const result = await query({
    text: 'SELECT COUNT(*)::int FROM pg_stat_activity WHERE datname = $1',
    values: [process.env.POSTGRES_DB]
  });
  client.end();
  return result.rows[0].count;
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: process.env.NODE_ENV === "production" ? { ca: process.env.DATABASE_CA } : false
  });

  await client.connect();
  return client;
}

export default {
  query,
  getNewClient,
  getVersion,
  getMaxConnections,
  getUsedConnections
}