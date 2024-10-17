import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { WallType } from 'src/entities';

export class CreatePropertyDetailsDto {
  @ApiProperty()
  wallType: WallType;

  @ApiProperty()
  yearBuilt: number;

  @ApiProperty()
  squareFootage: number;

  @ApiProperty()
  @IsOptional()
  energyEfficiencyRating?: string;

  @ApiProperty()
  floor: number;

  @ApiProperty()
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
