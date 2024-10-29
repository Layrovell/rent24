import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { PropertyDetailsService } from './property-details.service';
import { PropertyDetailsHelperProvider } from './property-details-helper.provider';
import { ViewPropertyDetailsDto } from './dto/view-property-details.dto';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { UpdatePropertyDetailsDto } from './dto/update-property-details.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('property-details')
@Controller('properties/:propertyId/details')
export class PropertyDetailsController {
  constructor(
    private readonly propertyDetailsService: PropertyDetailsService,
    private readonly propertyDetailsHelperProvider: PropertyDetailsHelperProvider
  ) {}

  @Get('schema')
  async getTableSchema() {
    return this.propertyDetailsService.getTableSchema();
  }

  @Get()
  async getPropertyDetails(
    @Param('propertyId') propertyId: number
  ): Promise<ViewPropertyDetailsDto> {
    const details =
      await this.propertyDetailsService.getPropertyDetails(propertyId);

    return this.propertyDetailsHelperProvider.toViewDto(details);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async postDetailsByPropertyId(
    @Param('propertyId') propertyId: number,
    @Body() dto: CreatePropertyDetailsDto,
    @Req() request: any
  ): Promise<ViewPropertyDetailsDto> {
    const currentUserId = request.user.id;

    const details = await this.propertyDetailsService.addDetailsToProperty(
      propertyId,
      dto,
      currentUserId
    );

    return this.propertyDetailsHelperProvider.toViewDto(details);
  }

  @Patch()
  @UseGuards(JwtAuthGuard)
  async updatePropertyDetails(
    @Param('propertyId') propertyId: number,
    @Req() request: any,
    @Body() dto: UpdatePropertyDetailsDto
  ): Promise<ViewPropertyDetailsDto> {
    const currentUserId = request.user.id;

    const updatedDetails =
      await this.propertyDetailsService.updatePropertyDetails(
        propertyId,
        dto,
        currentUserId
      );

    return this.propertyDetailsHelperProvider.toViewDto(updatedDetails);
  }
}
