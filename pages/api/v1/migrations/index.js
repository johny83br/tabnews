import migrationsRunner from 'node-pg-migrate';
import { join } from 'node:path';
import database from 'infra/database';


export default async function migrations(request, response) {

  const allowedMethods = ['GET', 'POST'];

  if (!allowedMethods.includes(request.method))
    return response.status(405).json({ error: `Method ${request.method} not allowed` }).end();

  let dbClient;

  try {

    dbClient = await database.getNewClient();

    const MIGRATIONS_RUNNER = {
      dbClient: dbClient,
      dryRun: true,
      dir: join('infra', 'migrations'),
      direction: 'up',
      verbose: true,
      migrationsTable: 'pgmigrations',
    };

    if (request.method === 'GET') {
      const pendingMigrations = await migrationsRunner(MIGRATIONS_RUNNER);
      return response.status(200).json(pendingMigrations);
    }

    if (request.method === 'POST') {
      const migratedMigrations = await migrationsRunner({
        ...MIGRATIONS_RUNNER,
        dryRun: false
      });

      if (migratedMigrations.length > 0)
        return response.status(201).json(migratedMigrations);

      return response.status(200).json(migratedMigrations);
    }

  } catch (error) {
    console.error(error);
    throw error;
  } finally {
    await dbClient.end();
  }

}