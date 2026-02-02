import type { Request, Response, NextFunction } from 'express';
import { ProductRepository } from '../../repository/ProductRepository.js';
import { Product } from '../../domain/Product.js';

export class ProductController {
 constructor(private repository: ProductRepository) {}

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
      const productCode = Array.isArray(code) ? code[0] : code;
      
      const product = this.repository.findByCode(productCode);

      if (!product) {
        res.status(404).json({
          error: `Product ${productCode} not found`
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

  createProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code, name, price, packagingOptions } = req.body;

      if (!code || !name || price === undefined) {
        throw new Error('Missing required fields: code, name, price');
      }

      const product = new Product(code, name, price);

      if (packagingOptions && Array.isArray(packagingOptions)) {
        for (const option of packagingOptions) {
          product.addPackagingOption(option.quantity, option.price);
        }
      }

      this.repository.addProduct(product);

      res.status(201).json({
        code: product.code,
        name: product.name,
        price: product.price,
        packagingOptions: product.getPackagingOptions().map(opt => ({
          quantity: opt.quantity,
          price: opt.price
        }))
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const productCode = Array.isArray(code) ? code[0] : code;

      const { name, price, packagingOptions } = req.body;

      const existing = this.repository.findByCode(productCode);
      if (!existing) {
        res.status(404).json({
          error: `Product ${productCode} not found`
        });
        return;
      }

      if (!name || price === undefined) {
        throw new Error('Missing required fields: name, price');
      }

      const updatedProduct = new Product(productCode, name, price);

      if (packagingOptions && Array.isArray(packagingOptions)) {
        for (const option of packagingOptions) {
          updatedProduct.addPackagingOption(option.quantity, option.price);
        }
      }

      // Update in repository
      this.repository.updateProduct(updatedProduct);

      // Return updated product
      res.json({
        code: updatedProduct.code,
        name: updatedProduct.name,
        price: updatedProduct.price,
        packagingOptions: updatedProduct.getPackagingOptions().map(opt => ({
          quantity: opt.quantity,
          price: opt.price
        }))
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { code } = req.params;
      const productCode = Array.isArray(code) ? code[0] : code;

      // Check if product exists
      const existing = this.repository.findByCode(productCode);
      if (!existing) {
        res.status(404).json({
          error: `Product ${productCode} not found`
        });
        return;
      }

      // Delete from repository
      this.repository.deleteProduct(productCode);

      // Return success
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
