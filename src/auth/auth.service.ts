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
// import NodeCache from 'node-cache';
import * as NodeCache from 'node-cache';

import { UsersService } from 'src/resources/users/users.service';
import { SecurityService } from 'src/security/security.service';
import { User } from 'src/entities/user.entity';
import {
  ChangeEmailDto,
  LoginDto,
  LoginResponseDto,
  RecoverEmailDto,
  RegisterDto,
} from './dto/auth.dto';
import { UserHelperProvider } from 'src/resources/users/user-helper.provider';
import { ActivityLogService } from 'src/resources/activity-log/activity-log.service';
import { ActivityCode } from 'src/lib/activities';
import { UpdateUserPasswordDto } from 'src/resources/users/dto/update-user-password.dto';
import { EmailService } from 'src/resources/email/email.service';
import { SessionService } from 'src/resources/session/session.service';

@Injectable()
export class AuthService {
  private readonly cache: NodeCache;
  private readonly CODE_EXPIRATION = 3600; // Code expiration in seconds (1 hour)

  constructor(
    private readonly jwtService: JwtService,
    private readonly securityService: SecurityService,
    private readonly activityLogService: ActivityLogService,
    private readonly config: ConfigService,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
    private readonly userHelperProvider: UserHelperProvider,
    private readonly emailService: EmailService,
    private readonly sessionService: SessionService
  ) {
    this.cache = new NodeCache({ stdTTL: this.CODE_EXPIRATION }); // Initialize cache with TTL (Time To Live)
  }

  async login(dto: LoginDto): Promise<LoginResponseDto> {
    const user = await this.validateUser(dto);

    await this.activityLogService.createActivityLog({
      userId: user.id,
      activityCode: ActivityCode.LOGIN,
    });

    return this.generateTokenPair(user);
  }

  async generateTokenPair(user: User): Promise<LoginResponseDto> {
    const userView = this.userHelperProvider.toViewDto(user);

    const payload = { sub: user.id, user: userView };

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET_REFRESH_TOKEN'),
      expiresIn: '7d',
    });

    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.config.get<string>('SECRET'),
      expiresIn: '2h',
    });

    // Store refreshToken in session
    await this.sessionService.createSession({
      refreshToken: refreshToken,
      user: user,
      deviceName: 'dddeviceName',
      location: 'lllocation',
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

    return !!updatedUser;
  }

  async requestVerificationCode(
    userId: number,
    dto: ChangeEmailDto,
    cachePrefix: string
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);

    const existingEmail = await this.userService.getUserByEmail(dto.newEmail);

    if (existingEmail) {
      throw new BadRequestException(`Email ${dto.newEmail} already in use`);
    }

    const verificationCode = this.securityService.generateVerificationCode();

    this.cache.set(`${cachePrefix}:${user.id}`, {
      newEmail: dto.newEmail,
      verificationCode,
    });

    await this.emailService.sendVerificationEmail(
      dto.newEmail,
      verificationCode
    );
  }

  async verifyAndChangeEmail(
    userId: number,
    verificationCode: number,
    cachePrefix: string
  ): Promise<void> {
    const user = await this.userService.getUserById(userId);

    const cacheData = this.cache.get<{
      newEmail: string;
      verificationCode: string;
    }>(`${cachePrefix}:${user.id}`);

    // Check if verification code and new email exist in the cache
    if (!cacheData || +cacheData.verificationCode !== verificationCode) {
      throw new BadRequestException('Invalid or expired verification code');
    }

    await this.userService.updateEmail(userId, cacheData.newEmail);

    // Remove cache data after successful verification
    this.cache.del(`${cachePrefix}:${userId}`);
  }

  async requestEmailRecover(
    userId: number,
    dto: RecoverEmailDto,
    cachePrefix: string
  ): Promise<any> {
    const user = await this.userService.getUserById(userId);

    // Validate user details
    this.validateUserDetails(user, dto);

    const isValidPassword = await this.securityService.compareData(
      dto.password,
      user.hashedPassword
    );

    if (!isValidPassword) {
      throw new UnauthorizedException('Wrong password');
    }

    const existingEmail = await this.userService.getUserByEmail(dto.newEmail);

    if (existingEmail) {
      throw new BadRequestException('Email already exists');
    }

    const verificationCode = this.securityService.generateVerificationCode();

    this.cache.set(`${cachePrefix}:${user.id}`, {
      newEmail: dto.newEmail,
      verificationCode,
    });

    await this.emailService.sendVerificationEmail(
      dto.newEmail,
      verificationCode
    );
  }

  async refreshTokens(oldRefreshToken: string): Promise<LoginResponseDto> {
    // Verify if the session with this refresh token exists and is still valid
    const session = await this.sessionService.findByToken(oldRefreshToken);

    const user = await this.userService.getUserById(session.user.id);

    const { accessToken, refreshToken: newRefreshToken } =
      await this.generateTokenPair(user);

    await this.sessionService.updateSession({
      sessionId: session.id,
      newRefreshToken: newRefreshToken,
      deviceName: 'dddeviceName',
      location: 'lllocation',
      online: true,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  // Helper method for validation
  private validateUserDetails(user: User, dto: RecoverEmailDto): void {
    const errors = [];

    if (user.firstName !== dto.firstName) {
      errors.push('Wrong first name');
    }
    if (user.lastName !== dto.lastName) {
      errors.push('Wrong last name');
    }
    if (user.email !== dto.oldEmail) {
      errors.push('Wrong old email');
    }
    if (dto.newEmail === user.email) {
      errors.push('Previously used email');
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors);
    }
  }
}
