import { IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateSolicitationDto {
  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsDateString()
  readonly dtInitial: string;

  @IsNotEmpty()
  @IsString()
  readonly idArchitect: string;
}
