import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager, Repository } from 'typeorm';

import { User } from 'src/entities';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SecurityService } from 'src/security/security.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { ActivityType } from 'src/entities/activity-log.entity';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UsersService {
  constructor(
    @Inject(User)
    private userRepository: Repository<User>,
    private readonly activityLogService: ActivityLogService, // Inject the activity log service
    private readonly securityService: SecurityService,
    private readonly profileService: ProfileService
  ) {}

  async getUserById(userId: number): Promise<User> {
    const user = await this.userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundException(`User with the ID ${userId} not found`);
    }

    return user;
  }

  async getUserByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) return null;

    return user;
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    const oldUser = await this.getUserByEmail(dto.email);

    if (oldUser) {
      throw new BadRequestException(`Email ${dto.email} is already in use`);
    }

    // Start a transaction
    return await this.userRepository.manager.transaction(
      async (entityManager: EntityManager) => {
        try {
          // Create the user first
          const createdUser = entityManager.create(User, dto);
          const savedUser = await entityManager.save(createdUser);

          // Create the blank profile
          const profile =
            await this.profileService.createBlankProfile(savedUser);

          savedUser.profile = profile;

          // Save the user again to establish the relationship
          return await entityManager.save(savedUser);
        } catch (error) {
          console.error('transaction error:', error);
          throw new InternalServerErrorException(
            'Unable to register user. Please try again later'
          );
        }
      }
    );
  }

  async getAllUsers() {
    const users = await this.userRepository.find();

    if (!users.length) {
      throw new NotFoundException(`The list of users is empty`);
    }

    return users;
  }

  async updatePassword(
    id: number,
    dto: UpdateUserPasswordDto
  ): Promise<boolean> {
    const existingUser = await this.getUserById(id);

    const isValidPassword = await this.securityService.compareData(
      dto.oldPassword,
      existingUser.hashedPassword
    );

    if (!isValidPassword) {
      throw new BadRequestException('Wrong old password');
    }

    const newHashedPassword = await this.securityService.hashData(dto.password);

    const updatedUser = await this.userRepository.save({
      ...existingUser,
      hashedPassword: newHashedPassword,
    });

    await this.activityLogService.createActivityLog(
      updatedUser,
      ActivityType.PASSWORD_CHANGE,
      'The password was changed'
    );

    return !!updatedUser;
  }
}
