import { Module } from '@nestjs/common';

import { UserProfileService } from './user-profile.service';
import { DatabaseModule } from 'src/database/database.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { UserProfileController } from './user-profile.controller';
import { UsersModule } from '../users/users.module';
import { UserProfileHelperProvider } from './user-profile-helper.provider';

@Module({
  imports: [DatabaseModule, ActivityLogModule, UsersModule],
  providers: [UserProfileService, UserProfileHelperProvider],
  exports: [UserProfileService, UserProfileHelperProvider],
  controllers: [UserProfileController],
})
export class UserProfileModule {}
