import { Injectable } from '@nestjs/common';

import { ViewPropertyDto } from './dto/view-property.dto';
import { Property } from 'src/entities';

@Injectable()
export class PropertyHelperProvider {
  listToViewDto(properties: Property[]): ViewPropertyDto[] {
    const viewListDto = properties.map((property) => this.toViewDto(property));

    return viewListDto;
  }

  toViewDto(property: Property): ViewPropertyDto {
    const viewDto = new ViewPropertyDto();

    viewDto.id = property.id;
    viewDto.title = property.title;
    viewDto.description = property.description;
    viewDto.city = property.city;
    viewDto.country = property.country;
    viewDto.longTerm = property.longTerm;
    viewDto.pricePerDay = property.pricePerDay;
    viewDto.pricePerMonth = property.pricePerMonth;
    viewDto.propertyType = property.propertyType;
    // or return the full user not just the ID?
    // viewPropertyDto.user = property.user;
    viewDto.userId = property.user.id;
    viewDto.detailsId = property.detailsId; // since details.id can be null

    viewDto.createdAt = property.createdAt;
    viewDto.updatedAt = property.updatedAt;

    viewDto.isModerated = property.isModerated;

    return viewDto;
  }
}
