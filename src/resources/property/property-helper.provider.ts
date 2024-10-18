import { Injectable } from '@nestjs/common';

import { ViewPropertyDto } from './dto/view-property.dto';
import { Property } from 'src/entities';

@Injectable()
export class PropertyHelperProvider {
  propertiesToViewDto(properties: Property[]): ViewPropertyDto[] {
    const viewPropertiesListDto = properties.map((property) =>
      this.propertyToViewDto(property)
    );

    return viewPropertiesListDto;
  }

  propertyToViewDto(property: Property): ViewPropertyDto {
    const viewPropertyDto = new ViewPropertyDto();

    viewPropertyDto.id = property.id;
    viewPropertyDto.title = property.title;
    viewPropertyDto.description = property.description;
    viewPropertyDto.city = property.city;
    viewPropertyDto.country = property.country;
    viewPropertyDto.longTerm = property.longTerm;
    viewPropertyDto.pricePerDay = property.pricePerDay;
    viewPropertyDto.pricePerMonth = property.pricePerMonth;
    viewPropertyDto.propertyType = property.propertyType;
    // or return the full user not just the ID?
    // viewPropertyDto.user = property.user;
    viewPropertyDto.userId = property.user.id;
    viewPropertyDto.detailsId = property.detailsId; // since details.id can be null

    viewPropertyDto.createdAt = property.createdAt;
    viewPropertyDto.updatedAt = property.updatedAt;

    return viewPropertyDto;
  }
}
