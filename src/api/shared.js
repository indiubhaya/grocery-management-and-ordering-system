import { ProductRepository } from '../repository/ProductRepository.js';
import { PackageOptimizer } from '../services/PackageOptimizer.js';
import { OrderService } from '../services/OrderService.js';

/**
 * Shared instances for dependency injection.
 * 
 * This module creates and exports singleton instances of the
 * ProductRepository, PackageOptimizer, and OrderService.
 * 
 * Other modules can import these instances to ensure a
 * single source of truth across the application.
 * 
 * This approach is used for the simplicity of the project.
 * In a production application, I'd a proper DI framework.
 */

// Create and seed product repository
export const repository = new ProductRepository();
repository.seedInitialProducts();

// Create package optimizer
export const optimizer = new PackageOptimizer();

// Create order service with dependencies
export const orderService = new OrderService(repository, optimizer);