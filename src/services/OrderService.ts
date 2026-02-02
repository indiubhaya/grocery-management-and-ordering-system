import type { ProductRepository } from '../repository/ProductRepository.js';
import type { PackageOptimizer, PackageArrangement } from './PackageOptimizer.js';
import type { OrderItem } from '../domain/Order.js';

/**
 * Output: Result for a single item in the order
 */
export interface OrderItemResult {
  productCode: string;
  productName: string;
  quantity: number;
  totalCost: number;
  totalPackages: number;
  packageBreakdown: PackageArrangement[];
}

/**
 * Output: Complete order result
 */
export interface OrderResult {
  items: OrderItemResult[];
  totalPackages: number;
  totalCost: number;
}

/**
 * Service for processing grocery orders.
 * 
 * Responsibilities:
 * - Validate order items
 * - Lookup products from repository
 * - Optimize packaging for each item
 * - Calculate total cost
 */
export class OrderService {
  constructor(
    private productRepository: ProductRepository,
    private packageOptimizer: PackageOptimizer
  ) {}

  /**
   * Process an order by optimizing packaging and calculating costs.
   * 
   * @param orderItems - Array of items to order
   * @returns Detailed breakdown with optimized packaging and costs
   * @throws Error if order is invalid or product not found
   */
  processOrder(orderItems: OrderItem[]): OrderResult {
    // Validate order
    this.validateOrder(orderItems);

    const results: OrderItemResult[] = [];
    let totalCost = 0;

    // Process each item
    for (const item of orderItems) {
      // Lookup product
      const product = this.productRepository.findByCode(item.productCode);
      if (!product) {
        throw new Error(`Product ${item.productCode} not found`);
      }

      // Optimize packaging
      const optimized = this.packageOptimizer.optimize(product, item.quantity);

      // Build result for this item
      const itemResult: OrderItemResult = {
        productCode: product.code,
        productName: product.name,
        quantity: item.quantity,
        totalCost: parseFloat(optimized.totalCost.toFixed(2)),
        totalPackages: optimized.totalPackages,
        packageBreakdown: optimized.packageBreakdown
      };

      results.push(itemResult);
      totalCost += optimized.totalCost;
    }

    return {
      items: results,
      totalPackages: results.reduce((sum, item) => sum + item.totalPackages, 0),
      totalCost: parseFloat(totalCost.toFixed(2))
    };
  }

  /**
   * Validate order items.
   * @throws Error if order is invalid
   */
  private validateOrder(orderItems: OrderItem[]): void {
    if (!orderItems || orderItems.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    for (const item of orderItems) {
      if (!item.productCode || item.productCode.trim().length === 0) {
        throw new Error('Product code cannot be empty');
      }
      if (item.quantity <= 0) {
        throw new Error('Order quantity must be positive');
      }
    }
  }
}
