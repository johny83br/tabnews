describe('GET /api/v1/status', () => {
  test('should return status 200 and the correct response body', async () => {
    const response = await fetch('http://localhost:3000/api/v1/status');
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ status: "Jônata" });
  });
});