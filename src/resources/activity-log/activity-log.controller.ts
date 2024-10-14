import { Controller, Get } from '@nestjs/common';

import { ActivityLogHelperProvider } from './activity-log-helper.provider';
import { ViewActivityLogDto } from './dto/view-activity-log.dto';
import { ActivityLogService } from './activity-log.service';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(
    private readonly activityLogService: ActivityLogService,
    private readonly activityLogHelperProvider: ActivityLogHelperProvider
  ) {}

  @Get('')
  async getAll(): Promise<ViewActivityLogDto[]> {
    const data = await this.activityLogService.getAll();

    return this.activityLogHelperProvider.activitiesToViewDto(data);
  }
}
