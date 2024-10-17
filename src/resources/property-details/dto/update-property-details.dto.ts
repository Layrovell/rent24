import { PartialType } from '@nestjs/swagger';

import { CreatePropertyDetailsDto } from './create-property-details.dto';

export class UpdatePropertyDetailsDto extends PartialType(
  CreatePropertyDetailsDto
) {}
