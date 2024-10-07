import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';

import { User } from 'src/entities';
import { Profile } from 'src/entities/profile.entity';
import { CreateProfileDto } from './dto/create-profile.dto';
import { ViewUserProfileDto } from './dto/view-profile.dto';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { ActivityType } from 'src/entities/activity-log.entity';
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

  async getUserProfileById(user: User): Promise<ViewUserProfileDto> {
    const existingUserProfile = await this.profileRepository.findOneBy({
      id: user.profileId,
    });

    if (!existingUserProfile) {
      throw new NotFoundException(
        `Profile for user with the ID ${user.id} not found`
      );
    }

    return existingUserProfile;
  }

  async updateUserProfile(user: User, dto: UpdateUserProfileDto) {
    const existingUserProfile = await this.profileRepository.findOneBy({
      id: user.profileId,
    });

    if (!existingUserProfile) {
      throw new NotFoundException(
        `Profile for user with the ID ${user.id} not found`
      );
    }

    if (!existingUserProfile.description && dto.description) {
      await this.activityLogService.createActivityLog(
        user,
        ActivityType.PROFILE_UPDATE,
        'The profile was updated'
      );
    }

    return await this.profileRepository.save({
      id: existingUserProfile.id,
      ...dto,
    });
  }
}
