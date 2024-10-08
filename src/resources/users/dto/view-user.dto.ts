import { ApiProperty } from '@nestjs/swagger';

import { Role } from 'src/entities/user.entity';

export class ViewUserDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  role: Role;

  @ApiProperty()
  createdAt: Date;
  @ApiProperty({})
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date;

  @ApiProperty()
  profileId: number;
}
