import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PropertyDetailsService } from './property-details.service';
import { PropertyDetailsController } from './property-details.controller';
import { PropertyModule } from '../property/property.module';
import { WallTypeModule } from '../wall-type/wall-type.module';

@Module({
  imports: [DatabaseModule, PropertyModule, WallTypeModule],
  providers: [PropertyDetailsService],
  exports: [PropertyDetailsService],
  controllers: [PropertyDetailsController],
})
export class PropertyDetailsModule {}
