import { IsString, IsNotEmpty } from 'class-validator';

/**
 * DTO for validating product search parameters
 */
export class SearchProductsDto {
  @IsString({ message: 'Query must be a string' })
  @IsNotEmpty({ message: 'Query cannot be empty' })
  query: string;
}
