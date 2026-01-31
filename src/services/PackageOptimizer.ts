import { Product } from "../domain/Product.js";

export class PackageOptimizer {

    optimize(product: Product, arg1: number) {
        return  {
            totalCost: 0,
            totalPackages: 0,
            packageBreakdown: []
        };
    }
}