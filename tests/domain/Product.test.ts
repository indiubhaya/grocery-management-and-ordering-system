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

  describe('validation', () => {
    it('should reject empty code', () => {
      expect(() => new Product('', 'Cheese', 5.95))
        .toThrow('Product code cannot be empty');
    });

    it('should reject whitespace only code', () => {
      expect(() => new Product('  ', 'Cheese', 5.95))
        .toThrow('Product code cannot be empty');
    });

    it('should reject empty name', () => {
      expect(() => new Product('CE', '', 5.95))
        .toThrow('Product name cannot be empty');
    });

    it('should reject whitespace only name', () => {
      expect(() => new Product('CE', '   ', 5.95))
        .toThrow('Product name cannot be empty');
    });

    it('should reject negative price', () => {
      expect(() => new Product('CE', 'Cheese', -1))
        .toThrow('Price must be positive');
    });

    it('should reject zero price', () => {
      expect(() => new Product('CE', 'Cheese', 0))
        .toThrow('Price must be positive');
    });

    it('should accept valid product', () => {
      expect(() => new Product('CE', 'Cheese', 5.95))
        .not.toThrow();
    });
  });

  describe("packaging options", () => {
    it("should be possible to have no packaging options defined", () => {
      const product = new Product("CE", "Cheese", 5.95);

      expect(product.getPackagingOptions()).toEqual([]);
    });

    it("should be possible to add packaging options", () => {
      const product = new Product("CE", "Cheese", 5.95);

      product.addPackagingOption(3, 14.95);
      const options = product.getPackagingOptions();
      expect(options).toHaveLength(1);
      expect(options[0]).toEqual({ quantity: 3, price: 14.95 });
    });

    it("should be possible to add multiple packaging options", () => {
      const product = new Product("CE", "Cheese", 5.95);

      product.addPackagingOption(3, 14.95);
      product.addPackagingOption(5, 20.95);

      const options = product.getPackagingOptions();
      expect(options).toHaveLength(2);
      expect(options[0]).toEqual({ quantity: 3, price: 14.95 });
      expect(options[1]).toEqual({ quantity: 5, price: 20.95 });
    });

    it('should fail packaging with zero quantity', () => {
      const product = new Product('CE', 'Cheese', 5.95);
      
      expect(() => product.addPackagingOption(0, 10.00))
        .toThrow('Package quantity must be positive');
    });

    it('should fail packaging with negative quantity', () => {
      const product = new Product('CE', 'Cheese', 5.95);
      
      expect(() => product.addPackagingOption(-5, 10.00))
        .toThrow('Package quantity must be positive');
    });

    it('should fail packaging with zero price', () => {
      const product = new Product('CE', 'Cheese', 5.95);
      
      expect(() => product.addPackagingOption(5, 0))
        .toThrow('Price must be positive');
    });

    it('should fail packaging with negative price', () => {
      const product = new Product('CE', 'Cheese', 5.95);
      
      expect(() => product.addPackagingOption(5, -10))
        .toThrow('Price must be positive');
    });
  });
});