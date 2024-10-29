import { ApiProperty } from '@nestjs/swagger';

import { PropertyType } from 'src/entities/property.entity';
import { User } from 'src/entities';

export class ViewPropertyDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  propertyType: PropertyType;

  @ApiProperty()
  pricePerMonth: number | null;

  @ApiProperty()
  pricePerDay: number | null;

  @ApiProperty()
  longTerm: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  user: User;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  detailsId: number;

  @ApiProperty()
  isModerated: boolean;
}
