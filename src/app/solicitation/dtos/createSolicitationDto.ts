import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSolicitationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly description: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  readonly dtInitial: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  readonly idArchitect: string;
}
