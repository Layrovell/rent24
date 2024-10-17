import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { PropertyDetails } from 'src/entities';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { PropertyService } from '../property/property.service';
import { WallTypeService } from '../wall-type/wall-type.service';
import { UpdatePropertyDetailsDto } from './dto/update-property-details.dto';

@Injectable()
export class PropertyDetailsService {
  constructor(
    @Inject(PropertyDetails)
    private readonly propertyDetailsRepository: Repository<PropertyDetails>,
    private readonly propertyService: PropertyService,
    private readonly wallTypeService: WallTypeService
  ) {}

  async getById(detailsId: number): Promise<PropertyDetails> {
    const existingDetails = await this.propertyDetailsRepository.findOneBy({
      id: detailsId,
    });

    if (!existingDetails) {
      throw new NotFoundException(`Details with ID ${detailsId} not found`);
    }

    return existingDetails;
  }

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

    const existingDetails = await this.propertyDetailsRepository.findOneBy({
      propertyId: existingProperty.id,
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

    await this.propertyService.updateProperty(
      existingProperty.id,
      userId,
      {},
      details
    );

    return details;
  }

  async updateById(
    propertyId: number,
    dto: UpdatePropertyDetailsDto
  ): Promise<PropertyDetails> {
    const existingDetails = await this.getById(propertyId);

    return await this.propertyDetailsRepository.save({
      id: existingDetails.id,
      ...dto,
    });
  }
}
