import { ApiProperty } from '@nestjs/swagger';

export class CreateProfileDto {
  @ApiProperty()
  description: string;

  @ApiProperty()
  companyName: null | string;

  @ApiProperty()
  commissionRate: null | number;

  @ApiProperty()
  fixedFee: null | number;

  @ApiProperty()
  isLookingForApartment: boolean;
}
