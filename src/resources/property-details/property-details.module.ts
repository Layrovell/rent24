import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PropertyDetailsService } from './property-details.service';
import { WallTypeModule } from '../wall-type/wall-type.module';
import { PropertyDetailsHelperProvider } from './property-details-helper.provider';
import { PropertyDetailsController } from './property-details.controller';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [DatabaseModule, PropertyModule, WallTypeModule],
  providers: [PropertyDetailsService, PropertyDetailsHelperProvider],
  exports: [PropertyDetailsService, PropertyDetailsHelperProvider],
  controllers: [PropertyDetailsController],
})
export class PropertyDetailsModule {}
