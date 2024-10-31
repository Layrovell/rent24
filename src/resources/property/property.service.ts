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
import { UpdatePropertyModerationStatusDto } from './dto/update-moderation-status.dto';
import { ActivityCode } from 'src/lib/activities';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class PropertyService {
  private limit = 5;

  constructor(
    @Inject(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly userService: UsersService,
    private readonly activityLogService: ActivityLogService
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

  async viewProperty(propertyId: number): Promise<Property> {
    const property = await this.getPropertyById(propertyId);

    await this.activityLogService.createActivityLog({
      userId: property.userId,
      activityCode: ActivityCode.PROPERTY_VIEWED,
    });

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

    await this.activityLogService.createActivityLog({
      userId: dto.userId,
      activityCode: ActivityCode.PROPERTY_CREATED,
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

    if (userId !== existingProperty.userId) {
      throw new UnauthorizedException('You can not update this property');
    }

    await this.activityLogService.createActivityLog({
      userId: existingProperty.userId,
      activityCode: ActivityCode.PROPERTY_UPDATED,
    });

    return await this.propertyRepository.save({
      id: existingProperty.id,
      ...existingProperty,
      ...dto,
      details,
    });
  }

  async removeProperty(propertyId: number, userId: number): Promise<void> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.userId) {
      throw new UnauthorizedException('You can not delete this property');
    }

    await this.activityLogService.createActivityLog({
      userId: existingProperty.userId,
      activityCode: ActivityCode.PROPERTY_DELETED,
    });

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

  async getNotModetared(): Promise<Property[]> {
    const properties = await this.propertyRepository.find({
      where: {
        isModerated: false,
      },
      relations: {
        user: true,
      },
    });

    return properties;
  }
}
