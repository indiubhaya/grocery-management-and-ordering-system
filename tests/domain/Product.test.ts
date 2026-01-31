import { describe, it, expect } from 'vitest';
import { Product } from '../../src/domain/Product';

describe('Product', () => {
  describe('creation', () => {
    it('should create a product with code, name, and price', () => {
      const product = new Product('CE', 'Cheese', 5.95);
      
      expect(product.code).toBe('CE');
      expect(product.name).toBe('Cheese');
      expect(product.price).toBe(5.95);
    });
  });
});