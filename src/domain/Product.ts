export interface PackagingOption {
  amount: number;
  price: number;
}

export class Product {
  private packagingOptions: PackagingOption[] = [];

  constructor(
    public readonly code: string,
    public readonly name: string,
    public readonly price: number
  ) {
    this.validateCode(code);
    this.validateName(name);
    this.validatePrice(price);
  }

  private validateCode(code: string): void {
    if (!code || code.trim().length === 0) {
      throw new Error('Product code cannot be empty');
    }
  }

  private validateName(name: string): void {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
  }

  private validatePrice(price: number): void {
    if (price <= 0) {
      throw new Error('Price must be positive');
    }
  }

  getPackagingOptions(): PackagingOption[] {
    return [...this.packagingOptions];
  }

  addPackagingOption(quantity: number, price: number): void {
    this.validatePrice(price);
    this.validateQuantity(quantity);
    this.packagingOptions.push({ amount: quantity, price: price });
  }

  validateQuantity(quantity: number) {
    if (quantity <= 0) {
      throw new Error('Package amount must be positive');
    }
  }
}