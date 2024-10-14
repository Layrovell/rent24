import { Injectable } from '@nestjs/common';

import { ActivityLog } from 'src/entities';
import { ViewActivityLogDto } from './dto/view-activity-log.dto';

@Injectable()
export class ActivityLogHelperProvider {
  activitiesToViewDto(activities: ActivityLog[]): ViewActivityLogDto[] {
    const viewPropertiesListDto = activities.map((activity) =>
      this.activityToViewDto(activity)
    );

    return viewPropertiesListDto;
  }

  activityToViewDto(activity: ActivityLog): ViewActivityLogDto {
    const viewActivityDto = new ViewActivityLogDto();

    viewActivityDto.id = activity.id;
    viewActivityDto.code = activity.activity.code;
    viewActivityDto.description = activity.activity.description;
    viewActivityDto.createdAt = activity.createdAt;
    viewActivityDto.userId = activity.user.id;

    return viewActivityDto;
  }
}
