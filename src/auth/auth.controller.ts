import {
  BadRequestException,
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

  @Patch(':id/password')
  @UseGuards(JwtAuthGuard, SameUserGuard)
  // SameUserGuard: checks if id param same as id from the token
  updatePassword(
    @Param('id') id: number,
    @Body() dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    // TODO: Add reusable validator for invalid props
    const valiFields = ['oldPassword', 'password'];
    const bodyKeys = Object.keys(dto);

    const invalidProps = bodyKeys.filter((key) => !valiFields.includes(key));

    if (invalidProps.length > 0) {
      throw new BadRequestException(
        `Invalid fields: ${invalidProps.join(', ')}`
      );
    }

    return this.authService.updatePassword(id, dto);
  }
}
