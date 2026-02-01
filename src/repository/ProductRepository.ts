import { Product } from "../domain/Product.js";

export class ProductRepository {
  private products: Product[] = [];

  findByCode(arg0: string) {
    return this.products.find(p => p.code === arg0) || null;
  }
}