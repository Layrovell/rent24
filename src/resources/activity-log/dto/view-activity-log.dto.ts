import { ApiProperty } from '@nestjs/swagger';

export class ViewActivityLogDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  code: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  userId: number;
}
