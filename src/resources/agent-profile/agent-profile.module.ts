import { Module } from '@nestjs/common';

import { AgentProfileService } from './agent-profile.service';
import { AgentProfileController } from './agent-profile.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';
import { AgentProfileHelperProvider } from './agent-profile-helper.provider';

@Module({
  imports: [DatabaseModule, UsersModule],
  providers: [AgentProfileService, AgentProfileHelperProvider],
  controllers: [AgentProfileController],
  exports: [AgentProfileService, AgentProfileHelperProvider],
})
export class AgentProfileModule {}
