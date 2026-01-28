import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

/**
 * Custom pipe for validating tool parameters using class-validator DTOs
 *
 * This pipe transforms raw tool parameters into validated DTO instances,
 * ensuring type safety and business rules before tool execution.
 *
 * @example
 * const pipe = new ToolValidationPipe(SearchProductsDto);
 * const validatedParams = await pipe.transform(rawParams);
 */
@Injectable()
export class ToolValidationPipe<T extends object> implements PipeTransform {
  constructor(private readonly dtoClass: new () => T) {}

  async transform(value: Record<string, unknown>): Promise<T> {
    // Transform plain object to DTO instance
    const dtoInstance = plainToInstance(this.dtoClass, value);

    // Validate the DTO instance
    const errors: ValidationError[] = await validate(
      dtoInstance as unknown as object,
    );

    if (errors.length > 0) {
      const errorMessages = this.formatValidationErrors(errors);
      throw new BadRequestException(
        `Tool parameter validation failed: ${errorMessages}`,
      );
    }

    return dtoInstance;
  }

  /**
   * Formats validation errors into a readable string
   */
  private formatValidationErrors(errors: ValidationError[]): string {
    return errors
      .map((error) => {
        const constraints = error.constraints || {};
        return Object.values(constraints).join(', ');
      })
      .join('; ');
  }
}
