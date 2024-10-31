import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ActivityLogHelperProvider } from './activity-log-helper.provider';
import { ViewActivityLogDto } from './dto/view-activity-log.dto';
import { ActivityLogService } from './activity-log.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';

@ApiTags('activity-logs')
@Controller('activity-logs')
export class ActivityLogController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly activityLogHelperProvider: ActivityLogHelperProvider
  ) {}

  @Get('')
  async getAll(): Promise<ViewActivityLogDto[]> {
    const data = await this.activityLogService.getAll();

    return this.activityLogHelperProvider.listToViewDto(data);
  }

  @Get(':userId')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async getActivityLogs(
    @Param('userId') userId: number
  ): Promise<ViewActivityLogDto[]> {
    const data = await this.activityLogService.getActivityLogsByUserId(userId);

    return this.activityLogHelperProvider.listToViewDto(data);
  }
}
