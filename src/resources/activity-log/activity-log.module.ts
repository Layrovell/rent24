import { forwardRef, Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { ActivityLogService } from './activity-log.service';
import { ActivitiesModule } from '../activities/activities.module';
import { ActivityLogHelperProvider } from './activity-log-helper.provider';
import { ActivityLogController } from './activity-log.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [DatabaseModule, ActivitiesModule, forwardRef(() => UsersModule)],
  providers: [ActivityLogService, ActivityLogHelperProvider],
  exports: [ActivityLogService, ActivityLogHelperProvider],
  controllers: [ActivityLogController],
})
export class ActivityLogModule {}
