import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UserQueryDto {
  @ApiProperty({
    description: 'Natural language query from the user',
    example: 'I am looking for a phone',
    minLength: 1,
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  query: string;
}
