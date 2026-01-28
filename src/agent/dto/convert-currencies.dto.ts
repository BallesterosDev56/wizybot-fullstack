import { IsNumber, IsString, IsNotEmpty, Min, Matches } from 'class-validator';
import { Type } from 'class-transformer';

/**
 * DTO for validating currency conversion parameters
 */
export class ConvertCurrenciesDto {
  @Type(() => Number)
  @IsNumber({}, { message: 'Amount must be a number' })
  @Min(0.01, { message: 'Amount must be greater than 0' })
  amount: number;

  @IsString({ message: 'Source currency must be a string' })
  @IsNotEmpty({ message: 'Source currency cannot be empty' })
  @Matches(/^[A-Z]{3}$/, {
    message: 'Source currency must be a 3-letter ISO code (e.g., USD, EUR)',
  })
  fromCurrency: string;

  @IsString({ message: 'Target currency must be a string' })
  @IsNotEmpty({ message: 'Target currency cannot be empty' })
  @Matches(/^[A-Z]{3}$/, {
    message: 'Target currency must be a 3-letter ISO code (e.g., USD, EUR)',
  })
  toCurrency: string;
}
