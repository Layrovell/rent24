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
import { UpdatePropertyDto } from './dto/update-property.dto';
import { CreatePropertyDetailsDto } from '../property-details/dto/create-property-details.dto';
import { ViewPropertyDetailsDto } from '../property-details/dto/view-property-details.dto';
import { PropertyDetailsHelperProvider } from '../property-details/property-details-helper.provider';
import { UpdatePropertyDetailsDto } from '../property-details/dto/update-property-details.dto';
import { CreatePropertyAmenityDto } from '../property-amenities/dto/create-property-amenity.dto';
import { PropertyAmenitiesHelperProvider } from '../property-amenities/property-amenities-helper.provider';
import { ViewPropertyAmenitiesDto } from '../property-amenities/dto/view-property-amenities.dto';
import { UpdatePropertyModerationStatusDto } from './dto/update-moderation-status.dto';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly propertyHelperProvider: PropertyHelperProvider,
    private readonly propertyDetailsHelperProvider: PropertyDetailsHelperProvider,
    private readonly propertyAmenitiesHelperProvider: PropertyAmenitiesHelperProvider
  ) {}

  @Get('')
  async getAll(): Promise<ViewPropertyDto[]> {
    const properties = await this.propertyService.getAll();
    return this.propertyHelperProvider.listToViewDto(properties);
  }

  @Get(':id')
  async getById(@Param('id') propertyId: number): Promise<ViewPropertyDto> {
    const property = await this.propertyService.getPropertyById(propertyId);
    return this.propertyHelperProvider.toViewDto(property);
  }

  @Get(':id/details')
  async getPropertyDetails(
    @Param('id') id: number
  ): Promise<ViewPropertyDetailsDto> {
    const details = await this.propertyService.getPropertyDetails(id);

    return this.propertyDetailsHelperProvider.toViewDto(details);
  }

  @Get(':id/amenities')
  async getPropertyAmenities(
    @Param('id') id: number
  ): Promise<ViewPropertyAmenitiesDto[]> {
    const records = await this.propertyService.getAmenities(id);

    return this.propertyAmenitiesHelperProvider.listToViewDto(records);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createProperty(
    @Body() dto: CreatePropertyDto
  ): Promise<ViewPropertyDto> {
    const property = await this.propertyService.createProperty(dto);

    return this.propertyHelperProvider.toViewDto(property);
  }

  @Post(':id/details')
  @UseGuards(JwtAuthGuard)
  async postDetailsByPropertyId(
    @Param('id') id: number,
    @Body() dto: CreatePropertyDetailsDto,
    @Req() request: any
  ): Promise<ViewPropertyDetailsDto> {
    const currentUserId = request.user.id;

    const details = await this.propertyService.addDetailsToProperty(
      id,
      dto,
      currentUserId
    );

    return this.propertyDetailsHelperProvider.toViewDto(details);
  }

  @Post(':id/amenities')
  @UseGuards(JwtAuthGuard)
  async postAmenitiesByPropertyId(
    @Param('id') id: number,
    @Body() dto: CreatePropertyAmenityDto[],
    @Req() request: any
  ): Promise<void> {
    const currentUserId = request.user.id;

    return await this.propertyService.addAmenities(id, dto, currentUserId);
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

  @Patch(':id/details')
  @UseGuards(JwtAuthGuard)
  async updatePropertyDetails(
    @Param('id') id: number,
    @Req() request: any,
    @Body() dto: UpdatePropertyDetailsDto
  ): Promise<ViewPropertyDetailsDto> {
    const currentUserId = request.user.id;

    const updatedDetails = await this.propertyService.updatePropertyDetails(
      id,
      dto,
      currentUserId
    );

    return this.propertyDetailsHelperProvider.toViewDto(updatedDetails);
  }

  @Patch(':id/on-moderating')
  @UseGuards(JwtAuthGuard) // TODO: ideally only for 'admin' role. Requires refactoring roles enum to table
  async setModeratedStatus(
    @Param('id') id: number,
    @Body() dto: UpdatePropertyModerationStatusDto
  ): Promise<ViewPropertyDto> {
    const property = await this.propertyService.moderate(id, dto);

    return this.propertyHelperProvider.toViewDto(property);
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

  // @Delete() all amenities in property by id
}
