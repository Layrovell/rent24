import { ApiProperty } from '@nestjs/swagger';
import { CreateUserProfileDto } from './create-user-profile.dto';

export class ViewUserProfileDto extends CreateUserProfileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: number;
}
