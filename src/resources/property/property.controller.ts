import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyService } from './property.service';
import { ViewPropertyDto } from './dto/view-property.dto';
import { PropertyHelperProvider } from './property-helper.provider';
import { Property } from 'src/entities';
import { UpdatePropertyDto } from './dto/update-property.dto';

@ApiTags('properties')
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

  @Get(':id')
  async getById(@Param('id') propertyId: number) {
    return await this.propertyService.getPropertyById(propertyId);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createProperty(
    @Body() dto: CreatePropertyDto
  ): Promise<ViewPropertyDto> {
    const property = await this.propertyService.createProperty(dto);

    return this.propertyHelperProvider.propertyToViewDto(property);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateProperty(
    @Param('id') propertyId: number,
    @Req() request: any,
    @Body() dto: UpdatePropertyDto
  ): Promise<ViewPropertyDto> {
    const currentUserId = request.user.id;

    // TODO: Add reusable validator for invalid props
    const invalidFields = ['city', 'country', 'userId'];
    const bodyKeys = Object.keys(dto);

    const invalidProps = bodyKeys.filter((key) => invalidFields.includes(key));

    if (invalidProps.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidProps.join(', ')}`
      );
    }

    return await this.propertyService.updateProperty(
      propertyId,
      currentUserId,
      dto
    );
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
