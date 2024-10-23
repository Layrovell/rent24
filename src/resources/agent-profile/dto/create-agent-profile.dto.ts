import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateAgentProfileDto {
  @ApiProperty()
  @IsString()
  companyName: string;

  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate: number;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(1000)
  fixedFee: number;
}
