import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserHelperProvider } from './userMapper.provider';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';

import { ViewUserDto } from './dto/view-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ViewActivityLogDto } from '../activity-log/dto/view-activity-log.dto';
import { UserProfileService } from '../user-profile/user-profile.service';
import { ViewUserProfileDto } from '../user-profile/dto/view-user-profile.dto';
import { UpdateUserProfileDto } from '../user-profile/dto/update-user-profile.dto';
import { Favorites } from 'src/entities/favorites.entity';
import { FavoritesService } from '../favorites/favorites.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userHelperProvider: UserHelperProvider,
    private readonly activityLogService: ActivityLogService,
    private readonly userProfileService: UserProfileService,
    private readonly favoritesService: FavoritesService
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<ViewUserDto[]> {
    const users = await this.userService.getAllUsers();

    return this.userHelperProvider.userListToViewDto(users);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') userId: number): Promise<ViewUserDto> {
    const user = await this.userService.getUserById(userId);

    return this.userHelperProvider.userToViewDto(user);
  }

  @Get(':id/profile')
  @UseGuards(JwtAuthGuard)
  async getUserProfile(
    @Param('id') userId: number
  ): Promise<ViewUserProfileDto> {
    const user = await this.userService.getUserById(userId);

    return await this.userProfileService.getProfileByUser(user);
  }

  @Get(':id/activity-logs')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async getActivityLogs(
    @Param('id') userId: number
  ): Promise<ViewActivityLogDto[]> {
    return await this.activityLogService.getActivityLogsByUserId(userId);
  }

  @Get(':id/favorites')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async getUserFavorites(@Param('id') userId: number): Promise<Favorites[]> {
    return this.favoritesService.getFavoritesByUserId(userId);
  }

  @Put('recovery/:id')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async recoverUser(@Param('id') userId: number): Promise<ViewUserDto> {
    return await this.userService.recoverUser(userId);
  }

  @Patch(':id/profile')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async updateUserProfile(
    @Param('id') userId: number,
    @Body() dto: UpdateUserProfileDto
  ): Promise<any> {
    const user = await this.userService.getUserById(userId);

    return await this.userProfileService.updateProfileByUser(user, dto);
  }

  @Patch(':id/favorites/:propertyId')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async toggleFavorite(
    @Param('id') userId: number,
    @Param('propertyId') propertyId: number
  ): Promise<void> {
    return this.favoritesService.toggleFavorite(userId, propertyId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async deleteUserAndAllRelated(
    @Param('id') userId: number
  ): Promise<{ message: string }> {
    await this.userService.softDeleteUser(userId);

    return { message: `User with ID ${userId} has been soft-deleted` }; // Return success message
  }
}
