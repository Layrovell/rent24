import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './resources/users/users.module';
import { AuthModule } from './auth/auth.module';
import { ActivityLogModule } from './resources/activity-log/activity-log.module';
import { UserProfileModule } from './resources/user-profile/user-profile.module';
import configuration from './config/configuration';
import { TasksModule } from './resources/tasks/tasks.module';
import { PropertyModule } from './resources/property/property.module';
import { FavoritesModule } from './resources/favorites/favorites.module';
import { ActivitiesModule } from './resources/activities/activities.module';
import { PropertyDetailsModule } from './resources/property-details/property-details.module';
import { WallTypeModule } from './resources/wall-type/wall-type.module';
import { AmenitiesModule } from './resources/amenities/amenities.module';
import { PropertyAmenitiesModule } from './resources/property-amenities/property-amenities.module';
import { AgentProfileModule } from './resources/agent-profile/agent-profile.module';
import { EmailModule } from './resources/email/email.module';
import { SanitizeMiddleware } from './middlewares/sanitize.middleware';
import { SessionModule } from './resources/session/session.module';

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
    UserProfileModule,
    PropertyModule,
    FavoritesModule,
    ActivitiesModule,
    PropertyDetailsModule,
    WallTypeModule,
    AmenitiesModule,
    PropertyAmenitiesModule,
    AgentProfileModule,
    EmailModule,
    SessionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SanitizeMiddleware).forRoutes('*'); // Apply to all routes
  }
}
