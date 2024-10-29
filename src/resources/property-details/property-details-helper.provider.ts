import { Injectable } from '@nestjs/common';

import { PropertyDetails } from 'src/entities';
import { ViewPropertyDetailsDto } from './dto/view-property-details.dto';

@Injectable()
export class PropertyDetailsHelperProvider {
  listToViewDto(details: PropertyDetails[]): ViewPropertyDetailsDto[] {
    const viewListDto = details.map((detail) => this.toViewDto(detail));

    return viewListDto;
  }

  toViewDto(detail: PropertyDetails): ViewPropertyDetailsDto {
    const viewDto = new ViewPropertyDetailsDto();

    viewDto.id = detail.id;
    viewDto.wallTypeId = detail.wallType.id;
    viewDto.yearBuilt = detail.yearBuilt;
    viewDto.squareFootage = detail.squareFootage;
    viewDto.energyEfficiencyRating = detail.energyEfficiencyRating;
    viewDto.floor = detail.floor;
    viewDto.totalFloors = detail.totalFloors;
    viewDto.availableFrom = detail.availableFrom;
    viewDto.availableTo = detail.availableTo;
    viewDto.maxResidents = detail.maxResidents;
    viewDto.propertyId = detail.propertyId;

    viewDto.createdAt = detail.createdAt;
    viewDto.updatedAt = detail.updatedAt;

    return viewDto;
  }
}
