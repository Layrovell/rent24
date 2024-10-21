import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { PropertyAmenitiesService } from './property-amenities.service';
import { AmenitiesModule } from '../amenities/amenities.module';
import { PropertyAmenitiesHelperProvider } from './property-amenities-helper.provider';

@Module({
  imports: [DatabaseModule, AmenitiesModule],
  providers: [PropertyAmenitiesService, PropertyAmenitiesHelperProvider],
  exports: [PropertyAmenitiesService, PropertyAmenitiesHelperProvider],
})
export class PropertyAmenitiesModule {}
