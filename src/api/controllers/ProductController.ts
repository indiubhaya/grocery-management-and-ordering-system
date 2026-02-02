import type { Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../../repository/ProductRepository.js';

export class ProductController {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository();
    this.repository.seedInitialProducts();
  }

  getAllProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = this.repository.findAll();

      // Convert to API format
      const response = {
        products: products.map(product => ({
          code: product.code,
          name: product.name,
          price: product.price,
          packagingOptions: product.getPackagingOptions().map(opt => ({
            quantity: opt.quantity,
            price: opt.price
          }))
        }))
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  getProductByCode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const product = Array.isArray(code) ?
        code.length > 0 ? 
            this.repository.findByCode(code[0]) : null :
        this.repository.findByCode(code);

      if (!product) {
        res.status(404).json({
          error: `Product ${code} not found`
        });
        return;
      }

      // Convert to API format
      const response = {
        code: product.code,
        name: product.name,
        price: product.price,
        packagingOptions: product.getPackagingOptions().map(opt => ({
          quantity: opt.quantity,
          price: opt.price
        }))
      };

      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
