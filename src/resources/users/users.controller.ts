import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserHelperProvider } from './user-helper.provider';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';

import { ViewUserDto } from './dto/view-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ViewActivityLogDto } from '../activity-log/dto/view-activity-log.dto';
import { Favorites } from 'src/entities/favorites.entity';
import { FavoritesService } from '../favorites/favorites.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userHelperProvider: UserHelperProvider,
    private readonly activityLogService: ActivityLogService,
    private readonly favoritesService: FavoritesService
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<ViewUserDto[]> {
    const users = await this.userService.getAllUsers();

    return this.userHelperProvider.listToViewDto(users);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('userId') userId: number): Promise<ViewUserDto> {
    const user = await this.userService.getUserById(userId);

    return this.userHelperProvider.toViewDto(user);
  }

  @Get(':userId/activity-logs')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async getActivityLogs(
    @Param('userId') userId: number
  ): Promise<ViewActivityLogDto[]> {
    return await this.activityLogService.getActivityLogsByUserId(userId);
  }

  @Get(':userId/favorites')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async getUserFavorites(
    @Param('userId') userId: number
  ): Promise<Favorites[]> {
    return this.favoritesService.getFavoritesByUserId(userId);
  }

  @Put('recovery/:userId')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async recoverUser(@Param('userId') userId: number): Promise<ViewUserDto> {
    return await this.userService.recoverUser(userId);
  }

  @Patch(':userId/favorites/:propertyId')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async toggleFavorite(
    @Param('userId') userId: number,
    @Param('propertyId') propertyId: number
  ): Promise<void> {
    return this.favoritesService.toggleFavorite(userId, propertyId);
  }

  @Delete(':userId')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async deleteUserAndAllRelated(
    @Param('userId') userId: number
  ): Promise<{ message: string }> {
    await this.userService.softDeleteUser(userId);

    return { message: `User with ID ${userId} has been soft-deleted` }; // Return success message
  }
}
