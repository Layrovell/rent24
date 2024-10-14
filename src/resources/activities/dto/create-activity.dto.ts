import { ApiProperty } from '@nestjs/swagger';

import { ActivityCode } from 'src/lib/activities';

export class ViewActivitiesDto {
  @ApiProperty()
  code: ActivityCode;

  @ApiProperty()
  description: string;
}
