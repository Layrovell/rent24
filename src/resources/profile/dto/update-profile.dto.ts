import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateProfileDto } from './create-profile.dto';

export class UpdateUserProfileDto extends PartialType(
  OmitType(CreateProfileDto, ['userId'])
) {}
