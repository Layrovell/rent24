import { Injectable } from '@nestjs/common';
import { User } from 'src/entities';
import { ViewUserDto } from './dto/view-user.dto';

@Injectable()
export class UserHelperProvider {
  userListToViewDto(users: User[]): ViewUserDto[] {
    const viewUserListDto = users.map((user) => this.userToViewDto(user));

    return viewUserListDto;
  }

  userToViewDto(user: User): ViewUserDto {
    const viewUserDto = new ViewUserDto();

    viewUserDto.id = user.id;
    viewUserDto.firstName = user.firstName;
    viewUserDto.lastName = user.lastName;
    viewUserDto.email = user.email;
    viewUserDto.role = user.role;
    viewUserDto.createdAt = user.createdAt;
    viewUserDto.updatedAt = user.updatedAt;
    viewUserDto.profile = user.profile;

    return viewUserDto;
  }
}
