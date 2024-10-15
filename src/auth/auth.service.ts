import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/resources/users/users.service';
import { SecurityService } from 'src/security/security.service';
import { User } from 'src/entities/user.entity';
import { LoginDto, LoginResponseDto, RegisterDto } from './dto/auth.dto';
import { UserHelperProvider } from 'src/resources/users/userMapper.provider';
import { ActivityLogService } from 'src/resources/activity-log/activity-log.service';
import { ActivityCode } from 'src/lib/activities';
import { UpdateUserPasswordDto } from 'src/resources/users/dto/update-user-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
    private readonly activityLogService: ActivityLogService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly userHelperProvider: UserHelperProvider
  ) {}

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(dto);

    return this.generateTokenPair(user);
  }

  async generateTokenPair(user: User): Promise<LoginResponseDto> {
    const userView = this.userHelperProvider.userToViewDto(user);

    const payload = { sub: user.id, user: userView };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET_REFRESH_TOKEN'),
      expiresIn: '15m',
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: '2h',
    });

    return { refreshToken, accessToken };
  }

  async validateUser(dto: LoginDto): Promise<User> {
    const user = await this.userService.getUserByEmail(dto.email);

    if (!user) {
      throw new NotFoundException(`User with email ${dto.email} not found ===`);
    }

    const isValidPassword = await this.securityService.compareData(
      dto.password,
      user.hashedPassword
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async register(dto: RegisterDto): Promise<LoginResponseDto> {
    const hash = await this.securityService.hashData(dto.password);

    const data = {
      email: dto.email,
      firstName: dto.firstName,
      // phone: dto.phone,
      lastName: dto.lastName,
      hashedPassword: hash,
      role: dto.role,
    };

    const newUser = await this.userService.createUser(data);

    await this.activityLogService.createActivityLog({
      user: newUser,
      activityCode: ActivityCode.REGISTRATION,
    });

    const tokens = await this.generateTokenPair(newUser);

    return { ...tokens };
  }

  async updatePassword(
    id: number,
    dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    const existingUser = await this.userService.getUserById(id);

    const isValidPassword = await this.securityService.compareData(
      dto.oldPassword,
      existingUser.hashedPassword
    );

    if (!isValidPassword) {
      throw new BadRequestException('Wrong old password');
    }

    const newHashedPassword = await this.securityService.hashData(dto.password);

    const updatedUser = await this.userService.updateUserPassword(
      existingUser,
      {
        hashedPassword: newHashedPassword,
      }
    );

    await this.activityLogService.createActivityLog({
      user: updatedUser,
      activityCode: ActivityCode.PASSWORD_CHANGE,
    });

    return !!updatedUser;
  }
}
