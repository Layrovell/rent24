import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { AmenitiesController } from './amenities.controller';
import { AmenitiesService } from './amenities.service';

@Module({
  imports: [DatabaseModule],
  providers: [AmenitiesService],
  controllers: [AmenitiesController],
  exports: [AmenitiesService],
})
export class AmenitiesModule {}
