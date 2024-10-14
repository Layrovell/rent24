import {
  Inject,
  Injectable,
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { CreatePropertyDto } from './dto/create-property.dto';
import { UsersService } from '../users/users.service';
import { Property } from 'src/entities';

@Injectable()
export class PropertyService {
  private limit = 5;

  constructor(
    @Inject(Property)
    private readonly propertyRepository: Repository<Property>,
    private readonly userService: UsersService
  ) {}

  async getPropertyById(propertyId: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: {
        id: propertyId,
      },
      relations: {
        user: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
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

  async removeProperty(propertyId: number, userId: number): Promise<void> {
    const existingProperty = await this.getPropertyById(propertyId);

    if (userId !== existingProperty.user.id) {
      throw new UnauthorizedException('You can not delete this property');
    }

    await this.propertyRepository.remove(existingProperty);
  }

  async getAll(): Promise<Property[]> {
    return await this.propertyRepository.find();
  }
}
