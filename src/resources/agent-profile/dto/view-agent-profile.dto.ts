import { ApiProperty } from '@nestjs/swagger';

import { CreateAgentProfileDto } from './create-agent-profile.dto';

export class ViewAgentProfileDto extends CreateAgentProfileDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  userId: number;
}
