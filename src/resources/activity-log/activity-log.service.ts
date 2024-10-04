import { Inject, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';

import { ActivityLog } from 'src/entities';
import { User } from 'src/entities';
import { ActivityType } from 'src/entities/activity-log.entity';

@Injectable()
export class ActivityLogService {
  constructor(
    @Inject(ActivityLog)
    private activityLogRepository: Repository<ActivityLog>
  ) {}

  async createActivityLog(
    user: User,
    activityType: ActivityType,
    description?: string
  ) {
    // const user = await this.userService.getUserById(id);

    const activityLog = this.activityLogRepository.create({
      user,
      activityType: activityType,
      description: description,
    });

    await this.activityLogRepository.save(activityLog);
  }

  // Fetch all activity logs for a user
  async getActivityLogsByUserId(userId: number): Promise<ActivityLog[]> {
    return await this.activityLogRepository.find({
      where: { user: { id: userId } },
      order: { timestamp: 'DESC' }, // Order by most recent activity
    });
  }
}
