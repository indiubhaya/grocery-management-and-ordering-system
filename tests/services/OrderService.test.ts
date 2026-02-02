import { describe, it, expect, beforeEach } from 'vitest';
import { OrderService } from '../../src/services/OrderService';
import { ProductRepository } from '../../src/repository/ProductRepository';
import { PackageOptimizer } from '../../src/services/PackageOptimizer';

describe('OrderService', () => {
  let orderService: OrderService;
  let repository: ProductRepository;
  let optimizer: PackageOptimizer;

  beforeEach(() => {
    repository = new ProductRepository();
    repository.seedInitialProducts(); // seeds CE, HM, SS
    optimizer = new PackageOptimizer();
    orderService = new OrderService(repository, optimizer);
  });

  describe('processOrder', () => {
    it('should throw error for non-existent product', () => {
      const orderItems = [
        { productCode: 'INVALID', quantity: 10 }
      ];
      expect(() => orderService.processOrder(orderItems))
        .toThrow('Product INVALID not found');
    });
    it('should throw error for empty order', () => {
      const orderItems: any[] = [];
      expect(() => orderService.processOrder(orderItems))
        .toThrow('Order must contain at least one item');
    });
    it('should throw error for negative quantity', () => {
      const orderItems = [
        { productCode: 'CE', quantity: -5 }
      ];
      expect(() => orderService.processOrder(orderItems))
        .toThrow('Order quantity must be positive');
    });

    it('should process single item order', () => {
      const orderItems = [
        { productCode: 'CE', quantity: 10 }
      ];

      const result = orderService.processOrder(orderItems);

      expect(result.items).toHaveLength(1);
      expect(result.items[0].productCode).toBe('CE');
      expect(result.items[0].quantity).toBe(10);
      expect(result.totalCost).toBeCloseTo(20.95 * 2);
      expect(result.items[0].totalPackages).toBe(2);

      // Verify package breakdown
      expect(result.items[0].packageBreakdown).toBeDefined();
      expect(result.items[0].packageBreakdown.length).toBeGreaterThan(0);

      const breakdown = result.items[0].packageBreakdown[0];

      expect(breakdown).toHaveProperty('packageSize');
      expect(breakdown).toHaveProperty('noOfPackages');
      expect(breakdown).toHaveProperty('totalCost');
      expect(breakdown.packageSize).toBe(5);
      expect(breakdown.noOfPackages).toBe(2);
      expect(breakdown.totalCost).toBeCloseTo(20.95 * 2);
    });

    it('should process order from requirements: 10 CE, 14 HM, 3 SS and have correct total packages', () => {
      const orderItems = [
        { productCode: 'CE', quantity: 10 },
        { productCode: 'HM', quantity: 14 },
        { productCode: 'SS', quantity: 3 }
      ];

      const result = orderService.processOrder(orderItems);

      // Verify total
      expect(result.totalCost).toBeCloseTo(156.60);
      expect(result.items).toHaveLength(3);

      // Verify CE item (10 CE = 2×5 packages)
      const ceItem = result.items.find(i => i.productCode === 'CE');
      expect(ceItem).toBeDefined();
      expect(ceItem?.productName).toBe('Cheese');
      expect(ceItem?.quantity).toBe(10);
      expect(ceItem?.totalCost).toBeCloseTo(41.90);
      expect(ceItem?.totalPackages).toBe(2);

      const ceBreakdown = ceItem?.packageBreakdown;
      expect(ceBreakdown?.length).toBe(1);
      expect(ceBreakdown?.at(0)?.packageSize).toBe(5);
      expect(ceBreakdown?.at(0)?.noOfPackages).toBe(2);
      expect(ceBreakdown?.at(0)?.totalCost).toBeCloseTo(20.95 * 2);

      // Verify HM item (14 HM = 1x8 + 1x5 + 1 single)
      const hmItem = result.items.find(i => i.productCode === 'HM');
      expect(hmItem).toBeDefined();
      expect(hmItem?.productName).toBe('Ham');
      expect(hmItem?.quantity).toBe(14);
      expect(hmItem?.totalCost).toBeCloseTo(78.85);
      expect(hmItem?.totalPackages).toBe(3);

      const hmBreakdown = hmItem?.packageBreakdown;
      expect(hmBreakdown?.length).toBe(3);
      expect(hmBreakdown?.some(b => b.packageSize === 8 && b.noOfPackages === 1 && Math.abs(b.totalCost - 40.95) < 0.01)).toBe(true);
      expect(hmBreakdown?.some(b => b.packageSize === 5 && b.noOfPackages === 1 && Math.abs(b.totalCost - 29.95) < 0.01)).toBe(true);
      expect(hmBreakdown?.some(b => b.packageSize === 1 && b.noOfPackages === 1 && Math.abs(b.totalCost - 7.95) < 0.01)).toBe(true);

      // Verify SS item (3 SS = 3 singles)
      const ssItem = result.items.find(i => i.productCode === 'SS');
      expect(ssItem).toBeDefined();
      expect(ssItem?.productName).toBe('Soy Sauce');
      expect(ssItem?.quantity).toBe(3);
      expect(ssItem?.totalCost).toBeCloseTo(35.85);
      expect(ssItem?.totalPackages).toBe(3);

      const ssBreakdown = ssItem?.packageBreakdown;
      expect(ssBreakdown?.length).toBe(1);
      expect(ssBreakdown?.at(0)?.packageSize).toBe(1);
      expect(ssBreakdown?.at(0)?.noOfPackages).toBe(3);
      expect(ssBreakdown?.at(0)?.totalCost).toBeCloseTo(11.95 * 3);
    });
  });
});
