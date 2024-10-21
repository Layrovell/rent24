import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Amenities } from 'src/entities/amenities.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';

@Injectable()
export class AmenitiesService {
  constructor(
    @Inject(Amenities)
    private readonly amenitiesRepository: Repository<Amenities>
  ) {}

  async load(dto: CreateAmenityDto[]): Promise<Amenities[]> {
    return await this.amenitiesRepository.save(dto);
  }

  async getAll(): Promise<Amenities[]> {
    return await this.amenitiesRepository.find();
  }

  async create(dto: CreateAmenityDto): Promise<Amenities> {
    const { code, valueType, unit } = dto;

    const existingRecord = await this.amenitiesRepository.findOneBy({ code });

    if (existingRecord) {
      throw new BadRequestException(`Amenity with name ${name} already exists`);
    }

    const amenity = this.amenitiesRepository.create({
      code,
      unit,
      valueType,
    });

    return await this.amenitiesRepository.save(amenity);
  }

  async remove(id: number): Promise<void> {
    const existing = await this.amenitiesRepository.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    await this.amenitiesRepository.remove(existing);
  }

  async getByName(code: string): Promise<Amenities> {
    const existing = await this.amenitiesRepository.findOneBy({ code });

    if (!existing) {
      throw new NotFoundException(`Amenity with name ${name} not found`);
    }

    return existing;
  }
}
