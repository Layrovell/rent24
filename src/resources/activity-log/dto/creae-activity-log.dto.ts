import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityLogDto {
  @ApiProperty()
  userId: number;

  @ApiProperty()
  activityCode: string;
}
