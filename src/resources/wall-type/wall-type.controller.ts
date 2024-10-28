import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { WallType } from 'src/entities';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { WallTypeService } from './wall-type.service';
import { wallTypesSeedData } from 'src/lib/activities';

@ApiTags('wall-type')
@Controller('wall-type')
export class WallTypeController {
  constructor(private readonly wallTypeService: WallTypeService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAll(): Promise<WallType[]> {
    return await this.wallTypeService.getAllRecords();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getById(@Param('id') wallTypeId: number): Promise<WallType> {
    return await this.wallTypeService.getById(wallTypeId);
  }

  @Post('load')
  @UseGuards(JwtAuthGuard)
  // TODO: replace endpoint with separate script
  @ApiResponse({ status: 201, description: 'Wall types loaded to the table' })
  async loadWallTypesData(): Promise<WallType[]> {
    return await this.wallTypeService.load(wallTypesSeedData);
  }

  // @Patch(':id')
  // async updateById() {}

  // @Delete(':id')
  // async deleteById() {}
}
