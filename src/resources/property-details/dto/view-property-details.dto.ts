import { ApiProperty, PartialType } from '@nestjs/swagger';

import { CreatePropertyDetailsDto } from './create-property-details.dto';

export class ViewPropertyDetailsDto extends PartialType(
  CreatePropertyDetailsDto
) {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  propertyId: number;
}
