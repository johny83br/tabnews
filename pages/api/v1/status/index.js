import database from "infra/database";

async function status(request, response) {

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    depedencies: {
      database: {
        version: await database.getVersion(),
        max_connections: await database.getMaxConnections(),
        used_connections: await database.getUsedConnections()
      }
    }
  });
}

export default status;