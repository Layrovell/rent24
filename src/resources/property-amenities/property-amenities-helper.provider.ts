import { Injectable } from '@nestjs/common';

import { PropertyAmenities } from 'src/entities';
import { ViewPropertyAmenitiesDto } from './dto/view-property-amenities.dto';

@Injectable()
export class PropertyAmenitiesHelperProvider {
  listToViewDto(amenities: PropertyAmenities[]): ViewPropertyAmenitiesDto[] {
    const viewListDto = amenities.map((amenity) => this.toViewDto(amenity));

    return viewListDto;
  }

  toViewDto(amenity: PropertyAmenities): ViewPropertyAmenitiesDto {
    const viewDto = new ViewPropertyAmenitiesDto();

    viewDto.id = amenity.id;
    viewDto.value = amenity.value;
    viewDto.name = amenity.amenity.code;
    viewDto.description = amenity.amenity.description;
    viewDto.unit = amenity.amenity.unit;
    viewDto.valueType = amenity.amenity.valueType;
    viewDto.propertyId = amenity.property.id;
    viewDto.valueType = amenity.amenity.valueType;

    return viewDto;
  }
}
