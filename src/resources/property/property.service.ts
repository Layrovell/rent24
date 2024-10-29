import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { UsersService } from '../users/users.service';
import { Property, PropertyDetails } from 'src/entities';
import { PropertyAmenities } from 'src/entities/property-amenities.entity';
import { PropertyAmenitiesService } from '../property-amenities/property-amenities.service';
import { CreatePropertyAmenityDto } from '../property-amenities/dto/create-property-amenity.dto';
import { UpdatePropertyModerationStatusDto } from './dto/update-moderation-status.dto';

@Injectable()
export class PropertyService {
  private limit = 5;

  constructor(
    @Inject(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly userService: UsersService,
    private readonly propertyAmenitiesService: PropertyAmenitiesService
  ) {}

  async getPropertyById(propertyId: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: {
        id: propertyId,
      },
      relations: {
        user: true,
        details: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    return property;
  }

  async findOneBy(options: any) {
    const property = await this.propertyRepository.findOneBy(options);

    if (!property) {
      throw new NotFoundException(`Property not found`);
    }

    return property;
  }

  async createProperty(dto: CreatePropertyDto): Promise<Property> {
    const existingUser = await this.userService.getUserById(dto.userId);

    const propertiesCount = await this.propertyRepository.count({
      where: {
        user: {
          id: existingUser.id,
        },
      },
    });

    if (propertiesCount >= this.limit) {
      throw new BadRequestException('Property limit reached');
    }

    const property = this.propertyRepository.create({
      ...dto,
      user: existingUser,
    });

    return this.propertyRepository.save(property);
  }

  async updateProperty(
    propertyId: number,
    userId: number,
    dto: UpdatePropertyDto,
    details?: PropertyDetails
  ): Promise<Property> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException('You can not update this property');
    }

    return await this.propertyRepository.save({
      id: existingProperty.id,
      ...existingProperty,
      ...dto,
      details,
    });
  }

  async removeProperty(propertyId: number, userId: number): Promise<void> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException('You can not delete this property');
    }

    await this.propertyRepository.remove(existingProperty);
  }

  async getAll(): Promise<Property[]> {
    return await this.propertyRepository.find({
      where: {
        isModerated: true,
      },
      relations: {
        user: true,
        details: true,
      },
    });
  }

  async getAmenities(propertyId: number): Promise<PropertyAmenities[]> {
    const existingProperty = await this.getPropertyById(propertyId);

    return this.propertyAmenitiesService.getByPropertyId(existingProperty.id);
  }

  async addAmenities(
    propertyId: number,
    dto: CreatePropertyAmenityDto[],
    userId: number
  ) {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException(
        `You can not add details to property with ID ${propertyId}`
      );
    }

    return await this.propertyAmenitiesService.addByPropertyId(
      existingProperty.id,
      dto
    );
  }

  async moderate(
    propertyId: number,
    dto: UpdatePropertyModerationStatusDto
  ): Promise<Property> {
    const property = await this.getPropertyById(propertyId);

    return await this.propertyRepository.save({
      id: property.id,
      ...property,
      ...dto,
    });
  }
}
