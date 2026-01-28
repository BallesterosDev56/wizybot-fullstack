import { BadRequestException } from '@nestjs/common';
import { ToolValidationPipe } from './tool-validation.pipe';
import { SearchProductsDto } from '../../agent/dto/search-products.dto';
import { ConvertCurrenciesDto } from '../../agent/dto/convert-currencies.dto';

describe('ToolValidationPipe', () => {
  describe('SearchProductsDto validation', () => {
    it('should validate and transform valid search parameters', async () => {
      const pipe = new ToolValidationPipe<SearchProductsDto>(SearchProductsDto);
      const input = { query: 'laptop' };

      const result = await pipe.transform(input);

      expect(result).toBeInstanceOf(SearchProductsDto);
      expect(result.query).toBe('laptop');
    });

    it('should throw error for empty query', async () => {
      const pipe = new ToolValidationPipe<SearchProductsDto>(SearchProductsDto);
      const input = { query: '' };

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw error for missing query', async () => {
      const pipe = new ToolValidationPipe<SearchProductsDto>(SearchProductsDto);
      const input = {};

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });
  });

  describe('ConvertCurrenciesDto validation', () => {
    it('should validate and transform valid currency parameters', async () => {
      const pipe = new ToolValidationPipe<ConvertCurrenciesDto>(
        ConvertCurrenciesDto,
      );
      const input = {
        amount: 100,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
      };

      const result = await pipe.transform(input);

      expect(result).toBeInstanceOf(ConvertCurrenciesDto);
      expect(result.amount).toBe(100);
      expect(result.fromCurrency).toBe('USD');
      expect(result.toCurrency).toBe('EUR');
    });

    it('should convert string amount to number', async () => {
      const pipe = new ToolValidationPipe<ConvertCurrenciesDto>(
        ConvertCurrenciesDto,
      );
      const input = {
        amount: '150.50',
        fromCurrency: 'USD',
        toCurrency: 'EUR',
      };

      const result = await pipe.transform(input);

      expect(result.amount).toBe(150.5);
    });

    it('should throw error for negative amount', async () => {
      const pipe = new ToolValidationPipe<ConvertCurrenciesDto>(
        ConvertCurrenciesDto,
      );
      const input = {
        amount: -50,
        fromCurrency: 'USD',
        toCurrency: 'EUR',
      };

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw error for invalid currency code format', async () => {
      const pipe = new ToolValidationPipe<ConvertCurrenciesDto>(
        ConvertCurrenciesDto,
      );
      const input = {
        amount: 100,
        fromCurrency: 'US',
        toCurrency: 'EUR',
      };

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });

    it('should throw error for lowercase currency codes', async () => {
      const pipe = new ToolValidationPipe<ConvertCurrenciesDto>(
        ConvertCurrenciesDto,
      );
      const input = {
        amount: 100,
        fromCurrency: 'usd',
        toCurrency: 'eur',
      };

      await expect(pipe.transform(input)).rejects.toThrow(BadRequestException);
    });
  });
});
