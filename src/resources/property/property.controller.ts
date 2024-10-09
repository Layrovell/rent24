import {
  Body,
  Controller,
  Delete,
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

@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly propertyHelperProvider: PropertyHelperProvider
  ) {}

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
  async deleteProperty(@Param('id') propertyId: number, @Req() request: any) {
    const currentUserId = request.user.id;

    await this.propertyService.removeProperty(propertyId, currentUserId);

    // as part of the HTTP response, not the business logic (service) itself
    return {
      message: `Property with the ID ${propertyId} successfully deleted`,
    };
  }
}
