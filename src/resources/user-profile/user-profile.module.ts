import { Module } from '@nestjs/common';

import { UserProfileService } from './user-profile.service';
import { DatabaseModule } from 'src/database/database.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [DatabaseModule, ActivityLogModule],
  providers: [UserProfileService],
  exports: [UserProfileService],
})
export class UserProfileModule {}
