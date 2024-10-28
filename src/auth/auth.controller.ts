import {
  Body,
  Controller,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import {
  ChangeEmailDto,
  LoginDto,
  RecoverEmailDto,
  RegisterDto,
} from './dto/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';
import { UpdateUserPasswordDto } from 'src/resources/users/dto/update-user-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  private readonly update_email_prefix: string = 'verification';
  private readonly recover_email_prefix: string = 'email-recover-verification';

  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // prev: Post
  @Patch(':userId/request-verification-code')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async sendEmail(
    @Param('userId') userId: number,
    @Body() dto: ChangeEmailDto
  ): Promise<{ message: string }> {
    await this.authService.requestVerificationCode(
      userId,
      dto,
      this.update_email_prefix
    );

    return { message: 'Verification email sent' };
  }

  @Post(':userId/change-email')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async changeEmail(
    @Param('userId') userId: number,
    @Body('verificationCode') verificationCode: number
  ): Promise<{ message: string }> {
    await this.authService.verifyAndChangeEmail(
      userId,
      verificationCode,
      this.update_email_prefix
    );

    return { message: 'Email updated successfully' };
  }

  @Post(':userId/recover-email-request-verification') // for changing email
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async requestEmailRecover(
    @Param('userId') userId: number,
    @Body() dto: RecoverEmailDto
  ) {
    await this.authService.requestEmailRecover(
      userId,
      dto,
      this.recover_email_prefix
    );

    // processing...
    return { message: 'Recovery email sent' };
  }

  @Post(':userId/recover-email')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  async recoverEmail(
    @Param('userId') userId: number,
    @Body('verificationCode') verificationCode: number
  ): Promise<{ message: string }> {
    await this.authService.verifyAndChangeEmail(
      userId,
      verificationCode,
      this.recover_email_prefix
    );

    return { message: 'Email changed successfully' };
  }

  @Patch(':userId/password')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  // SameUserGuard: checks if userId param same as id from the token
  updatePassword(
    @Param('userId') userId: number,
    @Body() dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    return this.authService.updatePassword(userId, dto);
  }
}

// I lost email i need to attach new one
// send: firstName, lastName, oldEmail, password -> find this record
// if the record is found -> request newEmail from user
// save new email in database
