import { Module } from '@nestjs/common';

import { ProfileService } from './profile.service';
import { DatabaseModule } from 'src/database/database.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [DatabaseModule, ActivityLogModule],
  providers: [ProfileService],
  exports: [ProfileService],
})
export class ProfileModule {}
