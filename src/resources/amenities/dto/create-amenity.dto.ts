import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAmenityDto {
  @ApiProperty()
  @IsNotEmpty()
  code: string;

  @ApiProperty()
  @IsOptional()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty()
  @IsString()
  valueType: string; // Data type of the amenity value (e.g., 'boolean', 'number', 'string')
}
