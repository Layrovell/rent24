import { Controller, Get } from '@nestjs/common';

import { PropertyDetailsService } from './property-details.service';

@Controller('property-details')
export class PropertyDetailsController {
  constructor(
    private readonly propertyDetailsService: PropertyDetailsService
  ) {}

  @Get('schema')
  async getTableSchema() {
    return this.propertyDetailsService.getTableSchema();
  }
}
