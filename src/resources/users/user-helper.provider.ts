import { Injectable } from '@nestjs/common';

import { User } from 'src/entities';
import { ViewUserDto } from './dto/view-user.dto';

@Injectable()
export class UserHelperProvider {
  listToViewDto(users: User[]): ViewUserDto[] {
    const viewListDto = users.map((user) => this.toViewDto(user));

    return viewListDto;
  }

  toViewDto(user: User): ViewUserDto {
    const viewDto = new ViewUserDto();

    viewDto.id = user.id;
    viewDto.firstName = user.firstName;
    viewDto.lastName = user.lastName;
    viewDto.email = user.email;
    viewDto.role = user.role;
    viewDto.createdAt = user.createdAt;
    viewDto.updatedAt = user.updatedAt;
    viewDto.userProfile = user.userProfile;

    return viewDto;
  }
}
