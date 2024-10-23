import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { UserProfile } from 'src/entities/profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ActivityLogService } from '../activity-log/activity-log.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class UserProfileService {
  constructor(
    @Inject(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private readonly activityLogService: ActivityLogService,
    private readonly userService: UsersService
  ) {}

  async createUserProfile(
    userId: number,
    dto: CreateUserProfileDto
  ): Promise<UserProfile> {
    const existingUserProfile = await this.userProfileRepository.findOne({
      where: { user: { id: userId } },
    });

    if (existingUserProfile) {
      throw new BadRequestException(
        `Profile for user ID ${userId} already exists`
      );
    }

    const user = await this.userService.getUserById(userId);

    const profile = this.userProfileRepository.create({
      ...dto,
      user,
    });

    const savedProfile = await this.userProfileRepository.save(profile);

    await this.userService.updateUserProfile(userId, savedProfile);

    return savedProfile;
  }

  async getProfileByUserId(userId: number): Promise<UserProfile> {
    const existingUserProfile = await this.userProfileRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!existingUserProfile) {
      throw new NotFoundException(
        `Profile for user with the ID ${userId} not found`
      );
    }

    return existingUserProfile;
  }

  async updateProfileByUser(
    userId: number,
    dto: UpdateUserProfileDto
  ): Promise<UserProfile> {
    const existingUserProfile = await this.getProfileByUserId(userId);

    return await this.userProfileRepository.save({
      id: existingUserProfile.id,
      ...existingUserProfile,
      ...dto,
    });
  }
}
