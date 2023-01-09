import { IsNotEmpty, IsString, IsDateString, IsIn } from 'class-validator';

export class UpdateSolicitationDto {
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dtInitial: string;

  @IsNotEmpty()
  @IsIn([1, 2, 3, 4, '1', '2', '3', '4'])
  readonly status: string;
}
