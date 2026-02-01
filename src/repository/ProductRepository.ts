import { Product } from "../domain/Product.js";

export class ProductRepository {
  private products: Map<string, Product> = new Map();

  addProduct(product: Product) {
    if (!this.products.has(product.code)) {
      this.products.set(product.code, product);
      return;
    }
    throw new Error(`Product with code ${product.code} already exists.`);
  }

  /**
   * Find product by code.
   */
  findByCode(code: string) {
    return this.products.get(code) || null; // todo shallow copy
  }

   /**
   * Update an existing product.
   * @throws Error if product code doesn't exist
   */
  updateProduct(product: Product): void {
    if (!this.products.has(product.code)) {
      throw new Error(`Product with code ${product.code} does not exist.`);
    }
    this.products.set(product.code, product);
  }

  /**
   * Delete product by code.
   */
  deleteProduct(code: string): void {
    this.products.delete(code);
  }
}