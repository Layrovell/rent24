import { Injectable } from '@nestjs/common';

import { UserProfile } from 'src/entities';
import { ViewUserProfileDto } from './dto/view-user-profile.dto';

@Injectable()
export class UserProfileHelperProvider {
  listToViewDto(profiles: UserProfile[]): ViewUserProfileDto[] {
    const viewUserListDto = profiles.map((profile) => this.toViewDto(profile));

    return viewUserListDto;
  }

  toViewDto(profile: UserProfile): ViewUserProfileDto {
    const viewDto = new ViewUserProfileDto();

    viewDto.id = profile.id;
    viewDto.userId = profile.user.id;
    viewDto.title = profile.title;
    viewDto.description = profile.description;
    viewDto.isLookingForApartment = profile.isLookingForApartment;
    viewDto.createdAt = profile.createdAt;
    viewDto.updatedAt = profile.updatedAt;

    return viewDto;
  }
}
