import { ApiProperty } from '@nestjs/swagger';

import { ActivityCode } from 'src/lib/activities';

export class CreateActivitiesDto {
  @ApiProperty()
  code: ActivityCode;

  @ApiProperty()
  description: string;
}
