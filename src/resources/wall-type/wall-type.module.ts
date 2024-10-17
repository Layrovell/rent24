import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { WallTypeController } from './wall-type.controller';
import { WallTypeService } from './wall-type.service';

@Module({
  imports: [DatabaseModule],
  providers: [WallTypeService],
  controllers: [WallTypeController],
  exports: [WallTypeService],
})
export class WallTypeModule {}
