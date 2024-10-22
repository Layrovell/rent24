import { Injectable } from '@nestjs/common';

import { PropertyDetails } from 'src/entities';
import { ViewPropertyDetailsDto } from './dto/view-property-details.dto';

@Injectable()
export class PropertyDetailsHelperProvider {
  propertiesDetailsToViewDto(
    details: PropertyDetails[]
  ): ViewPropertyDetailsDto[] {
    const viewPropertiesListDto = details.map((detail) =>
      this.propertyDetailsToViewDto(detail)
    );

    return viewPropertiesListDto;
  }

  propertyDetailsToViewDto(detail: PropertyDetails): ViewPropertyDetailsDto {
    const viewPropertyDetailsDto = new ViewPropertyDetailsDto();

    viewPropertyDetailsDto.id = detail.id;
    viewPropertyDetailsDto.wallTypeId = detail.wallType.id;
    viewPropertyDetailsDto.yearBuilt = detail.yearBuilt;
    viewPropertyDetailsDto.squareFootage = detail.squareFootage;
    viewPropertyDetailsDto.energyEfficiencyRating =
      detail.energyEfficiencyRating;
    viewPropertyDetailsDto.floor = detail.floor;
    viewPropertyDetailsDto.totalFloors = detail.totalFloors;
    viewPropertyDetailsDto.availableFrom = detail.availableFrom;
    viewPropertyDetailsDto.availableTo = detail.availableTo;
    viewPropertyDetailsDto.maxResidents = detail.maxResidents;
    viewPropertyDetailsDto.propertyId = detail.propertyId;

    viewPropertyDetailsDto.createdAt = detail.createdAt;
    viewPropertyDetailsDto.updatedAt = detail.updatedAt;

    return viewPropertyDetailsDto;
  }
}
