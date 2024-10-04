import { forwardRef, Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { SecurityModule } from 'src/security/security.module';
import { ActivityLogModule } from '../activity-log/activity-log.module';
import { UserHelperProvider } from './userMapper.provider';

@Module({
  imports: [
    DatabaseModule,
    forwardRef(() => AuthModule),
    SecurityModule,
    ActivityLogModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, UserHelperProvider],
  exports: [UsersService, UserHelperProvider],
})
export class UsersModule {}
