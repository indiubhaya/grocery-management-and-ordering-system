import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/api/Server';

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const response = await request(app)
      .get('/api/products');

    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(3);
    expect(response.body.products.map((p: any) => p.code)).toContain('CE');
  });
});

describe('GET /api/products/:code', () => {
  it('should return specific product', async () => {
    const response = await request(app)
      .get('/api/products/CE');

    expect(response.status).toBe(200);
    expect(response.body.code).toBe('CE');
    expect(response.body.name).toBe('Cheese');
    expect(response.body.price).toBe(5.95);
  });

  it('should return 404 for invalid product code', async () => {
    const response = await request(app)
      .get('/api/products/INVALID');

    expect(response.status).toBe(404);
    expect(response.body.error).toContain('not found');
  });
});
