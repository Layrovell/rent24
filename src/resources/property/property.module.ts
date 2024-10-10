import { Module } from '@nestjs/common';

import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { DatabaseModule } from 'src/database/database.module';
import { UsersModule } from '../users/users.module';
import { PropertyHelperProvider } from './property-helper.provider';

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [PropertyController],
  providers: [PropertyService, PropertyHelperProvider],
  exports: [PropertyHelperProvider],
})
export class PropertyModule {}
