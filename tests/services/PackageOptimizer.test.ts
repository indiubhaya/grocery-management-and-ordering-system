import { describe, it, expect } from 'vitest';
import { Product } from '../../src/domain/Product';
import { PackageOptimizer } from '../../src/services/PackageOptimizer';

describe('PackageOptimizer', () => {
  const optimizer = new PackageOptimizer();
  it('should reject negative quantity', () => {
    const product = new Product('SS', 'Soy Sauce', 11.95);
    expect(() => optimizer.optimize(product, -5))
        .toThrow('Order quantity must be positive');
  });
  it('should handle zero quantity', () => {
    const product = new Product('SS', 'Soy Sauce', 11.95);

    const order = optimizer.optimize(product, 0);

    expect(order?.totalCost).toBe(0);
    expect(order?.totalPackages).toBe(0);
    expect(order?.packageBreakdown.length).toBe(0);
  });
  it('should handle a single item of products without packaging options', () => {
    const product = new Product('SS', 'Soy Sauce', 11.95);

    const order = optimizer.optimize(product, 1);

    expect(order?.totalCost).toBe(11.95);
    expect(order?.totalPackages).toBe(1);
    expect(order?.packageBreakdown.length).toBe(1);
    expect(order?.packageBreakdown[0]).toEqual({ packageSize: 1, noOfPackages: 1, totalCost: 11.95 });
  });  
  it('should handle multiple items of products without packaging options', () => {
    const product = new Product('SS', 'Soy Sauce', 11.95);

    const order = optimizer.optimize(product, 10);

    expect(order?.totalCost).toBe(119.5);
    expect(order?.totalPackages).toBe(10);
    expect(order?.packageBreakdown.length).toBe(1);
    expect(order?.packageBreakdown[0]).toEqual({ packageSize: 1, noOfPackages: 10, totalCost: 119.5 });
  });
  it('should handle a single item of product with packaging options', () => {
    const product = new Product('CE', 'Cheese', 5.95);
    product.addPackagingOption(3, 14.95);
    product.addPackagingOption(5, 20.95);

    const order = optimizer.optimize(product, 1);

    expect(order?.totalCost).toBe(5.95);
    expect(order?.totalPackages).toBe(1);
    expect(order?.packageBreakdown.length).toBe(1);
    expect(order?.packageBreakdown[0]).toEqual({ packageSize: 1, noOfPackages: 1, totalCost: 5.95 });
  });
  it('should handle multiple items but less than smallest packaging size of product with packaging options', () => {
    const product = new Product('CE', 'Cheese', 5.95);
    product.addPackagingOption(3, 14.95);
    product.addPackagingOption(5, 20.95); 

    const order = optimizer.optimize(product, 2);

    expect(order?.totalCost).toBe(11.9);
    expect(order?.totalPackages).toBe(2);
    expect(order?.packageBreakdown.length).toBe(1);
    expect(order?.packageBreakdown[0]).toEqual({ packageSize: 1, noOfPackages: 2, totalCost: 11.9 });
  });
  it('should optimize packaging of largest package size for product with packaging options', () => {
    const product = new Product('CE', 'Cheese', 5.95);
    product.addPackagingOption(3, 14.95);
    product.addPackagingOption(5, 20.95);

    const order = optimizer.optimize(product, 10);

    expect(order?.totalCost).toBe(41.9);
    expect(order?.totalPackages).toBe(2);
    expect(order?.packageBreakdown.length).toBe(1);
    expect(order?.packageBreakdown[0]).toEqual({ packageSize: 5, noOfPackages: 2, totalCost: 41.9 });
  });
});
