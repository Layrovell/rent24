import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePropertyAmenityDto {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  value: number | boolean; // Can be a number or a boolean based on the amenity

  @ApiProperty({ default: '' })
  description: string;
}
