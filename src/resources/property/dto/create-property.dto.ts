import { IsNotEmpty, IsOptional, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PropertyType } from 'src/entities/property.entity';

export class CreatePropertyDto {
  @ApiProperty()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsEnum(PropertyType)
  propertyType: PropertyType;

  @ApiProperty()
  @IsOptional()
  @IsNumber() // check and consider
  pricePerMonth?: number;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  pricePerDay?: number;

  @ApiProperty()
  longTerm: boolean;

  @IsNotEmpty() // Ensure userId is provided
  @IsNumber()
  userId: number; // Include userId
}
