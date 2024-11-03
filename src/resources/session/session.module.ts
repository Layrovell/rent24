import { Module } from '@nestjs/common';

import { DatabaseModule } from 'src/database/database.module';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';

@Module({
  imports: [DatabaseModule],
  providers: [SessionService],
  controllers: [SessionController],
  exports: [SessionService],
})
export class SessionModule {}
