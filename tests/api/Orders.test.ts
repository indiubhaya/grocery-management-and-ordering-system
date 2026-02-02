import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { app } from '../../src/api/Server';

describe('POST /api/orders', () => {
  it('should process requirements example correctly', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { productCode: 'CE', quantity: 10 },
          { productCode: 'HM', quantity: 14 },
          { productCode: 'SS', quantity: 3 }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body.totalCost).toBeCloseTo(156.60, 2);
    expect(response.body.items).toHaveLength(3);
  });

  it('should return 400 for invalid product code', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        items: [
          { productCode: 'INVALID', quantity: 10 }
        ]
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('not found');
  });

  it('should return 400 for invalid request body', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error).toBeDefined();
  });
});
