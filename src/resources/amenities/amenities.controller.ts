import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { AmenitiesService } from './amenities.service';
import { Amenities } from 'src/entities/amenities.entity';
import { CreateAmenityDto } from './dto/create-amenity.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { amenitiesSeedData } from 'src/lib/activities';

@Controller('amenities')
export class AmenitiesController {
  constructor(private readonly amenitiesService: AmenitiesService) {}

  @Get()
  async getAll(): Promise<Amenities[]> {
    return await this.amenitiesService.getAll();
  }

  @Post()
  async create(@Body() dto: CreateAmenityDto): Promise<Amenities> {
    return await this.amenitiesService.create(dto);
  }

  @Post('load')
  @UseGuards(JwtAuthGuard)
  // TODO: replace endpoint with separate script
  @ApiResponse({ status: 201, description: 'Amenities loaded to the table' })
  async loadWallTypesData(): Promise<Amenities[]> {
    return await this.amenitiesService.load(amenitiesSeedData);
  }

  // @Patch amenity by id

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return this.amenitiesService.remove(id);
  }
}
