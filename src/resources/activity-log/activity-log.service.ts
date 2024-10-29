import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ActivityLog } from 'src/entities';
import { User } from 'src/entities';
import { ActivitiesService } from '../activities/activities.service';
import { ActivityLogHelperProvider } from './activity-log-helper.provider';
import { ViewActivityLogDto } from './dto/view-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @Inject(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    private readonly activitiesService: ActivitiesService, // Inject ActivityTypeService
    private readonly activityLogHelperProvider: ActivityLogHelperProvider
  ) {}

  async getAll(): Promise<ActivityLog[]> {
    return await this.activityLogRepository.find({
      relations: {
        activity: true,
        user: true,
      },
    });
  }

  async createActivityLog({
    user,
    activityCode,
  }: {
    user: User;
    activityCode: string;
  }) {
    const activity = await this.activitiesService.findByCode(activityCode);

    if (!activity) {
      throw new BadRequestException(`Invalid activity type: ${activityCode}`);
    }

    const activityLog = this.activityLogRepository.create({
      user,
      activity,
    });

    await this.activityLogRepository.save(activityLog);
  }

  // Fetch all activity logs for a user
  async getActivityLogsByUserId(userId: number): Promise<ViewActivityLogDto[]> {
    const data = await this.activityLogRepository.find({
      where: { user: { id: userId } },
      relations: {
        activity: true,
        user: true,
      },
      order: { createdAt: 'DESC' }, // Order by most recent activity
    });

    return this.activityLogHelperProvider.listToViewDto(data);
  }
}
