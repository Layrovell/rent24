import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PropertyDetailsService } from './property-details.service';
import { WallTypeModule } from '../wall-type/wall-type.module';
import { PropertyDetailsHelperProvider } from './property-details-helper.provider';

@Module({
  imports: [DatabaseModule, WallTypeModule],
  providers: [PropertyDetailsService, PropertyDetailsHelperProvider],
  exports: [PropertyDetailsService, PropertyDetailsHelperProvider],
})
export class PropertyDetailsModule {}
