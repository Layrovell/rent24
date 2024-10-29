import { Injectable } from '@nestjs/common';

import { ActivityLog } from 'src/entities';
import { ViewActivityLogDto } from './dto/view-activity-log.dto';

@Injectable()
export class ActivityLogHelperProvider {
  listToViewDto(activities: ActivityLog[]): ViewActivityLogDto[] {
    const viewListDto = activities.map((activity) => this.toViewDto(activity));

    return viewListDto;
  }

  toViewDto(activity: ActivityLog): ViewActivityLogDto {
    const viewDto = new ViewActivityLogDto();

    viewDto.id = activity.id;
    viewDto.code = activity.activity.code;
    viewDto.description = activity.activity.description;
    viewDto.createdAt = activity.createdAt;
    viewDto.userId = activity.user.id;

    return viewDto;
  }
}
