import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivityLogModule } from './resources/activity-log/activity-log.module';
import { ProfileModule } from './resources/profile/profile.module';
import configuration from './config/configuration';
import { TasksModule } from './resources/tasks/tasks.module';
import { PropertyModule } from './resources/property/property.module';
import { FavoritesModule } from './resources/favorites/favorites.module';
import { ActivitiesModule } from './resources/activities/activities.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      ignoreEnvFile: false,
      isGlobal: true,
      load: [configuration],
    }),
    ScheduleModule.forRoot(),
    TasksModule,
    UsersModule,
    AuthModule,
    ActivityLogModule,
    ProfileModule,
    PropertyModule,
    FavoritesModule,
    ActivitiesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
