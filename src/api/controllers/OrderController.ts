import type { Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../../repository/ProductRepository.js';
import { PackageOptimizer } from '../../services/PackageOptimizer.js';
import { OrderService } from '../../services/OrderService.js';

export class OrderController {

  constructor(private orderService: OrderService) {}

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
