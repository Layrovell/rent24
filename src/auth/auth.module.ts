import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/resources/users/users.module';
import { SecurityModule } from 'src/security/security.module';
import { JwtStrategy } from 'src/strategies/jwtStrategy';
import { ActivityLogModule } from 'src/resources/activity-log/activity-log.module';
import { EmailModule } from 'src/resources/email/email.module';
import { SessionModule } from 'src/resources/session/session.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => UsersModule),
    SecurityModule,
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    ActivityLogModule,
    EmailModule,
    SessionModule,
  ],
  // JWT strategy extracts and attaches the user to the req
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
