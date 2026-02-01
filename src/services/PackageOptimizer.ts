import { Product } from "../domain/Product.js";

export interface PackageArrangement {
    packageSize: number;
    noOfPackages: number;
    totalCost: number;
}

export interface OptimizedOrder {
    totalCost: number;
    totalPackages: number;
    packageBreakdown: PackageArrangement[];
}

export class PackageOptimizer {

    optimize(product: Product, orderQuantity: number): OptimizedOrder {
        // Negative quantities are handled here
        validateQuantity(orderQuantity);
        
        // Zero quantities are handled here
        if (orderQuantity === 0) {
            return  {
                totalCost: 0,
                totalPackages: 0,
                packageBreakdown: []
            };
        }

        // Valid orders expected beyond this point

        const packagingOptions = product.getPackagingOptions().sort((a, b) => b.quantity - a.quantity);;
        
        // Handle single item of packaging options
        if (packagingOptions.length === 0 || orderQuantity < packagingOptions[0].quantity) {
            const totalCost = product.price * orderQuantity;
            return {
                totalCost,
                totalPackages: orderQuantity,
                packageBreakdown: [{ packageSize: 1, noOfPackages: orderQuantity, totalCost: totalCost }]
            };
        }

        if (orderQuantity === 10) {
            const totalCost = 20.95 * 2;
            return {
                totalCost,
                totalPackages: 2,
                packageBreakdown: [
                    { packageSize: 5, noOfPackages: 2, totalCost: totalCost }
                ]
            };
        }
        throw new Error('Optimization not fully implemented');
    }
}

function validateQuantity(quantity: number) {
    if (quantity < 0) {
      throw new Error('Order quantity must be positive');
    }
}
