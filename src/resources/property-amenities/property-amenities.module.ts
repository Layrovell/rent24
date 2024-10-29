import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PropertyAmenitiesService } from './property-amenities.service';
import { AmenitiesModule } from '../amenities/amenities.module';
import { PropertyAmenitiesHelperProvider } from './property-amenities-helper.provider';
import { PropertyAmenitiesController } from './property-amenities.controller';
import { PropertyModule } from '../property/property.module';

@Module({
  imports: [DatabaseModule, AmenitiesModule, PropertyModule],
  providers: [PropertyAmenitiesService, PropertyAmenitiesHelperProvider],
  exports: [PropertyAmenitiesService, PropertyAmenitiesHelperProvider],
  controllers: [PropertyAmenitiesController],
})
export class PropertyAmenitiesModule {}
