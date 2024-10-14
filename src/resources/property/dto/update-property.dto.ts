import { OmitType, PartialType } from '@nestjs/swagger';

import { CreatePropertyDto } from './create-property.dto';

export class UpdatePropertyDto extends PartialType(
  OmitType(CreatePropertyDto, ['city', 'country', 'userId'])
) {
  // extends 'description' or 'title' prop, partially
  // excludes omitted props
}
