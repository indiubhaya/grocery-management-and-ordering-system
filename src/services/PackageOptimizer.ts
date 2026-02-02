import { Product } from "../domain/Product.js";

export interface PackageArrangement {
    packageSize: number;
    noOfPackages: number;
    totalCost: number;
}

export interface PackagingResult {
    totalCost: number;
    totalPackages: number;
    packageBreakdown: PackageArrangement[];
}

/**
 * Interface for package optimization strategies.
 * Allows for different implementations (greedy, dynamic programming, etc.)
 */
export interface IPackageOptimizer {
    optimize(product: Product, orderQuantity: number): PackagingResult;
}

export class PackageOptimizer implements IPackageOptimizer {

    optimize(product: Product, orderQuantity: number): PackagingResult {
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

        // Retrieve and sort packaging options in descending order
        const packagingOptions = product.getPackagingOptions().sort((a, b) => b.quantity - a.quantity);
        
        // Handle single item of packaging options
        if (packagingOptions.length === 0 || orderQuantity < packagingOptions[packagingOptions.length - 1].quantity) {
            const totalCost = product.price * orderQuantity;
            return {
                totalCost: parseFloat(totalCost.toFixed(2)),
                totalPackages: orderQuantity,
                packageBreakdown: [{ packageSize: 1, noOfPackages: orderQuantity, totalCost: parseFloat(totalCost.toFixed(2)) }]
            };
        }

        let remainingQuantity = orderQuantity;
        const breakdown: PackageArrangement[] = [];
        let totalCost = 0;

        for (let i = 0; i < packagingOptions.length; i++) {
            const packagingOption = packagingOptions[i];
            const numPackages = Math.floor(remainingQuantity / packagingOption.quantity); // TODO: rename quantity to size
            if (numPackages > 0) {
                const costForThisOption = numPackages * packagingOption.price;
                breakdown.push({
                    packageSize: packagingOption.quantity,
                    noOfPackages: numPackages,
                    totalCost: costForThisOption
                });
                totalCost += costForThisOption;
                remainingQuantity -= numPackages * packagingOption.quantity;
            }
            if (remainingQuantity === 0) {
                return {
                    totalCost,
                    totalPackages: breakdown.reduce((sum, item) => sum + item.noOfPackages, 0),
                    packageBreakdown: breakdown
                };
            }
            if (remainingQuantity < packagingOptions[packagingOptions.length - 1].quantity) {
                const costForSingles = remainingQuantity * product.price;
                breakdown.push({
                    packageSize: 1,
                    noOfPackages: remainingQuantity,
                    totalCost: costForSingles
                });
                totalCost += costForSingles;
                remainingQuantity = 0;
                return {
                    totalCost,
                    totalPackages: breakdown.reduce((sum, item) => sum + item.noOfPackages, 0),
                    packageBreakdown: breakdown
                };
            }
        }
        throw new Error('Logic error: should have fulfilled the order by now!');
    }
}

function validateQuantity(quantity: number) {
    if (quantity < 0) {
      throw new Error('Order quantity must be positive');
    }
}
