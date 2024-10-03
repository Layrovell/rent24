import { ApiProperty } from '@nestjs/swagger';

import { Role } from 'src/entities/user.entity';

export class CreateUserDto {
  @ApiProperty()
	firstName: string;

  @ApiProperty()
	lastName: string;

  @ApiProperty()
	email: string;

  @ApiProperty()
	role: Role;
}
