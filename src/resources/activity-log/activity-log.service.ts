import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { ActivityLog } from 'src/entities';
import { UsersService } from '../users/users.service';
import { ActivitiesService } from '../activities/activities.service';
import { CreateActivityLogDto } from './dto/creae-activity-log.dto';

@Injectable()
export class ActivityLogService {
  constructor(
    @Inject(ActivityLog)
    private readonly activityLogRepository: Repository<ActivityLog>,
    private readonly activitiesService: ActivitiesService, // Inject ActivityTypeService
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService
  ) {}

  async getAll(): Promise<ActivityLog[]> {
    return await this.activityLogRepository.find({
      relations: {
        activity: true,
        user: true,
      },
    });
  }

  async createActivityLog({ userId, activityCode }: CreateActivityLogDto) {
    const activity = await this.activitiesService.findByCode(activityCode);

    if (!activity) {
      throw new BadRequestException(`Invalid activity type: ${activityCode}`);
    }

    const user = await this.userService.getUserById(userId);

    const activityLog = this.activityLogRepository.create({
      user,
      activity,
    });

    await this.activityLogRepository.save(activityLog);
  }

  // Fetch all activity logs for a user
  async getActivityLogsByUserId(userId: number): Promise<ActivityLog[]> {
    await this.userService.getUserById(userId);

    return await this.activityLogRepository.find({
      where: { user: { id: userId } },
      relations: {
        activity: true,
        user: true,
      },
      order: { createdAt: 'DESC' }, // Order by most recent activity
    });
  }
}
