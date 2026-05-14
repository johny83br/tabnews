import database from "infra/database";

async function cleanDatabase() {
  await database.query('drop schema public cascade; create schema public;');
}

beforeAll(async () => {
  await cleanDatabase();
});

describe('GET /api/v1/migrations', () => {
  test('should return status 200 and the correct response body', async () => {
    const response1 = await fetch('http://localhost:3000/api/v1/migrations', {
      method: 'POST'
    });
    expect(response1.status).toBe(201);

    const responseBody1 = await response1.json();
    expect(Array.isArray(responseBody1)).toBe(true);
    expect(responseBody1.length).toBeGreaterThan(0);

    const response2 = await fetch('http://localhost:3000/api/v1/migrations', {
      method: 'POST'
    });
    expect(response2.status).toBe(200);

    const responseBody2 = await response2.json();
    expect(Array.isArray(responseBody2)).toBe(true);
    expect(responseBody2.length).toBe(0);

  });

  test('should return object correct of the migration', async () => {
    const response = await fetch('http://localhost:3000/api/v1/migrations', {
      method: 'POST'
    });

    const responseBody = await response.json();

    responseBody.forEach(migration => {
      expect(migration).toEqual(
        expect.objectContaining({
          path: expect.any(String),
          name: expect.any(String),
          timestamp: expect.any(Number)
        })
      );
    });
  });

});