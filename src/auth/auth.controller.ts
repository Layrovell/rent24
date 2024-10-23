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
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { SameUserGuard } from 'src/guards/same-user.guard';
import { UpdateUserPasswordDto } from 'src/resources/users/dto/update-user-password.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('register')
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
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
