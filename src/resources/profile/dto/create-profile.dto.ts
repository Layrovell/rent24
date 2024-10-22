import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  companyName?: null | string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  commissionRate: null | number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  @IsOptional()
  fixedFee: null | number;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  isLookingForApartment: boolean;

  @ApiProperty()
  @IsNumber()
  userId: number;
}
