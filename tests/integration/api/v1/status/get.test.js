describe('GET /api/v1/status', () => {
  test('should return status 200 and the correct response body', async () => {
    const response = await fetch('http://localhost:3000/api/v1/status');
    expect(response.status).toBe(200);

    const responseBody = await response.json();
    expect(responseBody.updated_at).toBeDefined();

    const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString(); // Verifica se a data é válida
    expect(responseBody.updated_at).toBe(parsedUpdatedAt);

    expect(responseBody.depedencies.database.version).toEqual("16.0"); // Verifica a versão do PostgreSQL

    expect(responseBody.depedencies.database.max_connections).toEqual(100); // Verifica se max_connections é um número positivo 

    expect(responseBody.depedencies.database.used_connections).toEqual(1); // Verifica se used_connections é um número não negativo

  });
});