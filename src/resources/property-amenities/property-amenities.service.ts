import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { PropertyAmenities } from 'src/entities/property-amenities.entity';
import { CreatePropertyAmenityDto } from './dto/create-property-amenity.dto';
import { AmenitiesService } from '../amenities/amenities.service';
import { PropertyService } from '../property/property.service';

@Injectable()
export class PropertyAmenitiesService {
  constructor(
    @Inject(PropertyAmenities)
    private readonly propertyAmenitiesRepository: Repository<PropertyAmenities>,
    private readonly amenitiesService: AmenitiesService,
    private readonly propertyService: PropertyService
  ) {}

  async getAmenitiesByPropertyId(
    propertyId: number
  ): Promise<PropertyAmenities[]> {
    const existingProperty =
      await this.propertyService.getPropertyById(propertyId);

    return this.getByPropertyId(existingProperty.id);
  }

  async getByPropertyId(propertyId: number): Promise<PropertyAmenities[]> {
    return await this.propertyAmenitiesRepository.find({
      where: {
        property: { id: propertyId },
      },
      relations: {
        amenity: true,
        property: true,
      },
    });
  }

  async addAmenities(
    propertyId: number,
    dto: CreatePropertyAmenityDto[],
    userId: number
  ) {
    const property = await this.propertyService.getPropertyById(propertyId);

    if (userId !== property.user.id) {
      throw new UnauthorizedException(
        `You can not add details to property with ID ${propertyId}`
      );
    }

    return await this.addByPropertyId(property.id, dto);
  }

  async deleteAmenitiesByPropertyId(propertyId: number): Promise<void> {
    await this.propertyAmenitiesRepository.delete({
      property: { id: propertyId },
    });
  }

  async addByPropertyId(propertyId: number, dto: CreatePropertyAmenityDto[]) {
    const propertyAmenitiesPromises = dto.map(async (amenity) => {
      const validAmenity = await this.amenitiesService.getByName(amenity.code);

      const existingAmenity = await this.propertyAmenitiesRepository.findOne({
        where: {
          property: { id: propertyId },
          amenity: { id: validAmenity.id },
        },
      });

      if (existingAmenity) {
        throw new BadRequestException(
          `Amenity ${amenity.code} already exists for property ${propertyId}`
        );
      }

      if (amenity.value === undefined || amenity.value === null) {
        throw new BadRequestException(
          `Amenity ${amenity.code} for property ${propertyId} has an invalid value`
        );
      }

      return this.propertyAmenitiesRepository.create({
        property: { id: propertyId },
        amenity: validAmenity,
        value: amenity.value,
      });
    });

    const propertyAmenities = await Promise.all(propertyAmenitiesPromises);

    // Filter out any null values (existing amenities) and check for valid amenities before saving
    const filteredAmenities = propertyAmenities.filter(
      (amenity): amenity is PropertyAmenities => amenity !== null // Type guard to ensure it's not null
    );

    if (filteredAmenities.length > 0) {
      await this.propertyAmenitiesRepository.save(filteredAmenities);
    }
  }
}
