import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from 'src/entities';
import { UserProfile } from 'src/entities/profile.entity';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { ActivityCode } from 'src/lib/activities';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class UserProfileService {
  constructor(
    @Inject(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    private readonly activityLogService: ActivityLogService
  ) {}

  async createBlankProfile(user: User): Promise<UserProfile> {
    const createProfileDto: CreateUserProfileDto = new CreateUserProfileDto();

    const blankProfile = this.userProfileRepository.create({
      ...createProfileDto,
      user, // Associate the profile with the user
    });

    //  throw Error(`Hi, I'm error`)
    return await this.userProfileRepository.save(blankProfile);
  }

  async getProfileByUser(user: User): Promise<UserProfile> {
    const existingUserProfile = await this.userProfileRepository.findOne({
      where: {
        user: { id: user.id },
      },
    });

    if (!existingUserProfile) {
      throw new NotFoundException(
        `Profile for user with the ID ${user.id} not found`
      );
    }

    return existingUserProfile;
  }

  async updateProfileByUser(
    user: User,
    dto: UpdateUserProfileDto
  ): Promise<UserProfile> {
    // TODO: Is it good for getting the Profile pass the user instead of injecting userService?
    const existingUserProfile = await this.getProfileByUser(user);

    if (dto.description) {
      await this.activityLogService.createActivityLog({
        user: user,
        activityCode: ActivityCode.PROFILE_UPDATE,
      });
    }

    return await this.userProfileRepository.save({
      id: existingUserProfile.id,
      ...existingUserProfile,
      ...dto,
    });
  }
}
