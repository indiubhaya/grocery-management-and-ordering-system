import { describe, it, expect, beforeAll } from 'vitest';
import { ProductRepository } from '../src/repository/ProductRepository';
import { PackageOptimizer } from '../src/services/PackageOptimizer';
import { OrderService } from '../src/services/OrderService';

describe('Integration: End-to-End Order Processing', () => {
  let orderService: OrderService;
  let repository: ProductRepository;
  let optimizer: PackageOptimizer;

  beforeAll(() => {
    repository = new ProductRepository();
    repository.seedInitialProducts(); // seeds CE, HM, SS
    optimizer = new PackageOptimizer();
    orderService = new OrderService(repository, optimizer);
  });

  it('should throw error for non-existent products', () => {
    expect(() => {
      orderService.processOrder([
        { productCode: 'INVALID', quantity: 10 }
      ]);
    }).toThrow('Product INVALID not found');
  });

  it('should validate order before processing', () => {
    // Empty order
    expect(() => {
      orderService.processOrder([]);
    }).toThrow('Order must contain at least one item');

    // Negative quantity
    expect(() => {
      orderService.processOrder([
        { productCode: 'CE', quantity: -5 }
      ]);
    }).toThrow('Order quantity must be positive');

    // Zero quantity
    expect(() => {
      orderService.processOrder([
        { productCode: 'CE', quantity: 0 }
      ]);
    }).toThrow('Order quantity must be positive');
  });

  it('should process the provided example: 10 CE, 14 HM, 3 SS', () => {
    // Execute - process the order from requirements
    const result = orderService.processOrder([
      { productCode: 'CE', quantity: 10 },
      { productCode: 'HM', quantity: 14 },
      { productCode: 'SS', quantity: 3 }
    ]);

    // Verify Overall Order
    expect(result.items).toHaveLength(3);
    expect(result.totalCost).toBeCloseTo(156.60, 2);

    // Verify: 10 × CE (Cheese) = 2 × 5-packages
    const ceItem = result.items.find(i => i.productCode === 'CE');
    expect(ceItem).toBeDefined();
    expect(ceItem?.productName).toBe('Cheese');
    expect(ceItem?.quantity).toBe(10);
    expect(ceItem?.totalCost).toBeCloseTo(20.95 * 2, 2);
    expect(ceItem?.totalPackages).toBe(2);
    
    const ceBreakdown = ceItem?.packageBreakdown;
    expect(ceBreakdown).toBeDefined();
    const ce5Pack = ceBreakdown?.find(p => p.packageSize === 5);
    expect(ce5Pack?.noOfPackages).toBe(2);
    expect(ce5Pack?.totalCost).toBeCloseTo(20.95 * 2, 2);

    // Verify: 14 × HM (Ham) = 1×8 + 1×5 + 1×1 packages
    const hmItem = result.items.find(i => i.productCode === 'HM');
    expect(hmItem).toBeDefined();
    expect(hmItem?.productName).toBe('Ham');
    expect(hmItem?.quantity).toBe(14);
    expect(hmItem?.totalPackages).toBe(3)
    
    expect(hmItem?.totalCost).toBeCloseTo(40.95 + 29.95 + 7.95, 2);
    
    expect(hmItem?.packageBreakdown).toBeDefined();
    expect(hmItem?.packageBreakdown.length).toBeGreaterThan(0);
    const hm8Pack = hmItem?.packageBreakdown.find(p => p.packageSize === 8);
    expect(hm8Pack?.noOfPackages).toBe(1);
    expect(hm8Pack?.totalCost).toBeCloseTo(40.95, 2);
    const hm5Pack = hmItem?.packageBreakdown.find(p => p.packageSize === 5);
    expect(hm5Pack?.noOfPackages).toBe(1);
    expect(hm5Pack?.totalCost).toBeCloseTo(29.95, 2);
    const hm1Pack = hmItem?.packageBreakdown.find(p => p.packageSize === 1);
    expect(hm1Pack?.noOfPackages).toBe(1);
    expect(hm1Pack?.totalCost).toBeCloseTo(7.95, 2);

    // Verify: 3 × SS (Soy Sauce) = 3 × 1-packages
    const ssItem = result.items.find(i => i.productCode === 'SS');
    expect(ssItem).toBeDefined();
    expect(ssItem?.productName).toBe('Soy Sauce');
    expect(ssItem?.quantity).toBe(3);
    expect(ssItem?.totalCost).toBeCloseTo(11.95 * 3, 2);
    expect(ssItem?.totalPackages).toBe(3);
    
    const ssBreakdown = ssItem?.packageBreakdown;
    expect(ssBreakdown).toBeDefined();
    const ss1Pack = ssBreakdown?.find(p => p.packageSize === 1);
    expect(ss1Pack?.noOfPackages).toBe(3);
    expect(ss1Pack?.totalCost).toBeCloseTo(11.95 * 3, 2);
  });

  it('should handle orders with product having no packaging options', () => {

    const result = orderService.processOrder([
      { productCode: 'SS', quantity: 10 }
    ]);

    expect(result.items[0].totalPackages).toBe(10);
    expect(result.items[0].totalCost).toBeCloseTo(11.95 * 10, 2);
  });

  describe('System Components Usage', () => {
    it('should have CE, HM, SS products seeded by this point', () => {
      const cheese = repository.findByCode('CE');
      expect(cheese?.name).toBe('Cheese');
      expect(cheese?.price).toBe(5.95);
      expect(cheese?.getPackagingOptions()).toHaveLength(2);
      
      const ham = repository.findByCode('HM');
      expect(ham?.name).toBe('Ham');
      expect(ham?.price).toBe(7.95);
      expect(ham?.getPackagingOptions()).toHaveLength(3);
      
      const soySauce = repository.findByCode('SS');
      expect(soySauce?.name).toBe('Soy Sauce');
      expect(soySauce?.price).toBe(11.95);
      expect(soySauce?.getPackagingOptions()).toHaveLength(0);
    });

    it('should verify optimizer the repository correctly', () => {
      const cheese = repository.findByCode('CE')!;
      const result = optimizer.optimize(cheese, 10);
      
      expect(result.totalPackages).toBe(2); // 2×5
      expect(result.totalCost).toBeCloseTo(41.90, 2);
    });

    it('should verify order service uses optimizer correctly', () => {
      expect(() => {
        orderService.processOrder([
          { productCode: 'CE', quantity: 1 }
        ]);
      }).not.toThrow();
      
      // Verify it uses optimizer correctly
      const result = orderService.processOrder([
        { productCode: 'CE', quantity: 10 }
      ]);
      
      expect(result.items[0].packageBreakdown).toBeDefined();
      expect(result.items[0].totalPackages).toBe(2);
    });
  });

  describe('Business Rules Verification', () => {
    it('should minimize package count', () => {
      const result = orderService.processOrder([
        { productCode: 'CE', quantity: 10 }
      ]);
      
      expect(result.items[0].totalPackages).toBe(2);
    });

    it('should not ship more than requested to save cost and packages', () => {
      const result = orderService.processOrder([
        { productCode: 'CE', quantity: 4 }
      ]);
      
      const totalItems = result.items[0].packageBreakdown.reduce(
        (sum, pkg) => sum + (pkg.packageSize * pkg.noOfPackages), 
        0
      );
      
      expect(totalItems).toBe(4);
    });
  });
});