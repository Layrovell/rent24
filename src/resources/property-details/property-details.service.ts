import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { PropertyDetails } from 'src/entities';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { PropertyService } from '../property/property.service';
import { WallTypeService } from '../wall-type/wall-type.service';

@Injectable()
export class PropertyDetailsService {
  constructor(
    @Inject(PropertyDetails)
    private readonly propertyDetailsRepository: Repository<PropertyDetails>,
    private readonly propertyService: PropertyService,
    private readonly wallTypeService: WallTypeService
  ) {}

  async createDetails(
    propertyId: number,
    userId: number,
    dto: CreatePropertyDetailsDto
  ): Promise<PropertyDetails> {
    const { wallType } = dto; // wallType code

    const existingWallType = await this.wallTypeService.getByCode(
      wallType as any
    );

    const existingProperty =
      await this.propertyService.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException(
        'You can not create details for this property'
      );
    }

    const existingDetails = await this.propertyDetailsRepository.findOne({
      where: { propertyId: existingProperty.id },
    });

    if (existingDetails) {
      throw new BadRequestException(
        `Details for property with ID ${existingProperty.id} were already created`
      );
    }

    const details = await this.propertyDetailsRepository.save({
      ...dto,
      wallType: existingWallType,
      property: existingProperty,
    });
    console.log('DETAILS:', details);

    await this.propertyService.updateProperty(
      existingProperty.id,
      userId,
      {},
      details
    );

    return details;
  }
}
