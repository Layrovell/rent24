import { IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePropertyModerationStatusDto {
  @ApiProperty()
  @IsBoolean()
  isModerated: boolean;
}
