import {
  IsOptional,
  IsEnum,
  IsNumber,
  IsString,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { PropertyType } from 'src/entities/property.entity';

export class CreatePropertyDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
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
  @IsBoolean()
  longTerm: boolean;

  @ApiProperty()
  @IsNotEmpty() // Ensure userId is provided
  @IsNumber()
  userId: number; // Include userId
}
