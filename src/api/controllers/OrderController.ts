import type { Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../../repository/ProductRepository.js';
import { PackageOptimizer } from '../../services/PackageOptimizer.js';
import { OrderService } from '../../services/OrderService.js';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    const repository = new ProductRepository();
    repository.seedInitialProducts();
    const optimizer = new PackageOptimizer();
    this.orderService = new OrderService(repository, optimizer);
  }

  processOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { items } = req.body;

      if (!items || !Array.isArray(items)) {
        throw new Error('Request must include "items" array');
      }

      const result = this.orderService.processOrder(items);

      res.json(result);
    } catch (error) {
      next(error);
    }
  };
}
