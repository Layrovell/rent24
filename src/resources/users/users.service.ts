import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { EntityManager, IsNull, Not, Repository } from 'typeorm';

import { Profile, User } from 'src/entities';
import { UpdateUserPasswordDto } from './dto/update-user-password.dto';
import { SecurityService } from 'src/security/security.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { CreateProfileDto } from '../profile/dto/create-profile.dto';
import { ActivityCode } from 'src/lib/activities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(User)
    private userRepository: Repository<User>,
    private readonly activityLogService: ActivityLogService, // Inject the activity log service
    private readonly securityService: SecurityService
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
          const createdUser = entityManager.create(User, dto);
          console.log('createdUser:', JSON.stringify(createdUser, null, 4));

          const savedUser = await entityManager.save(createdUser);
          console.log('savedUser:', JSON.stringify(savedUser, null, 4));

          // Create the blank profile
          const createProfileDto: CreateProfileDto = new CreateProfileDto();

          const blankProfile = entityManager.create(Profile, {
            ...createProfileDto,
            user: savedUser, // Associate the profile with the user
          });

          await entityManager.save(blankProfile);

          savedUser.profile = blankProfile;

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
    const users = await this.userRepository.find({
      relations: {
        profile: true,
      },
    });

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

    await this.activityLogService.createActivityLog({
      user: updatedUser,
      activityCode: ActivityCode.PASSWORD_CHANGE,
    });

    return !!updatedUser;
  }

  async softDeleteUser(userId: number): Promise<void> {
    const existingUser = await this.getUserById(userId);

    await this.userRepository.softRemove(existingUser);
    console.log(`SOFT deletion successful for user ID: ${userId}`);
  }

  async recoverUser(userId: number): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {
        id: userId,
        deletedAt: Not(IsNull()),
      },
      withDeleted: true,
    });

    if (!existingUser) {
      throw new NotFoundException(
        `Soft-deleted user with ID ${userId} not found`
      );
    }

    // Set deletedAt back to null to recover the user
    existingUser.deletedAt = null;

    await this.userRepository.save(existingUser);
    console.log(`User ID ${userId} successfully recovered`);

    return existingUser; // Return the recovered user
  }
}
