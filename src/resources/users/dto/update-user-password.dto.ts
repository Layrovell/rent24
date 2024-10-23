import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

import { IsNotEqual } from 'src/common/validators/is-not-equal.validator';

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsNotEqual('oldPassword', {
    message: 'Password should not be the same as old password',
  })
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  oldPassword: string;
}
