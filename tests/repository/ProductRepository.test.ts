import { beforeEach, describe, expect, it } from "vitest";
import { ProductRepository } from "../../src/repository/ProductRepository";
import { Product } from "../../src/domain/Product";

describe('InMemoryProductRepository', () => {
  let repo: ProductRepository;

  beforeEach(() => {
    repo = new ProductRepository();
  });
  
  describe('add (create) products', () => {
    it('should support adding products to the repository', () => {
      const product = new Product('CE', 'Cheese', 5.99);
      expect(() => repo.addProduct(product)).not.toThrow();
    });
    it ('should not allow adding duplicate products', () => {
      const product = new Product('CE', 'Cheese', 5.99);
      repo.addProduct(product);
      expect(() => repo.addProduct(product)).toThrowError(`Product with code CE already exists.`);
    });
  });
  describe('retrieve products', () => {    
    it('should return null for non-existent product', () => {
      const product = repo.findByCode('INVALID_CODE');
      expect(product).toBeNull();
    });
    it('should find product by code', () => {
      const product = new Product('CE', 'Cheese', 5.99);
      repo.addProduct(product);
      const foundProduct = repo.findByCode('CE');
      
      expect(foundProduct).not.toBeNull();
      expect(foundProduct?.name).toBe('Cheese');
    });
    it('should return empty array when no products exist', () => {
      const products = repo.findAll();
      expect(products).toEqual([]);
    });
    it('should return all products', () => {
      const cheese = new Product('CE', 'Cheese', 5.95);
      const ham = new Product('HM', 'Ham', 7.95);
      
      repo.addProduct(cheese);
      repo.addProduct(ham);
      
      const products = repo.findAll();
      
      expect(products).toHaveLength(2);
      expect(products.map(p => p.code)).toContain('CE');
      expect(products.map(p => p.code)).toContain('HM');
    });
  });
  describe('update products', () => {
    it('should not allow updating non-existent products', () => {
      const product = new Product('CE', 'Prime Cheese', 15.99);
      expect(() => repo.updateProduct(product)).toThrowError(`Product with code CE does not exist.`);
    });it('should update existing product', () => {
      const cheese = new Product('CE', 'Cheese', 5.95);
      cheese.addPackagingOption(3, 14.95);
      repo.addProduct(cheese);
      
      // Create updated version
      const updatedCheese = new Product('CE', 'Premium Cheese', 7.95);
      updatedCheese.addPackagingOption(5, 30.00);
      
      repo.updateProduct(updatedCheese);
      const found = repo.findByCode('CE');
      
      expect(found?.name).toBe('Premium Cheese');
      expect(found?.price).toBe(7.95);
      expect(found?.getPackagingOptions()).toHaveLength(1);
      expect(found?.getPackagingOptions()[0].price).toBe(30.00);
    });
  });
  describe('delete', () => {
    it('should delete existing product', () => {
      const cheese = new Product('CE', 'Cheese', 5.95);
      repo.addProduct(cheese);
      
      repo.deleteProduct('CE');
      const found = repo.findByCode('CE');
      
      expect(found).toBeNull();
    });
    it('should not throw error when deleting non-existent product', () => {
      expect(() => repo.deleteProduct('INVALID')).not.toThrow();
    });
  });
  describe('seed data', () => {
    it('should have CE, HM, SS products pre-loaded', () => {
      const repo = new ProductRepository();
      repo.seedInitialProducts();
      expect(repo.findByCode('CE')).not.toBeNull();
      expect(repo.findByCode('HM')).not.toBeNull();
      expect(repo.findByCode('SS')).not.toBeNull();
      
      const allProducts = repo.findAll();
      expect(allProducts).toHaveLength(3);
    });
  });
});
