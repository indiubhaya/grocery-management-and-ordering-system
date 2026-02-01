export interface OrderItem {
  productCode: string;
  quantity: number;
}

export class Order {
  constructor(public readonly items: OrderItem[]) {}
}
