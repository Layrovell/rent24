import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { UserHelperProvider } from './userMapper.provider';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';

import { ViewUserDto } from './dto/view-user.dto';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityLog } from 'src/entities';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly userHelperProvider: UserHelperProvider,
    private readonly activityLogService: ActivityLogService
  ) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllUsers(): Promise<ViewUserDto[]> {
    const users = await this.userService.getAllUsers();

    return this.userHelperProvider.userListToViewDto(users);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getUserById(@Param('id') id: number): Promise<ViewUserDto> {
    const user = await this.userService.getUserById(id);

    return this.userHelperProvider.userToViewDto(user);
  }

  @Get(':id/activity-logs')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async getActivityLogs(@Param('id') userId: number): Promise<ActivityLog[]> {
    return await this.activityLogService.getActivityLogsByUserId(userId);
  }

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  // SameUserGuard: checks if id param same as id from the token
  updatePassword(
    @Param('id') id: number,
    @Body() dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    return this.userService.updatePassword(id, dto);
  }
}
