import { IsNumber, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyDetailsDto {
  @ApiProperty()
  @IsNumber()
  wallTypeId: number;

  @ApiProperty()
  @IsNumber()
  yearBuilt: number;

  @ApiProperty()
  @IsNumber()
  squareFootage: number;

  @ApiProperty()
  @IsOptional()
  @IsString()
  energyEfficiencyRating?: string;

  @ApiProperty()
  @IsNumber()
  floor: number;

  @ApiProperty()
  @IsNumber()
  totalFloors: number;

  @IsOptional()
  @ApiProperty()
  availableFrom?: Date;

  @IsOptional()
  @ApiProperty()
  availableTo?: Date;

  @IsOptional()
  @ApiProperty()
  maxResidents?: number;
}
