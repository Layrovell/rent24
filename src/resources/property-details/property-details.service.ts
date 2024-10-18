import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Property, PropertyDetails } from 'src/entities';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { WallTypeService } from '../wall-type/wall-type.service';
import { UpdatePropertyDetailsDto } from './dto/update-property-details.dto';

@Injectable()
export class PropertyDetailsService {
  constructor(
    @Inject(PropertyDetails)
    private readonly propertyDetailsRepository: Repository<PropertyDetails>,
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
    property: Property,
    dto: CreatePropertyDetailsDto
  ): Promise<any> {
    const { wallType } = dto; // wallType code

    const existingWallType = await this.wallTypeService.getByCode(
      wallType as any
    );

    const existingDetails = await this.propertyDetailsRepository.findOneBy({
      propertyId: property.id,
    });

    if (existingDetails) {
      throw new BadRequestException(
        `Details for property with ID ${property.id} were already created`
      );
    }

    const details = await this.propertyDetailsRepository.save({
      ...dto,
      wallType: existingWallType,
      property: property,
    });

    return details;
  }

  async updateById(
    detailsId: number,
    dto: UpdatePropertyDetailsDto
  ): Promise<PropertyDetails> {
    const existingDetails = await this.getById(detailsId);

    const { wallType } = dto; // wallType code

    const existingWallType = await this.wallTypeService.getByCode(
      wallType as any
    );

    return await this.propertyDetailsRepository.save({
      id: existingDetails.id,
      ...existingDetails,
      ...dto,
      wallType: existingWallType,
    });
  }
}
