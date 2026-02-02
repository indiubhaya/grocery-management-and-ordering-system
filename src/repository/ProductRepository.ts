import { Product } from "../domain/Product.js";

/**
 * Interface for product repository operations to
 * allow for different implementations (in-memory, database, etc.)
 */
export interface IProductRepository {
  addProduct(product: Product): void;
  findByCode(code: string): Product | null;
  updateProduct(product: Product): void;
  deleteProduct(code: string): void;
  findAll(): Product[];
}

export class ProductRepository implements IProductRepository {
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

  /**
   * Get all products.
   */
  findAll(): Product[] {
    return Array.from(this.products.values());
  }
  
  /**
   * Seed initial products into the repository.
   */
  seedInitialProducts(): void {
    // CE - Cheese
    const cheese = new Product('CE', 'Cheese', 5.95);
    cheese.addPackagingOption(3, 14.95);
    cheese.addPackagingOption(5, 20.95);
    this.products.set(cheese.code, cheese);

    // HM - Ham  
    const ham = new Product('HM', 'Ham', 7.95);
    ham.addPackagingOption(2, 13.95);
    ham.addPackagingOption(5, 29.95);
    ham.addPackagingOption(8, 40.95);
    this.products.set(ham.code, ham);

    // SS - Soy Sauce
    const soySauce = new Product('SS', 'Soy Sauce', 11.95);
    this.products.set(soySauce.code, soySauce);
  }
}