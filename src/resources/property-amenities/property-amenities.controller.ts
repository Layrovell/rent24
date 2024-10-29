import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PropertyAmenitiesHelperProvider } from './property-amenities-helper.provider';
import { PropertyAmenitiesService } from './property-amenities.service';
import { ViewPropertyAmenitiesDto } from './dto/view-property-amenities.dto';
import { CreatePropertyAmenityDto } from './dto/create-property-amenity.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('property-amenities')
@Controller('properties/:propertyId/amenities')
export class PropertyAmenitiesController {
  constructor(
    private readonly propertyAmenitiesService: PropertyAmenitiesService,
    private readonly propertyAmenitiesHelperProvider: PropertyAmenitiesHelperProvider
  ) {}

  @Get()
  async getPropertyAmenities(
    @Param('propertyId') propertyId: number
  ): Promise<ViewPropertyAmenitiesDto[]> {
    const records =
      await this.propertyAmenitiesService.getAmenitiesByPropertyId(propertyId);

    return this.propertyAmenitiesHelperProvider.listToViewDto(records);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async postAmenitiesByPropertyId(
    @Param('propertyId') propertyId: number,
    @Body() dto: CreatePropertyAmenityDto[],
    @Req() request: any
  ): Promise<void> {
    const currentUserId = request.user.id;

    return await this.propertyAmenitiesService.addAmenities(
      propertyId,
      dto,
      currentUserId
    );
  }
}
