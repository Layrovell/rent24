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
import { UpdatePropertyModerationStatusDto } from './dto/update-moderation-status.dto';
import { Roles } from 'src/decorators/roles.decorator';
import { Role as UserRole } from 'src/entities/user.entity';
import { RolesGuard } from 'src/guards/auth.guard';

@ApiTags('properties')
@Controller('properties')
export class PropertyController {
  constructor(
    private readonly propertyService: PropertyService,
    private readonly propertyHelperProvider: PropertyHelperProvider
  ) {}

  @Get('')
  async getAll(): Promise<ViewPropertyDto[]> {
    const properties = await this.propertyService.getAll();
    return this.propertyHelperProvider.listToViewDto(properties);
  }

  @Get('on-moderation') // for 'admin' role ideally
  @Roles(UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getNotModerated(): Promise<any> {
    const properties = await this.propertyService.getNotModetared();

    return this.propertyHelperProvider.listToViewDto(properties);
  }

  @Get(':id')
  async getById(@Param('id') propertyId: number): Promise<ViewPropertyDto> {
    const property = await this.propertyService.viewProperty(propertyId);
    return this.propertyHelperProvider.toViewDto(property);
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createProperty(
    @Body() dto: CreatePropertyDto
  ): Promise<ViewPropertyDto> {
    const property = await this.propertyService.createProperty(dto);

    return this.propertyHelperProvider.toViewDto(property);
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

  // TODO: should we get the entire property with all the info
  // (relations, except user) or take ones from separate API endpoints?
  @Patch(':id/on-moderation')
  @Roles(UserRole.MODERATOR)
  @UseGuards(JwtAuthGuard, RolesGuard) // TODO: ideally only for 'admin' role. Requires refactoring roles enum to table
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
