import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { Repository, LessThan } from 'typeorm';

import { User } from 'src/entities';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    @Inject(User)
    private readonly userRepository: Repository<User>
  ) {}

  // Cron job that runs every day at midnight to delete users whose grace period has expired
  // @Cron('* * * * *') // Run every minute (for testing purposes)
  @Cron('0 0 * * *') // Runs daily at midnight
  async deleteExpiredUsers(): Promise<void> {
    this.logger.debug('Run user delition job');

    const gracePeriodDays = 3;
    const gracePeriodDate = new Date();
    gracePeriodDate.setDate(gracePeriodDate.getDate() - gracePeriodDays);

    // Users whose deletion date is older than the grace period
    const usersToDelete = await this.userRepository.find({
      where: {
        // Not(IsNull()) - for testing purposes
        deletedAt: LessThan(gracePeriodDate),
      },
      withDeleted: true,
    });

    console.log('=== usersToDelete:', usersToDelete);

    if (usersToDelete.length > 0) {
      // Permanently remove these users
      await this.userRepository.remove(usersToDelete);
      console.log(`${usersToDelete.length} users permanently deleted.`);
    } else {
      console.log('No users found for permanent deletion.');
    }
  }

  @Interval(60000)
  handleInterval() {
    this.logger.debug('Called every 1 minute');
  }
}
