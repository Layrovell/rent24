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
import { PropertyDetailsService } from '../property-details/property-details.service';
import { CreatePropertyDetailsDto } from '../property-details/dto/create-property-details.dto';
import { UpdatePropertyDetailsDto } from '../property-details/dto/update-property-details.dto';

@Injectable()
export class PropertyService {
  private limit = 5;

  constructor(
    @Inject(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly userService: UsersService,
    private readonly propertyDetailsService: PropertyDetailsService
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
      relations: {
        user: true,
        details: true,
      },
    });
  }

  async getPropertyDetails(propertyId: number): Promise<PropertyDetails> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (!existingProperty.detailsId) {
      throw new NotFoundException(
        `No details found for property with ID ${propertyId}`
      );
    }

    const details = await this.propertyDetailsService.getById(
      existingProperty.detailsId
    );

    return details;
  }

  async addDetailsToProperty(
    propertyId: number,
    dto: CreatePropertyDetailsDto,
    userId: number
  ): Promise<PropertyDetails> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException(
        `You can not add details to property with ID ${propertyId}`
      );
    }

    const details = await this.propertyDetailsService.createDetails(
      existingProperty,
      dto
    );

    await this.updateProperty(existingProperty.id, userId, {}, details);

    return details;
  }

  async updatePropertyDetails(
    propertyId: number,
    dto: UpdatePropertyDetailsDto,
    userId: number
  ): Promise<PropertyDetails> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException(
        `You can not add details to property with ID ${propertyId}`
      );
    }

    return this.propertyDetailsService.updateById(
      existingProperty.detailsId,
      dto
    );
  }
}
