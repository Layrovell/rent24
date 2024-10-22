import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyAmenityDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsNotEmpty()
  @ValidateIf(
    (o) => typeof o.value === 'boolean' || typeof o.value === 'number'
  )
  value: number | boolean; // Can be a number or a boolean based on the amenity
}
