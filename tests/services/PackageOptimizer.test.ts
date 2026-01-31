import { describe, it, expect } from 'vitest';
import { Product } from '../../src/domain/Product';
import { PackageOptimizer } from '../../src/services/PackageOptimizer';

describe('PackageOptimizer', () => {
  const optimizer = new PackageOptimizer();

  it('should handle zero quantity', () => {
    const product = new Product('SS', 'Soy Sauce', 11.95);

    const order = optimizer.optimize(product, 0);

    expect(order.totalCost).toBe(0);
    expect(order.totalPackages).toBe(0);
    expect(order.packageBreakdown.length).toBe(0);
  });
});