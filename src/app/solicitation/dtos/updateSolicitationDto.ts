import { IsNotEmpty, IsString, IsDateString, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateSolicitationDto {
  @IsNotEmpty()
  @IsString()
  @ApiPropertyOptional()
  readonly description: string;

  @IsNotEmpty()
  @IsDateString()
  @ApiPropertyOptional()
  readonly dtInitial: string;

  @IsNotEmpty()
  @IsIn([1, 2, 3, 4, '1', '2', '3', '4'])
  @ApiPropertyOptional({ enum: [1, 2, 3, 4] })
  readonly status: string;
}
