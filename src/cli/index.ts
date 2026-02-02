import { ProductRepository } from '../repository/ProductRepository.js';
import { PackageOptimizer } from '../services/PackageOptimizer.js';
import { OrderService } from '../services/OrderService.js';
import type { OrderResult } from '../services/OrderService.js';

/**
 * Parse command line input. e.g. "10 CE,14 HM,3 SS"
 */
export function parseCLIInput(input: string) {
  const items = input.split(',').map(item => {
    const parts = item.trim().split(' ');
    if (parts.length !== 2) {
      throw new Error(`Invalid format "${item}". Expected format: "10 CE"`);
    }
    
    const quantity = parseInt(parts[0]);
    const productCode = parts[1];
    
    if (isNaN(quantity) || quantity <= 0) {
      throw new Error(`Invalid quantity "${parts[0]}".`);
    }

    return { productCode, quantity };
  });
  
  return items;
}

/**
 * Format currency
 */
export function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

/**
 * Format order result for display
 */
function formatOrderResult(result: OrderResult): string {
  const lines: string[] = [];
  
  lines.push('');
  lines.push('-'.repeat(60));
  lines.push('ORDER SUMMARY');
  lines.push('-'.repeat(60));
  lines.push('');
  
  for (const item of result.items) {
    lines.push(`${item.quantity} ${item.productCode} for ${formatCurrency(item.totalCost)}`);
    lines.push('  Breakdown:');
    
    for (const pkg of item.packageBreakdown) {
      if (pkg.packageSize === 1) {
        lines.push(`    - ${pkg.noOfPackages} package of ${pkg.packageSize} (${formatCurrency(pkg.totalCost)})`);
      } else {
        lines.push(`    - ${pkg.noOfPackages} packages of ${pkg.packageSize} (${formatCurrency(pkg.totalCost)})`);
      }
    }
    
    lines.push('');
  }

  lines.push(`TOTAL: ${formatCurrency(result.totalCost)}`);
  lines.push(`PACKAGE COUNT: ${result.items.reduce((sum, item) => sum + item.totalPackages, 0)} packages`);
  
  return lines.join('\n');
}

/**
 * Main CLI entry point
 */
function main() {
  // Get command line arguments
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log('Usage: npm run dev "<order>"');
    console.log('');
    console.log('Example:');
    console.log('  npm run dev "10 CE,14 HM,3 SS"');
    console.log('');
    console.log('Format: <quantity> <product_code>,<quantity> <product_code>,...');
    console.log('');
    console.log('Available products:');
    console.log('  CE - Cheese ($5.95)');
    console.log('  HM - Ham ($7.95)');
    console.log('  SS - Soy Sauce ($11.95)');
    process.exit(0);
  }
  
  const orderInput = args[0];
  
  try {
    // Parse input
    console.log(`Processing order: ${orderInput}\n`);
    const items = parseCLIInput(orderInput);
    
    // Setup system
    const repository = new ProductRepository();
    repository.seedInitialProducts();
    const optimizer = new PackageOptimizer();
    const orderService = new OrderService(repository, optimizer);
    
    // Process order
    const result = orderService.processOrder(items);
    
    // Display result
    console.log(formatOrderResult(result));
    
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

// Run only if executed directly from CLI
if (import.meta.url === `file://${process.argv[1]}`)
    main();