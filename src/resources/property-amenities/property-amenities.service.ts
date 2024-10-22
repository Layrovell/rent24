import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { PropertyAmenities } from 'src/entities/property-amenities.entity';
import { CreatePropertyAmenityDto } from './dto/create-property-amenity.dto';
import { AmenitiesService } from '../amenities/amenities.service';

@Injectable()
export class PropertyAmenitiesService {
  constructor(
    @Inject(PropertyAmenities)
    private readonly propertyAmenitiesRepository: Repository<PropertyAmenities>,
    private readonly amenitiesService: AmenitiesService
  ) {}

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

      // If property with the same amenity already exists, return null; otherwise, create a new one
      if (existingAmenity) {
        console.log(
          `Amenity ${amenity.code} already exists for property ${propertyId}. Skipping...`
        );
        return null; // Skip the existing amenity
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
