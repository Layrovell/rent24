import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Property, PropertyDetails } from 'src/entities';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { WallTypeService } from '../wall-type/wall-type.service';
import { UpdatePropertyDetailsDto } from './dto/update-property-details.dto';
import { PropertyService } from '../property/property.service';

@Injectable()
export class PropertyDetailsService {
  constructor(
    @Inject(PropertyDetails)
    private readonly propertyDetailsRepository: Repository<PropertyDetails>,
    private readonly wallTypeService: WallTypeService,
    private readonly propertyService: PropertyService
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

    const existingWallType = await this.wallTypeService.getById(dto.wallTypeId);

    return await this.propertyDetailsRepository.save({
      id: existingDetails.id,
      ...existingDetails,
      ...dto,
      wallType: existingWallType,
    });
  }

  async getPropertyDetails(propertyId: number): Promise<PropertyDetails> {
    const property = await this.propertyService.getPropertyById(propertyId);

    // check & refactor
    if (!property.detailsId) {
      throw new NotFoundException(
        `No details found for property with ID ${propertyId}`
      );
    }

    const details = await this.getById(property.detailsId);

    return details;
  }

  async addDetailsToProperty(
    propertyId: number,
    dto: CreatePropertyDetailsDto,
    userId: number
  ): Promise<PropertyDetails> {
    const property = await this.propertyService.getPropertyById(propertyId);

    if (userId !== property.user.id) {
      throw new UnauthorizedException(
        `You can not add details to property with ID ${propertyId}`
      );
    }

    const details = await this.createDetails(property, dto);

    await this.propertyService.updateProperty(property.id, userId, {}, details);

    return details;
  }

  async updatePropertyDetails(
    propertyId: number,
    dto: UpdatePropertyDetailsDto,
    userId: number
  ): Promise<PropertyDetails> {
    const property = await this.propertyService.getPropertyById(propertyId);

    if (userId !== property.user.id) {
      throw new UnauthorizedException(
        `You can not add details to property with ID ${propertyId}`
      );
    }

    return this.updateById(property.detailsId, dto);
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
