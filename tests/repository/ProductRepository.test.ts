import { describe, expect, it } from "vitest";
import { ProductRepository } from "../../src/repository/ProductRepository";

describe('InMemoryProductRepository', () => {
    
  it('should return null for non-existent product', () => {
    const repo = new ProductRepository();
    const product = repo.findByCode('INVALID');
    
    expect(product).toBeNull();
  });
  it('should find product by code', () => {
    const repo = new ProductRepository();
    const product = repo.findByCode('CE');
    
    expect(product).not.toBeNull();
    expect(product?.name).toBe('Cheese');
  });  
});