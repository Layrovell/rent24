import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';
import { UserProfileService } from './user-profile.service';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { ViewUserProfileDto } from './dto/view-user-profile.dto';
import { UserProfileHelperProvider } from './user-profile-helper.provider';

@Controller('users/:userId/user-profile')
export class UserProfileController {
  constructor(
    private readonly userProfileService: UserProfileService,
    private readonly userProfileHelperProvider: UserProfileHelperProvider
  ) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getUserProfile(
    @Param('userId') userId: number
  ): Promise<ViewUserProfileDto> {
    const profile = await this.userProfileService.getProfileByUserId(userId);

    return this.userProfileHelperProvider.toViewDto(profile);
  }

  @Post()
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async createUserProfile(
    @Param('userId') userId: number,
    @Body() dto: CreateUserProfileDto
  ): Promise<ViewUserProfileDto> {
    const profile = await this.userProfileService.createUserProfile(
      userId,
      dto
    );

    return this.userProfileHelperProvider.toViewDto(profile);
  }

  @Patch()
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async updateUserProfile(
    @Param('userId') userId: number,
    @Body() dto: UpdateUserProfileDto
  ): Promise<ViewUserProfileDto> {
    const profile = await this.userProfileService.updateProfileByUser(
      userId,
      dto
    );

    return this.userProfileHelperProvider.toViewDto(profile);
  }
}
