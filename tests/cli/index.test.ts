import { describe, it, expect } from 'vitest';
import { parseCLIInput, formatCurrency } from '../../src/cli/index';

describe('CLI', () => {
  describe('parseCLIInput', () => {
    it('throws for zero quantity', () => {
      expect(() => parseCLIInput('0 CE')).toThrow();
    });

    it('throws for invalid format', () => {
      expect(() => parseCLIInput('invalid')).toThrow();
      expect(() => parseCLIInput('10CE')).toThrow();
      expect(() => parseCLIInput('10 CE, HM')).toThrow(); 
    });

    it('parses valid input', () => {
      const result = parseCLIInput('10 CE,14 HM,3 SS');
      expect(result).toEqual([
        { productCode: 'CE', quantity: 10 },
        { productCode: 'HM', quantity: 14 },
        { productCode: 'SS', quantity: 3 }
      ]);
    });
  });

  describe('formatCurrency', () => {
    it('formats with two decimals', () => {
      expect(formatCurrency(156.6)).toBe('$156.60');
      expect(formatCurrency(5.95)).toBe('$5.95');
    });
  });
});