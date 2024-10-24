import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { Amenities } from 'src/entities/amenities.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { UpdateAmenityDto } from './dto/update-amenity.dto';

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
      throw new BadRequestException(`Amenity with code ${code} already exists`);
    }

    const amenity = this.amenitiesRepository.create({
      code,
      unit,
      valueType,
    });

    return await this.amenitiesRepository.save(amenity);
  }

  async getById(id: number): Promise<Amenities> {
    const existing = await this.amenitiesRepository.findOneBy({ id });

    if (!existing) {
      throw new NotFoundException(`Amenity with ID ${id} not found`);
    }

    return existing;
  }

  async updateById(id: number, dto: UpdateAmenityDto): Promise<Amenities> {
    const existing = await this.getById(id);

    return await this.amenitiesRepository.save({
      id: existing.id,
      ...existing,
      ...dto,
    });
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
      throw new NotFoundException(`Amenity with code ${code} not found`);
    }

    return existing;
  }
}
