import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAmenityDto {
  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  valueType?: string;
}
