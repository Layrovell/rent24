import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { ActivityLogService } from './activity-log.service';

@Module({
  imports: [DatabaseModule],
  providers: [ActivityLogService],
  exports: [ActivityLogService], // Export to be used in other modules like UserModule
})
export class ActivityLogModule {}
