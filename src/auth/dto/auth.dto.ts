import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

import { Role } from 'src/entities/user.entity';

export class RegisterDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Must be a valid email address' })
  @IsNotEmpty({ message: 'Email should not be empty' })
  email: string;

  @MinLength(6, { message: 'Password cannot be less then 6 characters' })
  @IsString()
  @ApiProperty()
  password: string;

  @MinLength(2, { message: 'Firstname cannot be less then 2 characters' })
  @IsString()
  @ApiProperty()
  firstName: string;

  @MinLength(2, { message: 'Lastname cannot be less then 2 characters' })
  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  role: Role;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty()
  email: string;

  @MinLength(6, { message: 'Password cannot be less then 6 characters' })
  @IsString()
  @ApiProperty()
  password: string;
}

export class ChangeEmailDto {
  @ApiProperty()
  @IsEmail({}, { message: 'Must be a valid email address' })
  newEmail: string;
}

export class LoginResponseDto {
  refreshToken: string;
  accessToken: string;
}

export class RecoverEmailDto {
  @ApiProperty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  oldEmail: string;

  @ApiProperty()
  @IsEmail()
  newEmail: string;
}
