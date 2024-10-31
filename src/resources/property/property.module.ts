import { forwardRef, Module } from '@nestjs/common';

import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';
import { PropertyHelperProvider } from './property-helper.provider';
import { ActivityLogModule } from '../activity-log/activity-log.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => UsersModule), ActivityLogModule],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyHelperProvider],
  exports: [PropertyService, PropertyHelperProvider],
})
export class PropertyModule {}
