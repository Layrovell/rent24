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

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { PropertyDetailsService } from './property-details.service';
import { PropertyDetails } from 'src/entities';
import { UpdatePropertyDetailsDto } from './dto/update-property-details.dto';

@Controller('property-details')
export class PropertyDetailsController {
  // push new detail records for admins
  constructor(
    private readonly propertyDetailsService: PropertyDetailsService
  ) {}

  @Get(':detailsId')
  async getDetailsById(
    @Param('detailsId') detailsId: number
  ): Promise<PropertyDetails> {
    return await this.propertyDetailsService.getById(detailsId);
  }

  @Post(':propertyId')
  @UseGuards(JwtAuthGuard)
  async createDetailsByPropertyId(
    @Param('propertyId') propertyId: number,
    @Req() request: any,
    @Body() dto: CreatePropertyDetailsDto
  ): Promise<PropertyDetails> {
    const currentUserId = request.user.id;

    const details = await this.propertyDetailsService.createDetails(
      propertyId,
      currentUserId,
      dto
    );

    return details;
  }

  @Patch(':propertyId')
  async updateDetailsById(
    @Param('propertyId') propertyId: number,
    @Body() dto: UpdatePropertyDetailsDto
  ): Promise<PropertyDetails> {
    return this.propertyDetailsService.updateById(propertyId, dto);
  }
}
