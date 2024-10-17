import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { CreatePropertyDetailsDto } from './dto/create-property-details.dto';
import { PropertyDetailsService } from './property-details.service';

@Controller('property-details')
export class PropertyDetailsController {
  // push new detail records for admins
  constructor(
    private readonly propertyDetailsService: PropertyDetailsService
  ) {}

  @Post(':propertyId')
  @UseGuards(JwtAuthGuard)
  async createDetailsByPropertyId(
    @Param('propertyId') propertyId: number,
    @Req() request: any,
    @Body() dto: CreatePropertyDetailsDto
  ): Promise<any> {
    const currentUserId = request.user.id;

    const details = await this.propertyDetailsService.createDetails(
      propertyId,
      currentUserId,
      dto
    );

    return details;
  }
}
