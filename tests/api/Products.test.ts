import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../../src/api/server';

describe('GET /api/products', () => {
  it('should return all products', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(response.body.products).toHaveLength(3);
  });
});

describe('GET /api/products/:code', () => {
  it('should return specific product', async () => {
    const response = await request(app).get('/api/products/CE');
    expect(response.status).toBe(200);
    expect(response.body.code).toBe('CE');
  });

  it('should return 404 for non-existent product', async () => {
    const response = await request(app).get('/api/products/INVALID');
    expect(response.status).toBe(404);
  });
});

describe('POST /api/products', () => {
  it('should create new product', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        code: 'BR',
        name: 'Bread',
        price: 3.95,
        packagingOptions: [
          { quantity: 6, price: 20.00 }
        ]
      });

    expect(response.status).toBe(201);
    expect(response.body.code).toBe('BR');
    expect(response.body.name).toBe('Bread');
  });

  it('should reject duplicate product code', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        code: 'CE',
        name: 'Duplicate',
        price: 1.00
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('already exists');
  });

  it('should reject missing required fields', async () => {
    const response = await request(app)
      .post('/api/products')
      .send({
        code: 'XX'
        // Missing name and price
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain('required fields');
  });
});

describe('PUT /api/products/:code', () => {
  it('should update existing product', async () => {
    // First create
    await request(app)
      .post('/api/products')
      .send({
        code: 'TEST',
        name: 'Test',
        price: 1.00
      });

    // Then update
    const response = await request(app)
      .put('/api/products/TEST')
      .send({
        name: 'Updated Test',
        price: 2.00,
        packagingOptions: [
          { quantity: 10, price: 15.00 }
        ]
      });

    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Updated Test');
    expect(response.body.price).toBe(2.00);
  });

  it('should return 404 for non-existent product', async () => {
    const response = await request(app)
      .put('/api/products/NOPE')
      .send({
        name: 'Test',
        price: 1.00
      });

    expect(response.status).toBe(404);
  });
});

describe('DELETE /api/products/:code', () => {
  it('should delete existing product', async () => {
    // First create
    await request(app)
      .post('/api/products')
      .send({
        code: 'DEL',
        name: 'To Delete',
        price: 1.00
      });

    // Then delete
    const deleteResponse = await request(app)
      .delete('/api/products/DEL');
    expect(deleteResponse.status).toBe(204);

    // Verify deleted
    const getResponse = await request(app)
      .get('/api/products/DEL');
    expect(getResponse.status).toBe(404);
  });

  it('should return 404 for non-existent product', async () => {
    const response = await request(app)
      .delete('/api/products/NOPE');

    expect(response.status).toBe(404);
  });
});
