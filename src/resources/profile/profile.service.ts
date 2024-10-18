import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from 'src/entities';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { ActivityCode } from 'src/lib/activities';
import { ActivityLogService } from '../activity-log/activity-log.service';

@Injectable()
export class ProfileService {
  constructor(
    @Inject(Profile)
    private profileRepository: Repository<Profile>,
    private readonly activityLogService: ActivityLogService
  ) {}

  async createBlankProfile(user: User): Promise<Profile> {
    const createProfileDto: CreateProfileDto = new CreateProfileDto();

    const blankProfile = this.profileRepository.create({
      ...createProfileDto,
      user, // Associate the profile with the user
    });

    //  throw Error(`Hi, I'm error`)
    return await this.profileRepository.save(blankProfile);
  }

  async getProfileByUser(user: User): Promise<Profile> {
    const existingUserProfile = await this.profileRepository.findOne({
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
  ): Promise<Profile> {
    // TODO: Is it good for getting the Profile pass the user instead of injecting userService?
    const existingUserProfile = await this.getProfileByUser(user);

    if (dto.description) {
      await this.activityLogService.createActivityLog({
        user: user,
        activityCode: ActivityCode.PROFILE_UPDATE,
      });
    }

    return await this.profileRepository.save({
      id: existingUserProfile.id,
      ...dto,
    });
  }
}
