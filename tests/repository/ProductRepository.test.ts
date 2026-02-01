import { beforeEach, describe, expect, it } from "vitest";
import { ProductRepository } from "../../src/repository/ProductRepository";

describe('InMemoryProductRepository', () => {
  let repo: ProductRepository;

  beforeEach(() => {
    repo = new ProductRepository();
  });
  
  describe('add (create) products', () => {
    it('should return null for non-existent product', () => {
      const product = repo.findByCode('INVALID_CODE');
      expect(product).toBeNull();
    });
    it('should find product by code', () => {
      const repo = new ProductRepository();
      const product = repo.findByCode('CE');
      
      expect(product).not.toBeNull();
      expect(product?.name).toBe('Cheese');
    });
  });
});
