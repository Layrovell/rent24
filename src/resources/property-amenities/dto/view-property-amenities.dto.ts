import { ApiProperty } from '@nestjs/swagger';

import { CreatePropertyAmenityDto } from './create-property-amenity.dto';

export class ViewPropertyAmenitiesDto extends CreatePropertyAmenityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  unit: null | string;

  @ApiProperty()
  valueType: string;

  @ApiProperty()
  propertyId: number;
}
