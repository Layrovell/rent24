import { Module } from '@nestjs/common';

import { UsersModule } from 'src/resources/users/users.module';
import { DatabaseModule } from 'src/database/database.module';
import { TasksService } from './tasks.service';

@Module({
  imports: [
    DatabaseModule,
    UsersModule, // Import UserModule for UserRepository
  ],
  providers: [TasksService],
})
export class TasksModule {}
