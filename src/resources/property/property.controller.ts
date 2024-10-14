import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyService } from './property.service';
import { ViewPropertyDto } from './dto/view-property.dto';
import { PropertyHelperProvider } from './property-helper.provider';
import { Property } from 'src/entities';

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly propertyHelperProvider: PropertyHelperProvider
  ) {}

  @Get('')
  async getAll(): Promise<Property[]> {
    return this.propertyService.getAll();
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createProperty(
    @Body() dto: CreatePropertyDto
  ): Promise<ViewPropertyDto> {
    const property = await this.propertyService.createProperty(dto);

    return this.propertyHelperProvider.propertyToViewDto(property);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteProperty(
    @Param('id') propertyId: number,
    @Req() request: any
  ): Promise<void> {
    const currentUserId = request.user.id;

    return await this.propertyService.removeProperty(propertyId, currentUserId);
  }
}
