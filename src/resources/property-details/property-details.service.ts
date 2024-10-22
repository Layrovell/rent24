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
    const existingDetails = await this.propertyDetailsRepository.findOne({
      where: {
        id: detailsId,
      },
      relations: {
        wallType: true,
      },
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
    const existingWallType = await this.wallTypeService.getById(dto.wallTypeId);

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
      wallTypeId: existingWallType.id,
      property: property,
    });

    return details;
  }

  async updateById(
    detailsId: number,
    dto: UpdatePropertyDetailsDto
  ): Promise<PropertyDetails> {
    const existingDetails = await this.getById(detailsId);

    const existingWallType = await this.wallTypeService.getById(dto.wallTypeId);

    return await this.propertyDetailsRepository.save({
      id: existingDetails.id,
      ...existingDetails,
      ...dto,
      wallTypeId: existingWallType.id,
    });
  }

  async getTableSchema() {
    const metadata = this.propertyDetailsRepository.metadata;
    const columns = metadata.columns.map((column) => ({
      name: column.propertyName,
      type: column.type,
    }));

    return columns;
  }
}
